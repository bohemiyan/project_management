const express = require('express');
const { logWriter } = require('../Logger/LogWriter.js');
const JOBS = require('../Models/projects.js');
const COMPANY = require('../Models/companys.js');
const { AUTH } = require('../Middleware/authentication.js');
const { getTime, timestampTovisual, calculateDaysAgo, calculateDaysAgoFromTimestamp } = require('../Helpers/TimeHelper.js');
const APPLICATIONS = require('../Models/Applications.js');

const employeeRouter = express.Router();
const logger = logWriter('EMPLOYEE-ROUTER');


employeeRouter.get('/dashboard', AUTH, async (req, res) => {
  const { userID } = req;
  try {
    const companies = await COMPANY.find({ userID });

    const dashboardData = await Promise.all(companies.map(async (company) => {
      const companyID = company._id;
      const companyName = company.companyName;
      const companyImage = company.imageurl;

      const jobs = await JOBS.find({ companyID });
      const totalJobs = jobs.length;

      const jobsWithApplicants = await Promise.all(jobs.map(async (job) => {
        const _id = job._id;
        const jobTitle = job.jobTitle;
        const jobstatus = job.status;

        const totalApplicants = await APPLICATIONS.countDocuments({ jobID: job._id });
        const applications = await APPLICATIONS.find({ jobID: job._id }, 'appliedOn');

        const applicationsData = applications.map(application => ({
          appliedOn: application.appliedOn,
          numberOfApplicants: 1
        }));

        return { jobTitle, _id, jobstatus, totalApplicants, applicationsData };
      }));

      return { companyName, companyID, companyImage, totalJobs, jobs: jobsWithApplicants };
    }));

    let graphData = [];
    dashboardData.forEach(company => {
      company.jobs.forEach(job => {
        job.applicationsData.forEach(application => {
          const dateStr = timestampTovisual(application.appliedOn).formattedDate;
          const existingEntry = graphData.find(entry => entry.appliedOn === dateStr);
          if (existingEntry) {
            existingEntry.numberOfApplicants += 1;
          } else {
            graphData.push({
              appliedOn: dateStr,
              numberOfApplicants: 1
            });
          }
        });
      });
    });

    // Remove applicationsData from the jobs in dashboardData
    dashboardData.forEach(company => {
      company.jobs.forEach(job => {
        delete job.applicationsData;
      });
    });

    logger.info({ message: 'Dashboard data retrieved successfully' });

    return res.status(200).json({ status: 'success', companies: dashboardData, graph: graphData });
  } catch (error) {
    logger.error({ message: 'Failed to get dashboard data', error: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});



// Route to add a job
employeeRouter.post('/job', AUTH, async (req, res) => {
  try {
    const { userID } = req;
    const { companyName, rating, city, state, country, jobTitle, language, jobType, remote, education, experience, salary, description, requiredSkills } = req.body;
    const company = await COMPANY.findOne({ companyName, userID });

    if (!company) {
      logger.warn({ message: 'Company not found', companyName });
      return res.status(404).json({ error: 'Company not found' });
    }

    const jobDoc = {
      companyName: company.companyName,
      companyID: company._id,
      rating,
      city,
      state,
      country,
      jobTitle,
      date: getTime('timestamp'),
      language,
      jobType,
      remote,
      education,
      experience,
      requiredSkills,
      salary,
      description,
      userID,
      status: 'Active'
    };

    const job = await JOBS.create(jobDoc);

    logger.info({ message: 'Job added successfully', job });
    return res.status(200).json({ status: 'success', job });
  } catch (error) {
    // console.log(error);
    logger.error({ message: 'Failed to add job', error: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update a job by ID
employeeRouter.put('/job/:jobId', AUTH, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userID } = req;
    const { companyName, rating, city, state, country, jobTitle,  language, jobType, remote, education, experience, salary, description, requiredSkills, status } = req.body;

    // Find the job to get the companyID
    const job = await JOBS.findOne({ _id: jobId, userID });

    if (!job) {
      logger.warn({ message: 'Job not found', jobId });
      return res.status(404).json({ error: 'Job not found' });
    }

    // Find the company to verify the owner
    const company = await COMPANY.findById(job.companyID);

    if (!company || company.userID.toString() !== userID.toString()) {
      logger.warn({ message: 'Unauthorized attempt to update job', jobId, userID });
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Proceed to update the job
    const updatedJob = await JOBS.findByIdAndUpdate(jobId,
      { companyName, rating, city, state, country, jobTitle, language, jobType, remote, education, experience, salary, description, requiredSkills, userID, status },
      { new: true }
    );

    if (!updatedJob) {
      logger.warn({ message: 'Job not found after update attempt', jobId });
      return res.status(404).json({ error: 'Job not found' });
    }

    logger.info({ message: 'Job updated successfully', updatedJob });
    return res.status(200).json({ status: 'success', job: updatedJob });
  } catch (error) {
    logger.error({ message: 'Failed to update job', error: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to get jobs with optional filters
employeeRouter.post('/get_job', AUTH, async (req, res) => {
  try {
    const { userID } = req;
    const { _id, companyName, companyId, dateRange, jobtitle, location, status } = req.body;

    // Initialize the base query with the userID filter
    let query = { userID };

    // Apply additional filters if provided
    if (_id) {
      query._id = _id;
    }
    if (companyId) {
      query.companyID = companyId;
    }
    if (companyName) {
      query.companyName = { $regex: companyName, $options: 'i' };;
    }
    if (status) {
      query.status = status;
    }
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (jobtitle) {
      query.jobtitle = { $regex: jobtitle, $options: 'i' };;
    }
    if (location) {
      query.$or = [
        { city: location },
        { state: location },
        { country: location }
      ];
    }

    const jobs = await JOBS.find(query);

    // Count the number of applicants for each job
    const jobsWithApplicantsCount = await Promise.all(jobs.map(async (job) => {

      const applicantsCount = await APPLICATIONS.countDocuments({ jobID: job._id });
      return {
        ...job.toObject(),
        date: timestampTovisual(job.date).formattedDate,
        posted: `${calculateDaysAgoFromTimestamp(job.date)}`,
        applicantsCount
      };
    }));

    logger.info({ message: 'Jobs retrieved successfully', count: jobs.length });
    return res.status(200).json({ status: 'success', count: jobs.length, jobs: jobsWithApplicantsCount });
  } catch (error) {
    logger.error({ message: 'Failed to get jobs', error: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a job by ID
employeeRouter.delete('/job/:jobId', AUTH, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userID } = req;
    const deletedJob = await JOBS.findOneAndDelete({ _id: jobId, userID });

    if (!deletedJob) {
      logger.warn({ message: 'Job not found', jobId });
      return res.status(404).json({ error: 'Job not found' });
    }

    logger.info({ message: 'Job deleted successfully', deletedJob });
    return res.status(200).json({ status: 'success', job: deletedJob });
  } catch (error) {
    logger.error({ message: 'Failed to delete job', error: error.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = { employeeRouter };

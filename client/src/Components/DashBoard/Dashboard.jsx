import React, { useEffect, useState } from 'react';
import Donut from './Chart/Donut';  // Assuming Donut chart component is used
import BarGraph from './Chart/BarGraph';  // Assuming BarGraph component is used
import LineGraph from './Chart/Linegraph';
import { Card, CardContent, Grid } from '@mui/material';
import styled from 'styled-components';
import { getDashboardApi } from '../../Api/EmployersApi';
import { useNavigate } from 'react-router-dom';


const StyledCard = styled(Card)(({ theme }) => ({
  margin: '15px',
  display: 'flex',
  flexDirection: 'column',
}));


const styles = {
  companyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    marginTop: '20px',
    flex: '1 0 30%', // Adjust width and responsiveness
    minWidth: '300px', // Minimum width for each card
    maxWidth: '600px', // Maximum width for each card
    marginLeft: '10px',
    marginRight: '10px',
    backgroundColor: '#ffffff',
  },
  companyName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333333', // Dark grey color for company name
    marginBottom: '10px',
  },
  jobTitle: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#555555', // Medium grey color for job title
  },
  jobStatus: {
    fontSize: '0.9rem',
    fontWeight: '400',
    color: '#777777', // Lighter grey color for job status
  },
  totalApplicants: {
    fontSize: '0.9rem',
    fontWeight: '400',
    color: '#999999', // Lightest grey color for total applicants
  },
  jobsList: {
    marginRight: '20px',
    flex: '1', // Take up remaining space
  },
  donutChart: {
    flex: '1', // Take up remaining space
  },
  companyCardsContainer: {
    display: 'flex',
    flexWrap: 'wrap', // Wrap items to new line when needed
    justifyContent: 'center',
  },
  cardContainer: {
    marginTop: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
  },
};

const Dashboard = () => {
  const [DashboardData, setDashboardData] = useState([]);
  const [CompanisData, setCompanisData] = useState([]);
  const [jobData, setjobData] = useState([]);
  const [graphData, setgraphData] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchdata = async () => {
      const res = await getDashboardApi();
      if (res && res.status === 'success') {

        const companies = res.companies;
        if (companies.length < 1) {
          navigate('/addcompany');
          return;
        }
        setCompanisData(res.companies);
        setjobData(res.companies[0].jobs);
        setgraphData(res.graph)
      }


    }
    fetchdata();
  }, [])


  return (
    <div>


      <Grid container spacing={1}>
        <Grid item xs={2} md={6}>
          <StyledCard>
            <CardContent>
              <LineGraph data={graphData} />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={2} md={6}>
          <StyledCard>
            <CardContent>
              <BarGraph companies={CompanisData} />
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      <div style={styles.companyCardsContainer}>
        {jobData.map((job, index) => (
          <div key={index}
            style={styles.companyContainer}
            onClick={() => navigate(`/jobpage/${job._id}`)}
          >
            <div style={styles.jobsList}>
              <div style={styles.companyName}>{job.companyName}</div>

              <div style={styles.jobTitle}>{job.jobTitle}</div>
              <div style={styles.jobStatus}>Status: {job.jobstatus || 'N/A'}</div>
              <div style={styles.totalApplicants}>Total Applicants: {job.totalApplicants}</div>


            </div>
            <div style={styles.donutChart}>
              {/* <Donut company={job} /> */}
            </div>
          </div>
        ))}
      </div>

      {/* <div style={styles.companyCardsContainer}>
        {CompanisData.map((company, index) => (
          <div key={index} style={styles.companyContainer}>
            <div style={styles.jobsList}>
              <div style={styles.companyName}>{company.companyName}</div>
              <ul>
                {company.jobs.map((job, jobIndex) => (
                  <li key={jobIndex}>
                    <div style={styles.jobTitle}>{job.jobTitle}</div>
                    <div style={styles.jobStatus}>Status: {job.jobstatus || 'N/A'}</div>
                    <div style={styles.totalApplicants}>Total Applicants: {job.totalApplicants}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div style={styles.donutChart}>
              <Donut company={company} />
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Dashboard;

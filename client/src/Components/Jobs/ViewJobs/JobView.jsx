import React, { useEffect, useState } from 'react'
import SearchJob from './SearchJobs/SearchJob'
import { Filters } from './Filterjobs/Filters'
import { JobCards } from './JobCardAndDetails/JobCards';
import { JobDetails } from './JobCardAndDetails/JobDetails';

import './JobView.css';
import ReactPaginate from 'react-paginate';
import { generateDemoJobs } from '../jobdemodata';
import { getJobApi } from '../../../Api/EmployersApi';
import { useLocation, useParams } from 'react-router-dom';
import { getAllJobsApi, getapplyedJobsApi, getsaveJobsApi } from '../../../Api/StudentsApi';

const JobView = () => {
  // let jobs = generateDemoJobs();
  const { jobid } = useParams();
  const [Heading, setHeading] = useState('');
  const [jobs, setjobs] = useState([])
  const [searchedJobs, setsearchedJobs] = useState(jobs);
  const [FilteredJobs, setFilteredJobs] = useState(searchedJobs);
  const [sort, setSort] = useState(true);
  const [fa, setFa] = useState(true);
  const [details, setDetails] = useState("")
  const [crossit, setCrossit] = useState(true)
  const [pageNumber, setpageNumber] = useState(0)

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isapplyed = searchParams.get('applyed');
  const isSaved = searchParams.get('saved');
  const isemp = localStorage.getItem('role') === 'emp';

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }, [pageNumber]);


  useEffect(() => {
    const fetchJob = async () => {
      let response;
      let heading;

      if (jobid) {
        heading = "About Job";
        response = await getJobApi({ _id: jobid });
      } else if (isapplyed) {
        heading = "Applied Jobs";
        response = await getapplyedJobsApi();
      } else if (isSaved) {
        heading = "Saved Jobs";
        response = await getsaveJobsApi();
      } else if (isemp) {
        heading = "MY Jobs";
        response = await getJobApi();
      } else {
        heading = "All Jobs";
        response = await getAllJobsApi();
      }

      setHeading(heading);
      setpageNumber(0);

      if (response && response.status === 'success') {
        const jobs = response.jobs;
        setjobs(jobs);
        setsearchedJobs(jobs);
        setFilteredJobs(jobs);
        // setDetails(jobs.length > 0 ? jobs[0] : "");
        setCrossit(false)
        // console.log(FilteredJobs[0]);
      }
    };

    fetchJob();
  }, [jobid, isapplyed, isSaved, isemp]);



  const usersPerPage = 5
  const pagesVisited = pageNumber * usersPerPage;
  const displayjobs = FilteredJobs.slice(pagesVisited, pagesVisited + usersPerPage)
  const pageCount = Math.ceil(FilteredJobs.length / usersPerPage);

  useEffect(() => {
    // setDetails(displayjobs.length > 0 ? displayjobs[0] : "");
    setCrossit(true);
    setpageNumber(0)
  }, [FilteredJobs])


  const changePage = ({ selected }) => {
    setpageNumber(selected)
  };

  return (
    <div>
      <SearchJob setsearchedJobs={setsearchedJobs} jobs={jobs} />
      <Filters setFilteredJobs={setFilteredJobs} jobs={searchedJobs} />


      <div className="middle-container" >
        <div className="Left-container">
          <div className="pages">
            <h3>{Heading} : </h3>
            <div>

              <div className="sort">
                Sort by : <span className={sort ? "grey" : "blue"} onClick={() => {
                  let x = FilteredJobs.sort((a, b) => {
                    return (b.rating - a.rating)
                  })
                  setSort(!sort)

                  setFa(!fa)
                  setFilteredJobs(x)
                }}
                >Relavance</span> - <span className={sort ? "blue" : "grey"} onClick={() => {
                  let x = FilteredJobs.sort((a, b) => {
                    return (a.date - b.date)
                  })
                  setFa(!fa)
                  setSort(!sort)
                  setFilteredJobs(x)
                }}>Date</span>
              </div>
              <div>
                Page {pageNumber + 1} of {FilteredJobs.length} jobs
              </div>
            </div>
          </div>

          {/* //==============================job cards==================== */}

          <div className="jobs-container">
            {
              displayjobs.map((job) => {

                return <JobCards setCrossit={setCrossit} key={job._id} job={job} setDetails={setDetails} />
              })
            }
          </div>

          <div className="paginate">
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginateBttns"}
              previousLinkClassName={"previousBn"}
              nextLinkClassName={"nextBn"}
              disabledClassName={"paginateDisabled"}
              activeClassName={"paginateActive"}
              forcePage={pageNumber} 
            />
          </div>
        </div>

        {/* //========================job details================== */}
        <div className={crossit ? "hideit" : "right-container"} >
          {details === "" ? null : <JobDetails job={details} crossit={crossit} setCrossit={setCrossit} />}
        </div>
      </div>

    </div>
  )
}

export default JobView
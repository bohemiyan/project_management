import React, { useEffect } from 'react';
import './JobDetails.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarRatings from 'react-star-ratings';
import { saveJobsApi, unsaveJobsApi } from '../../../../Api/StudentsApi';

export const JobDetails = ({ job, crossit, setCrossit }) => {
    const role = localStorage.getItem("role");
    const isadmin = role === 'admin';
    const [saved, setSaved] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setSaved(job.saved)
    }, [job])

    const handlesave = async () => {
        const apiCall = saved ? unsaveJobsApi : saveJobsApi;
        const response = await apiCall(job._id);

        if (response && response.status === 'success') {
            setSaved(!saved);
        }
    };

    return (
        <div className='jobDetails-container'>
            <div className="jobHeadings">
                <div className="titlee">
                    <h3>{job.jobTitle}</h3>
                    <svg onClick={() => setCrossit(!crossit)} className="cross" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m15.536 7.8987c-0.1953-0.19526-0.5119-0.19526-0.7071 0l-2.8284 2.8284-2.8285-2.8284c-0.19526-0.19527-0.51185-0.19527-0.70711 0l-0.56568 0.56568c-0.19527 0.19526-0.19526 0.51185 0 0.70711l2.8285 2.8284-2.8285 2.8285c-0.19526 0.1952-0.19526 0.5118 0 0.7071l0.56568 0.5657c0.19527 0.1952 0.51185 0.1952 0.70711 0l2.8285-2.8285 2.8284 2.8284c0.1952 0.1953 0.5118 0.1953 0.7071 0l0.5657-0.5657c0.1952-0.1953 0.1952-0.5118 0-0.7071l-2.8284-2.8284 2.8283-2.8284c0.1953-0.19526 0.1953-0.51184 0-0.70711l-0.5656-0.56568z" clipRule="evenodd" fill="#2D2D2D" fillRule="evenodd"></path>
                    </svg>
                </div>
                <div className="c">
                    <h4>{job.companyName}</h4>
                </div>

                <h4>{job.city}, {job.state}</h4>
                <div className="apply">
                    {role === 'emp' ? (
                        <>
                            <div className="applyButton" onClick={() => navigate(`/editjob/${job._id}`)}>Edit Job</div>
                            <div className="applyButton" onClick={() => navigate(`/applications/${job._id}`)}>{job.applicantsCount}-applicants</div>
                        </>
                    ) : (
                        !isadmin && (
                            <>
                                {job.applied ? (
                                    <div className="applyButton">
                                        {job.status === 'pending' ? (
                                            <h5>Application Pending</h5>
                                        ) : job.status === 'accepted' ? (
                                            <h5>Application Accepted</h5>
                                        ) : job.status === 'rejected' ? (
                                            <h5>Application Rejected</h5>
                                        ) : (
                                            <h5>Already Applied</h5>
                                        )}
                                    </div>
                                ) : (
                                    <div className="applyButton" onClick={() => navigate(`/apply/${job._id}`)}>Apply Now</div>
                                )}
                            </>
                        )
                    )}

                    {role !== 'emp' && (
                        saved ? (
                            <FavoriteIcon onClick={handlesave} style={{ cursor: 'pointer', color: 'grey' }} />
                        ) : (
                            <FavoriteBorderIcon onClick={handlesave} style={{ cursor: 'pointer' }} />
                        )
                    )}
                </div>
            </div>
            <div className="detailed">
                <div id="jobDescriptionText" className="jobsearch-jobDescriptionText">
                    <h3>Details:  </h3>
                    <Typography dangerouslySetInnerHTML={{ __html: job.description }} />
                    <p>
                        <strong>Location:</strong> {job.city}, {job.state}, {job.country} <br />
                        <strong>Job Type:</strong> {job.jobType} <br />
                        <strong>Work Mode:</strong> {job.remote} <br />
                        <strong>Required Language:</strong> {job.language} <br />
                        <strong>Required Education:</strong> {job.education} <br />
                        <strong>Required Experience:</strong> {job.experience} years <br />
                        <strong>Required Skills:</strong> {job.requiredSkills.join(", ")} <br />
                        <strong>Salary (CTC):</strong> {job.salary} <br />
                        <strong>Date Posted:</strong> {job.date} <br />
                    </p>
                </div>
            </div>
        </div>
    );
};

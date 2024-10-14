import React, { useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import StarRateIcon from '@mui/icons-material/StarRate';
import './jobcards.css';

export const JobCards = ({ job, setDetails, setCrossit }) => {
    const [state, setState] = React.useState(false);
    const [status, setStatus] = React.useState(true);
    const dotsRef = useRef(null);

    const handleClick = () => {
        setState((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (dotsRef.current && !dotsRef.current.contains(event.target)) {
            setState(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const saveJob = (e) => {

    };

    return (
        <div
            id={job.id}
            className={status ? 'card' : 'shrinkk'}
            onClick={() => {
                setDetails(job);
                setCrossit(false);
            }}
        >
            <nav className={status ? 'dis' : 'rem'}>
                <div className="top">
                    {job.posted <= 7 &&
                        <p className="new">new</p>
                    }

                    {/* <div className="dots" onClick={handleClick} ref={dotsRef}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <Paper className={state ? 'show' : 'hidden'} id="expandd" variant="outlined" square>
                            <p onClick={() => setStatus(!status)}>Not Interested</p>
                            <p onClick={saveJob}>Save job</p>
                        </Paper>
                    </div> */}
                </div>
                <h3>{job.jobTitle}</h3>

                <h4>
                    {job.companyName} {' '}
                    <span className="starr">
                        {/* <StarRateIcon style={{ width: 17, display: 'flex', marginTop: 3, color: 'grey' }} /> */}
                    </span>
                </h4>
                <h4>
                    {job.city}, {job.state}
                </h4>

                <img src="/freq.png" alt="" />
                <h4>Required Skills :</h4>
                <ul>
                    {job.requiredSkills.slice(0, 3).map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                    {job.requiredSkills.length > 3 && <li>more ...</li>}
                </ul>

                <h4>{job.jobType}</h4>
                <p className="postDate">Posted on - {job.date} </p>
            </nav>
            {status ? null : (
                <div className="undo" onClick={() => setStatus(!status)}>
                    <div>Job removed</div>
                    <div>Undo</div>
                </div>
            )}
        </div>
    );
};

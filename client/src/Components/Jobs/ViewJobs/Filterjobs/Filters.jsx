import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Buttons } from "./Buttons";
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
// import './Buttons.css';
import './Filter.css';

const A = styled.div`
  margin-left: ${(props) => props.fd * 1.3}px;
`;

export const Filters = ({ setFilteredJobs, jobs }) => {
    const [activeFilters, setActiveFilters] = useState([]);
    const [state, setState] = useState(false);
    const [salary, setSalary] = useState(0);
    const [direc, setDirec] = useState(true);
    const [calculated, setCalculated] = useState(0);
    const salaryButtonRef = useRef();
    const salaryDropdownRef = useRef();

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (salaryDropdownRef.current && !salaryDropdownRef.current.contains(event.target) && !salaryButtonRef.current.contains(event.target)) {
                setState(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);


    const handleClick = () => {
        setState((prev) => !prev);
    };

    const getUniqueValues = (key) => {
        const uniqueValues = [...new Set(jobs.map(job => job[key]).filter(value => value !== ''))];
        return uniqueValues;
    };
    

    // const dateItems = getUniqueValues("date");
    const dateItems = [
        'Today',
        'Last 3 Days',
        'Last Week',
        'Last Month',
        'Last 6 Months'
    ]
    const dateMap = {
        'Today': 1,
        'Last 3 Days': 3,
        'Last Week': 7,
        'Last Month': 30,
        'Last 6 Months': 180
    }

    const jtype = getUniqueValues("jobType");
    const remote = getUniqueValues("remote");
    const education = getUniqueValues("education");
    const company = getUniqueValues("companyName");
    const language = getUniqueValues("language");

    // function increase(e) {
    //     if (salary === 78300) {
    //         setDirec(!direc);
    //     }

    //     if (direc) {
    //         let temp = calculated + 1;
    //         setCalculated(temp);
    //     } else {
    //         let temp = calculated - 1;
    //         setCalculated(temp);
    //     }
    // }



    useEffect(() => {
        let filteredData = [...jobs];
        activeFilters.forEach(filter => {
            switch (filter.tag) {
                case "Date Posted":
                    const filtervalue = filter.value
                    const value = dateMap[filtervalue];
                    filteredData = filteredData.filter(job => job.posted<= value);
                    break;
                case "Work Mode":
                    filteredData = filteredData.filter(job => job.remote === filter.value);
                    break;
                case "Education":
                    filteredData = filteredData.filter(job => job.education === filter.value);
                    break;
                case "Company":
                    filteredData = filteredData.filter(job => job.companyName === filter.value);
                    break;
                case "Language":
                    filteredData = filteredData.filter(job => job.language === filter.value);
                    break;
                case "Job Type":
                    filteredData = filteredData.filter(job => job.jobType === filter.value);
                    break;
                default:
                    break;
            }
        });
        // filteredData = filteredData.filter(job => job.salary >= salary);
        setFilteredJobs(filteredData);

    }, [activeFilters, salary, jobs]);






    return (

        <div className="filter-div">
            <Buttons setActiveFilters={setActiveFilters} activeFilters={activeFilters} tag="Date Posted" filters={dateItems} />
            <Buttons setActiveFilters={setActiveFilters} activeFilters={activeFilters} tag="Work Mode" filters={remote} />
            <Buttons setActiveFilters={setActiveFilters} activeFilters={activeFilters} tag="Education" filters={education} />
            <Buttons setActiveFilters={setActiveFilters} activeFilters={activeFilters} tag="Company" filters={company} />
            <Buttons setActiveFilters={setActiveFilters} activeFilters={activeFilters} tag="Language" filters={language} />
            <Buttons setActiveFilters={setActiveFilters} activeFilters={activeFilters} tag="Job Type" filters={jtype} />
            {/* <div id="parentDiv">
                <Button ref={salaryButtonRef} classes={{ root: salary == 0 ? 'button' : 'butclicked', label: 'button-label' }} onClick={handleClick} variant="contained">
                    {salary > 0 ? `${salary}$` : "Salary Estimate "}  <ArrowDropDownSharpIcon />{" "}
                </Button>
                <Paper ref={salaryDropdownRef} className={state ? "show" : "hidden"} id="expand sala" style={{ zIndex: 12 }} variant="outlined" square>
                    <div className="salary-container">
                        <div className="heading">
                            <h2 className="filter-header">
                                What's your desired salary per month?
                            </h2>
                        </div>
                        <div className="slider">
                            <A fd={calculated}>₹{salary > 650 ? salary : ""}</A>
                        </div>
                        <input
                            type="range"
                            tabIndex="0"
                            aria-valuemin="0"
                            aria-valuemax="78300"
                            aria-valuenow="67800"
                            aria-valuetext="₹67,800"
                            min="5000"
                            max="100000"
                            step="1000"
                            aria-orientation="horizontal"
                            className="Slider-range"
                            onChange={(e) => {
                                setSalary(e.target.value);
                                // if (e.target.value > 650) {
                                //     setSalary(e.target.value);
                                // }
                                // increase(e);
                            }} />
                   
                    </div>
                </Paper>
            </div> */}
        </div>

    );
};

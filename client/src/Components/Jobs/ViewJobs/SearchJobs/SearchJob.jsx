import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import './searchjob.css';

const SearchJob = ({ setsearchedJobs, jobs }) => {
    const jobInputRef = useRef();
    const locationInputRef = useRef();
    const [search, setSearch] = useState([]);
    const [Where, setWhere] = useState([]);



    const debounce = (func, delay = 500) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const updateFilteredJobs = (jobQuery = '', cityQuery = '') => {
        const filteredJobs = jobs.filter(job =>
            job.jobTitle.toLowerCase().includes(jobQuery.toLowerCase()) &&
            job.city.toLowerCase().includes(cityQuery.toLowerCase())
        );
        setsearchedJobs(filteredJobs);
    };

    const manageJob = (e) => {
        const searchQuery = e.target.innerText;
        jobInputRef.current.value = searchQuery;
        setSearch([]);
        updateFilteredJobs(searchQuery, locationInputRef.current.value);
    };

    const manageCity = (e) => {
        const searchQuery = e.target.innerText;
        locationInputRef.current.value = searchQuery;
        setWhere([]);
        updateFilteredJobs(jobInputRef.current.value, searchQuery);
    };

    const handleChangeWhere = debounce((e) => {
        const query = e.target.value.toLowerCase();
        if (!query) {
            setWhere([]);
            return;
        }
        const filteredJobs = jobs.filter(job => job.city.toLowerCase().includes(query));
        const uniquecitis = [];
        const seenTitles = new Set();

        for (const job of filteredJobs) {
            if (!seenTitles.has(job.city)) {
                uniquecitis.push(job);
                seenTitles.add(job.city);
            }
        }
        setWhere(uniquecitis);
        // updateFilteredJobs(jobInputRef.current.value, query);
    });

    const handleSearchJob = debounce((e) => {
        const query = e.target.value.toLowerCase();
        if (!query) {
            setSearch([]);
            return;
        }
        const filteredJobs = jobs.filter(job => job.jobTitle.toLowerCase().includes(query));

        const uniqueJobs = [];
        const seenTitles = new Set();

        for (const job of filteredJobs) {
            if (!seenTitles.has(job.jobTitle)) {
                uniqueJobs.push(job);
                seenTitles.add(job.jobTitle);
            }
        }

        setSearch(uniqueJobs);
        // updateFilteredJobs(jobInputRef.current.value, query);
    });


    return (
        <div style={{ display: "flex" }}>
            <div className="area">
                <form className="forms" action="">
                    <div className="deb">
                        <div className="search">
                            <div className="lab">What</div>
                            <div className="inp">
                                <input
                                    type="text"
                                    ref={jobInputRef}
                                    placeholder="Job title"
                                    className="inpu"
                                    onChange={handleSearchJob}
                                />
                            </div>
                            <div style={{ paddingRight: "0rem" }}>
                                <BsSearch style={{ width: 12 }} />{" "}
                            </div>
                        </div>
                        {search.length > 0 && (
                            <div className="autocomplete">
                                {search.map((el, i) => (
                                    <div key={i} className="autocompleteItems">
                                        <span onClick={manageJob}>{el.jobTitle}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
                <form className="forms" action="">
                    <div className="deb">
                        <div className="search">
                            <div className="lab">Where</div>
                            <div className="inp">
                                <input
                                    type="text"
                                    ref={locationInputRef}
                                    placeholder="City"
                                    onChange={handleChangeWhere}
                                    className="inpu"
                                />
                            </div>
                            <div style={{ paddingRight: "0rem" }}>
                                <MdLocationOn />{" "}
                            </div>
                        </div>
                        {Where.length > 0 && (
                            <div className="autocomplete autocomplete-where">
                                {Where.map((el, i) => (
                                    <div key={i} className="autocompleteItems">
                                        <span onClick={manageCity}>{el.city}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
                {/* <button className="btn"><Link className="link" to="/results">Find jobs</Link></button> */}
            </div>
        </div>
    );
}

export default SearchJob;

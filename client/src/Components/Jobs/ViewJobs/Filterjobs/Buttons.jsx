import React, { useRef, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import ClearIcon from '@mui/icons-material/Clear';
import './Buttons.css';

export const Buttons = ({ tag, filters, activeFilters, setActiveFilters }) => {
    const [state, setState] = useState(false);
    const [crss, setCrss] = useState(true);
    const [label, setLabel] = useState("");
    const buttref = useRef();
    const options = useRef();

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (options.current && !options.current.contains(event.target) && !buttref.current.contains(event.target)) {
                setState(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleClick = (e) => {
        if (filters.length < 1) {
            setState(false);
            return;
        }
        setState((prev) => !prev);
    };




    const handleFilterSelection = (e) => {
        const selectedValue = e.target.innerText;
        let updatedFilters = [...activeFilters];
        const existingFilterIndex = updatedFilters.findIndex(filter => filter.tag === tag);

        if (existingFilterIndex >= 0) {
            updatedFilters[existingFilterIndex].value = selectedValue;
        } else {
            updatedFilters.push({ tag, value: selectedValue });
        }

        setActiveFilters(updatedFilters);
        setLabel(selectedValue);
        setCrss(false);
        setState(false);
    };

    const handleclearfilter = () => {
        const updatedFilters = activeFilters.filter(filter => filter.tag !== tag);
        setActiveFilters(updatedFilters);
    };

    return (
        <div id="parentDiv">
            <Button
                ref={buttref}
                classes={{ root: crss ? 'button' : 'butclicked', label: 'button-label' }}
                onClick={handleClick}
                variant="contained"
            >
                {label === "" ? tag : label}
                {crss ? <ArrowDropDownSharpIcon /> : <ClearIcon style={{ width: 17 }}
                    onClick={() => {
                        handleclearfilter();
                        setCrss(!crss);
                        setLabel("");
                    }} />}
            </Button>
            <Paper ref={options} className={state ? "show" : "hidden"} id="expand" variant="outlined" square>
                {filters.map((el, index) => (
                    <p key={index} onClick={handleFilterSelection}>{el}</p>
                ))}
            </Paper>
        </div>
    );
};

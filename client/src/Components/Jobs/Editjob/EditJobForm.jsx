import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Switch,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import { styled } from '@mui/system';
import {
    CitySelect,
    CountrySelect,
    GetCountries,
    GetState,
    LanguageSelect,
    StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useNavigate } from 'react-router-dom';
import { deleteJobApi } from '../../../Api/EmployersApi';
import RichTextEditor from '../../QuillTextEditor/QuillTextEditor';

const RootPaper = styled(Paper)({
    width: '80%',
    padding: '32px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    margin: 'auto',
});

const CenteredContainer = styled(Grid)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
});




const EditJobForm = ({ formData, companyNames, onNext, setFormData }) => {
    const [countryid, setCountryid] = useState(0);
    const [stateid, setStateid] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isActive, setIsActive] = useState(formData.status === 'Active');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const countries = await GetCountries();
                const country = countries.find(result => result.name === formData.country);
                setCountryid(country.id);

                const states = await GetState(country.id);
                const state = states.find(state => state.name === formData.state);
                setStateid(state.id);
            } catch (error) {
                console.log(error);
            }

        };

        fetchData();
    }, [formData.country]); // Ensure useEffect runs when country changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData);
    };

    const handleSwitchChange = (e) => {
        setIsActive(e.target.checked);
        setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(formData);
        onNext(); // Move to preview page
    };

    const handleDelete = () => {
        setOpenDeleteDialog(true);
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    const confirmDelete = async () => {
        const response = await deleteJobApi(formData._id);
        if (response && response.status === 'success') {
            setOpenDeleteDialog(false);
            navigate('/'); // Redirect to job listing or another appropriate page
        }
        setOpenDeleteDialog(false);
    };

    const handleCancel = () => {
        navigate('/'); // Navigate to home page
    };

    return (
        <CenteredContainer>
            <RootPaper elevation={3}>
                <Typography variant="h5" gutterBottom align="center">
                    Edit Job
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Job Title"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                margin="normal"
                            />
                            <TextField
                                select
                                fullWidth
                                label="Company Name"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                margin="normal"
                            >
                                {companyNames.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <FormControl fullWidth variant="outlined" required margin="normal">
                                <InputLabel>Job Type</InputLabel>
                                <Select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    label="Job Type"
                                    required
                                >
                                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                                    <MenuItem value="Contract">Contract</MenuItem>
                                    <MenuItem value="Internship">Internship</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                label="Work Mode"
                                name="remote"
                                value={formData.remote}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                margin="normal"
                                select
                            >
                                <MenuItem value="Remote">Remote</MenuItem>
                                <MenuItem value="Onsite">Onsite</MenuItem>
                                <MenuItem value="Hybrid">Hybrid</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Required Skills (comma separated)"
                                name="requiredSkills"
                                value={formData.requiredSkills}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Education"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Experience (in years)"
                                // type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Salary (CTC)"
                                name="salary"
                                // type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          
                            <RichTextEditor
                                value={formData.description}
                                onChange={(value) => setFormData({ ...formData, description: value })}
                                height="300px"
                                width="100%"
                                heading="Job Description"
                            />
                            <CountrySelect
                                fullWidth
                                name='country'
                                value={formData.country}
                                placeHolder={formData.country}
                                onChange={(value) => {
                                    setFormData({ ...formData, country: value.name });
                                    setCountryid(value.id);
                                }}
                                variant="outlined"
                                label="Country"
                                required
                                margin="normal"
                            />
                            <StateSelect
                                fullWidth
                                name='state'
                                countryid={countryid}
                                value={formData.state}
                                placeHolder={formData.state}
                                onChange={(value) => {
                                    setFormData({ ...formData, state: value.name });
                                    setStateid(value.id);
                                }}
                                variant="outlined"
                                label="State"
                                required
                                margin="normal"
                            />
                            <CitySelect
                                fullWidth
                                name='city'
                                countryid={countryid}
                                stateid={stateid}
                                value={formData.city}
                                placeHolder={formData.city}
                                onChange={(value) => { setFormData({ ...formData, city: value.name }); }}
                                variant="outlined"
                                label="City"
                                required
                                margin="normal"
                            />
                            <LanguageSelect
                                fullWidth
                                name='language'
                                countryid={countryid}
                                stateid={stateid}
                                value={formData.language}
                                placeHolder={formData.language}
                                onChange={(value) => { setFormData({ ...formData, language: value.name }); }}
                                variant="outlined"
                                label="Language"
                                required
                                margin="normal"
                            />

                            <FormControl component="fieldset" fullWidth margin="normal">
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Switch checked={isActive} onChange={handleSwitchChange} />}
                                        label={isActive ? 'Active' : 'Inactive'}
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button variant="outlined" color="secondary" onClick={handleDelete}>
                            Delete Job
                        </Button>
                        <Box>
                            <Button variant="outlined" color="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" type="submit">
                                Next
                            </Button>
                        </Box>
                    </Box>
                </form>
                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCancelDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete Job?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this job?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDelete} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={confirmDelete} color="primary" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </RootPaper>
        </CenteredContainer>
    );
};

export default EditJobForm;

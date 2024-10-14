import React, { useState } from 'react';
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
  Select
} from '@mui/material';
import { styled } from '@mui/system';
import {
  CitySelect,
  CountrySelect,
  LanguageSelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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


const AddJobForm = ({ formData, companyNames, onNext, setFormData }) => {
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { city, state, country } = formData;
    if (!city || !state || !country) {
      toast.error('City , State and Country are Mandetory fields. ')
      return;
    }
    onNext();
  };

  const handleCancel = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <CenteredContainer>
      <RootPaper elevation={3}>
        <Typography variant="h5" gutterBottom align="center">
          Add New Job
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
              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel>Job Type</InputLabel>
                <Select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  label="Job Type"
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
                // type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                About Job
              </Typography>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                height="300px"
                width="100%"
              />
              <CountrySelect
                fullWidth
                name='country'
                value={formData.country}
                placeHolder="Select Country"
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
                placeHolder="Select State"
                onChange={(value) => {
                  setFormData({ ...formData, state: value.name });
                  setstateid(value.id);
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
                placeHolder="Select City"
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
                placeHolder="Select Language"
                onChange={(value) => { setFormData({ ...formData, language: value.name }); }}
                variant="outlined"
                label="Language"
                required
                margin="normal"
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Next
            </Button>
          </Box>
        </form>
      </RootPaper>
    </CenteredContainer>
  );
};

export default AddJobForm;

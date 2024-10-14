import React from 'react';
import {
    Button,
    Paper,
    Typography,
    Container,
    Grid,
    Box,
} from '@mui/material';
import { styled } from '@mui/system';

const RootPaper = styled(Paper)({
    width: '80%',
    padding: '32px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    margin: 'auto',
});

const CenteredContainer = styled(Container)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
});

const Label = styled(Typography)({
    fontWeight: 'bold',
    color: '#333',
    fontSize: '1rem',
});

const Value = styled(Typography)({
    fontSize: '1rem',
    marginBottom: '10px',
});

const JobEditPreview = ({ formData, onBack, onSubmit }) => {
    const {
        companyName,
        city,
        state,
        country,
        jobTitle,
        language,
        jobType,
        remote,
        education,
        experience,
        requiredSkills,
        salary,
        description,
        status,
    } = formData;

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit(); // Submit updated job details
    };

    return (
        <CenteredContainer>
            <RootPaper elevation={3}>
                <Typography variant="h5" gutterBottom align="center">
                    Job Preview
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Label variant="h6">Company Name</Label>
                        <Value>{companyName}</Value>
                        <Label variant="h6">Job Description</Label>
                        <Value dangerouslySetInnerHTML={{ __html: description }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Label variant="h6">Location</Label>
                        <Value>{`${city}, ${state}, ${country}`}</Value>
                        <Label variant="h6">Job Title</Label>
                        <Value>{jobTitle}</Value>
                        <Label variant="h6">Language</Label>
                        <Value>{language}</Value>
                        <Label variant="h6">Job Type</Label>
                        <Value>{jobType}</Value>
                        <Label variant="h6">Work Mode</Label>
                        <Value>{remote}</Value>
                        <Label variant="h6">Education</Label>
                        <Value>{education}</Value>
                        <Label variant="h6">Experience</Label>
                        <Value>{experience}</Value>
                        <Label variant="h6">Required Skills</Label>
                        <Value>{requiredSkills}</Value>
                        <Label variant="h6">Salary</Label>
                        <Value>{salary}</Value>
                        <Label variant="h6">Status</Label>
                        <Value>{status}</Value>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button variant="outlined" color="primary" onClick={onBack}>
                        Back
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </RootPaper>
        </CenteredContainer>
    );
};

export default JobEditPreview;

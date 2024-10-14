import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper, Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/system';
import { updateUserApi } from '../../Api/userApi';
import { toast } from 'react-toastify';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'center',
    minHeight: '100vh',
    // backgroundColor: '#e0f7fa',
    padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6),
    textAlign: 'center',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontSize: '16px',
}));

const ViewProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    // const fullname = localStorage.getItem('fullname');
    const isemp = localStorage.getItem('role') === 'emp';

    const [formData, setFormData] = useState({
        username: localStorage.getItem('userID'),
        firstname: firstname,
        lastname: lastname,
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setChangePassword(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setChangePassword(false);
        setError('');
    };

    const handleSubmit = async () => {
        if (changePassword && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const response = await updateUserApi(formData);
        if (response && response.status === 'success') {
            setIsEditing(false);
            setChangePassword(false);
            toast.success('Profile updated. logout and login to reflect the changes.')

        } else {
            toast.error('Profile not updated.')
        }
    };

    const handlePasswordChange = (event) => {
        setChangePassword(event.target.checked);
        if (!event.target.checked) {
            setFormData({ ...formData, password: '', confirmPassword: '' });
        }
        setError('');
    };

    return (
        <StyledContainer maxWidth="sm">
            <StyledPaper>
                {!isEditing ? (
                    <>
                        <Typography variant="h4" gutterBottom style={{ fontWeight: 600, color: '#00796b' }}>
                            Profile Information
                        </Typography>
                        <Typography variant="h6" style={{ color: '#004d40' }}>
                            Username: {formData.username}
                        </Typography>
                        <Typography variant="h6" style={{ color: '#004d40' }}>
                            Name: {formData.firstname} {formData.lastname}
                        </Typography>
                        {isemp &&
                            <StyledButton variant="contained" color="primary" onClick={handleEdit}>
                                Edit Profile
                            </StyledButton>
                        }

                    </>
                ) : (
                    <>
                        <Typography variant="h4" gutterBottom style={{ fontWeight: 600, color: '#00796b' }}>
                            Edit Profile
                        </Typography>
                        <Box>
                            <TextField
                                label="First Name"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                label="Last Name"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={changePassword}
                                        onChange={handlePasswordChange}
                                        name="changePassword"
                                        color="primary"
                                    />
                                }
                                label="Change Password"
                            />
                            {changePassword && (
                                <>
                                    <TextField
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <TextField
                                        label="Confirm Password"
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        error={!!error}
                                        helperText={error}
                                    />
                                </>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <StyledButton variant="contained" color="primary" onClick={handleSubmit}>
                                Submit
                            </StyledButton>
                            <StyledButton variant="outlined" color="secondary" onClick={handleCancel}>
                                Cancel
                            </StyledButton>
                        </Box>
                    </>
                )}
            </StyledPaper>
        </StyledContainer>
    );
};

export default ViewProfile;

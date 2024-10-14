import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import { SendMailVerification } from '../../Api/LoginSignup';

const AccountVerify = () => {
    const { setIsLoading, userID } = useGlobalContext();
    const [resendAvailable, setResendAvailable] = useState(false);
    const [timer, setTimer] = useState(60);
    const navigate = useNavigate();

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setResendAvailable(true);
            // handleResendEmail();
        }
    }, [timer]);

    const handleResendEmail = async () => {
        setIsLoading(true);
        try {
            await SendMailVerification(userID);
            toast.success("Verification email sent");
        } catch (error) {
            toast.error("Failed to send verification email");
        } finally {
            setIsLoading(false);
            setResendAvailable(false);
            setTimer(60);
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Account Created Successfully
            </Typography>
            <Typography variant="body1" gutterBottom>
                Please verify your account by the link you received via email.
            </Typography>
            <Typography variant="body2" gutterBottom>
                If you did not receive any email, you can resend the verification email.
            </Typography>
            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResendEmail}
                    disabled={!resendAvailable}
                >
                    {resendAvailable ? 'Resend Email' : `Resend available in ${timer}s`}
                </Button>
            </Box>
            <Box mt={2}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleBackToLogin}
                >
                    Back to Login
                </Button>
            </Box>
        </Container>
    );
};

export default AccountVerify;

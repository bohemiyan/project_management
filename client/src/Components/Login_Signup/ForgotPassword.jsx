import React, { useEffect, useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { FormContainer, FormField, Icon, LoginButton, Logo, Root } from './StyledForm';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../Context';
import logo from '../../Assets/netAmericaDeliver.png';
import { ForgotPasswordApi, ResetPasswordApi } from '../../Api/LoginSignup';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [userID, setuserID] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = async () => {
        if (!userID) {
            toast.error("All the fields are required");
            return;
        }
        setIsLoading(true);
        const response = await ForgotPasswordApi(userID);
        if (response && response.status === 'success') {
            toast.success("Password reset link has been sent to your email if you entered it correctly.");
            setCanResend(false);
            setTimer(30);

        } else {
            toast.error("Unable to send reset Link");
        }
        setIsLoading(false);
    };



    return (
        <Root>
            <FormContainer>
                <div className='logoContainer'>
                    <Logo
                        src={logo}
                        alt="Demo Logo"
                        style={{
                            width: '200px',
                            backgroundColor: 'inherit',
                            mixBlendMode: 'multiply'
                        }}
                    />
                </div>

                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Forgot Password
                </Typography>
                <FormField>
                    <Icon>
                        <AccountCircle />
                    </Icon>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        size="small"
                        value={userID}
                        onChange={(e) => setuserID(e.target.value)}
                    />
                </FormField>
                <LoginButton
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!canResend || isLoading}
                    sx={{ marginTop: 2 }}
                >
                    Send Password Reset Link{timer > 0 && `(${timer}s)`}
                </LoginButton>
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Go to login <Link to="/login">Login</Link>
                </Typography>
                {/* <LoginButton
                    fullWidth
                    variant="contained"
                    onClick={handleResend}
                    disabled={!canResend || isLoading}
                    sx={{ marginTop: 2 }}
                >
                    Resend Link {timer > 0 && `(${timer}s)`}
                </LoginButton> */}
            </FormContainer>
        </Root>
    );
};


const ResetPassword = () => {
    const { setIsLoading } = useGlobalContext();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('rt');

    useEffect(() => {
        if (!resetToken) navigate('/login')
    }, [])


    const handleSubmit = async () => {
        setIsLoading(true);
        // Check if passwords match
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        const response = await ResetPasswordApi(resetToken, password);
        if (response && response.status === 'success') {
            navigate('/login');
        }
        setIsLoading(false);
    };


    return (
        <Root>
            <FormContainer>
                <div className='logoContainer'>
                    <Logo
                        src={logo}
                        alt="Demo Logo"
                        style={{
                            width: '200px',
                            backgroundColor: 'inherit',
                            mixBlendMode: 'multiply'
                        }}
                    />
                </div>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Reset Password
                </Typography>


                <FormField>
                    <Icon>
                        <Lock />
                    </Icon>
                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        type="password"
                        size="small"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormField>
                <FormField>
                    <Icon>
                        <Lock />
                    </Icon>
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        size="small"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError('');
                        }}
                        error={passwordError !== ''}
                        helperText={passwordError}
                    />
                </FormField>
                <LoginButton fullWidth variant="contained" onClick={handleSubmit}>
                    Reset Password
                </LoginButton>
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Go to login <Link to="/login">Login</Link>
                </Typography>
            </FormContainer>
        </Root>
    );

}

export { ForgotPassword, ResetPassword };
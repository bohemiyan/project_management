import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { AccountCircle, Email, Lock } from '@mui/icons-material';
import { FormContainer, FormField, Icon, RegisterButton, Logo, Root } from './StyledForm';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../Assets/netAmericaDeliver.png';
import { SendMailVerification, signUp } from '../../Api/LoginSignup';
import { useGlobalContext } from '../../Context';
import { toast } from 'react-toastify';

const Signup = () => {
  const { setIsLoading, setuserID } = useGlobalContext();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    // setIsLoading(true);

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    const userdata = {
      firstname,
      lastname,
      userID: email,
      password
    };
    const response = await signUp(userdata);
    if (response && response.status === 'success') {
      toast.success('Account Created');
      setuserID(email);
      SendMailVerification(email);
      navigate('/verifyaccount');
    } else {
      toast.error("Signup Failed")
      toast.error(response.Error)
    }
    // setIsLoading(false);
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
          New Account
        </Typography>
        <FormField>
          <Icon>
            <AccountCircle />
          </Icon>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            size="small"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <Icon>
            <AccountCircle />
          </Icon>
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            size="small"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <Icon>
            <Email />
          </Icon>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>
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
            required
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
            required
          />
        </FormField>
        <RegisterButton fullWidth variant="contained" onClick={handleRegister}>
          Register
        </RegisterButton>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </FormContainer>
    </Root>
  );
};

export default Signup;

import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { FormContainer, FormField, Icon, LoginButton, Logo, Root } from './StyledForm';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../Assets/netAmericaDeliver.png';
import { useGlobalContext } from '../../Context';
import { Login, SendMailVerification } from '../../Api/LoginSignup';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const { setIsLoading, setuserID } = useGlobalContext();
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!userID || !password) {
      toast.error("All the fields are required")
      return;
    }

    setIsLoading(true);

    const response = await Login(userID, password);

    if (response && response.status === 'success') {
      const userData = response;
      toast.success("Logged In")
      if (!userData.verified) {
        setuserID(userID);
        await SendMailVerification(userID);
        navigate("/verifyAccount");
      } else {
        localStorage.setItem('firstname', userData.firstname);
        localStorage.setItem('lastname', userData.lastname);
        localStorage.setItem('userID', userData.userID);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        navigate("/")
      }
    } else {
      toast.error("Invalid login")
    }
    setIsLoading(false);
  };

  return (
    <Root>
      <FormContainer >
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
          Login
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
            onChange={(e) => setUserID(e.target.value)}
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
          />
        </FormField>
        <LoginButton fullWidth variant="contained" onClick={handleSubmit}>
          Login
        </LoginButton>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Forgot Password? <Link to="/forgotpassword">Fogot Password</Link>
        </Typography>
      </FormContainer>
    </Root>
  );
};

export default LoginForm;

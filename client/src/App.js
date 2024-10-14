
import React from 'react';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from './Context.js';
// import './App.css';

import LoadingWave from './Components/LoadingPage/Loading.jsx';


import Home from './Components/Home/Home.jsx';
import LoginForm from './Components/Login_Signup/LoginForm.jsx';
import Signup from './Components/Login_Signup/Signup.jsx';
import AccountVerify from './Components/Login_Signup/AccountVerify.jsx';
import { EmailValidate, StudentValidate } from './Components/Login_Signup/Redirect.jsx';
import { ForgotPassword, ResetPassword } from './Components/Login_Signup/ForgotPassword.jsx';



const App = () => {
  const { isLoading } = useGlobalContext();
  const navigate = useNavigate();
  const isloggedin = localStorage.getItem('token');



  return (
    <div className="App" style={{ width: '100%', padding: 0 }}>
      {isLoading ? <LoadingWave /> :

        <Routes>
          <Route path="*" element={isloggedin ? <Home /> : <LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/StudentValidate/*" element={<StudentValidate />} />
          <Route path="/verifyAccount" element={<AccountVerify />} />
          <Route path="/emailverification" element={<EmailValidate />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/passwordreset/*" element={<ResetPassword />} />
        </Routes>
      }
      <ToastContainer theme="dark" autoClose={2000} />
    </div>
  );
}

export default App;

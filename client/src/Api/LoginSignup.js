import axios from 'axios';
import { BaseURL } from './BaseConfig';

//======================Signup==========================
export const signUp = async (userData) => {
    try {
        const response = await axios.post(`${BaseURL}/signup`,
            { userData });

        return response.data;
    } catch (error) {
        return { Error: error.message };
    }
};

//======================Signup==========================
export const SendMailVerification = async (userID) => {
    try {
        const response = await axios.post(`${BaseURL}/sendverificationmail`,
            { userID });
        return response.data;
    } catch (error) {
        return { Error: error.message };
    }
};

//======================Signup==========================
export const validateEmail = async (mailtoken) => {
    try {
        const response = await axios.post(`${BaseURL}/verifyemail`,
            { mailtoken }
        );
        return response.data
    } catch (error) {
        return { Error: error.message };
    }
};

//=========================Login==============================

export const Login = async (userID, password) => {
    try {
        const response = await axios.post(`${BaseURL}/login`,
            { userID, password });
        return response.data;
    } catch (error) {
        return { Error: error.message };
    }



};

//========================Forgot Password=====================
export const ForgotPasswordApi = async (userID) => {
    try {
        const response = await axios.post(`${BaseURL}/forgotpassword`,
            { userID });
        return response.data;
    } catch (error) {
        return { Error: error.message };
    }
};

//========================Forgot Password=====================
export const ResetPasswordApi = async (resettoken, newpassword) => {
    try {
        const response = await axios.post(`${BaseURL}/resetpassword`,
            { resettoken, newpassword });
        return response.data;
    } catch (error) {
        return { Error: error.message };
    }
};
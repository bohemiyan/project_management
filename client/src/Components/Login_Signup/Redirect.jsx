import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../Context';
import { validateEmail } from '../../Api/LoginSignup';
import { toast } from 'react-toastify';
import { studentValidator } from '../../Api/StudentsApi';

const StudentValidate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setIsLoading } = useGlobalContext();

    const searchParams = new URLSearchParams(location.search);
    const encrypted_ip = searchParams.get('ei');
    const encrypted_id = searchParams.get('ui');
    const username = searchParams.get('un');

    useEffect(() => {
        const validateUser = async () => {
            setIsLoading(true);
            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (currentUser?.username === username) {
                setIsLoading(false);
                navigate('/');
            } else {
                // Call login worker and navigate to homepage
                // Example: await loginWorker();
                const response = await studentValidator(encrypted_ip, encrypted_id);
                if (response && response.status === 'success') {
                    const userData = response.student;
                    localStorage.setItem('firstname', userData.firstname);
                    localStorage.setItem('lastname', userData.lastname);
                    localStorage.setItem('userID', userData.userID);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('role', userData.role);

                    navigate('/');
                }
                setIsLoading(false);

            }
        };

        validateUser();
    }, [location.search, navigate, setIsLoading, username]);

    return null; // or any JSX to show while processing
};

const EmailValidate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setIsLoading } = useGlobalContext();

    const searchParams = new URLSearchParams(location.search);
    const emailToken = searchParams.get('et');

    useEffect(() => {
        const validateEmailToken = async () => {
            setIsLoading(true);
            const response = await validateEmail(emailToken);
            if (response && response.status === 'success') {
                toast.success('Verified');
                const userData = response;
                localStorage.setItem('fullname', userData.fullname);
                // localStorage.setItem('lastname', userData.lastname);
                localStorage.setItem('userID', userData.userID);
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                navigate('/');
            } else {
                toast.error('Verification Fail');
                navigate('/')
            }

            setIsLoading(false);


        };

        validateEmailToken();
    }, []);

    return null; // or any JSX to show while processing
};


export { StudentValidate, EmailValidate };

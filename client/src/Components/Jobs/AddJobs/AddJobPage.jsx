import React, { useEffect, useState } from 'react';
import AddJobForm from './AddJobForm';
import JobPreview from './JobPreview';
import { addJobApi, getComanyApi } from '../../../Api/EmployersApi';
import { useNavigate } from 'react-router-dom';


const AddJobPage = () => {
    const [companies, setcompanies] = useState([]);
    const [formData, setFormData] = useState({
        companyName: '',
        companyID: '',
        rating: '',
        city: '',
        state: '',
        country: '',
        jobTitle: '',
        language: '',
        jobType: '',
        remote: '',
        education: '',
        experience: '',
        requiredSkills: '',
        description:'',
        salary: ''
    });
    const [step, setStep] = useState(1); // State to manage form steps (1: AddJobForm, 2: JobPreview)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchdata = async () => {

            const response = await getComanyApi();
            if (response && response.status === 'success') {
                const companyNames = response.companies.map(company => company.companyName);
                setcompanies(companyNames);
            }
        }
        fetchdata();
    }, [])




    const handleNext = () => {
        setStep(2); // Move to JobPreview
    };

    const handleBack = () => {
        setStep(1); // Move back to AddJobForm
    };

    const handleSubmit = async () => {

        const newJob = {
            ...formData,
            // experience: parseInt(formData.experience, 10),
            requiredSkills: formData.requiredSkills.split(','),
        };

        // Implement submit logic here
        const response = await addJobApi(newJob);
        if (response && response.status === 'success') {
            setFormData(null);
            setStep(1);
            navigate('/');
        }
    };

    return (
        <>
            {step === 1 && (
                <AddJobForm
                    companyNames={companies}
                    formData={formData}
                    onNext={handleNext}
                    setFormData={setFormData}
                />
            )}
            {step === 2 && (
                <JobPreview
                    formData={formData}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
};

export default AddJobPage;

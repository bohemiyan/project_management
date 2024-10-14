import React, { useEffect, useState } from 'react';
import EditJobForm from './EditJobForm';
import JobEditPreview from './JobEditPreview';
import { getComanyApi, getJobApi, updateJobApi } from '../../../Api/EmployersApi';
import { useNavigate, useParams } from 'react-router-dom';

const EditJobPage = () => {
    const [formData, setFormData] = useState();
    const [companies, setcompanies] = useState([]);
    const [step, setStep] = useState(1); // State to manage form steps (1: EditJobForm, 2: JobEditPreview)
    const navigate = useNavigate();
    const { id } = useParams();


    useEffect(() => {
        const fetchJob = async () => {
            const filter = { _id: id };
            const response = await getJobApi(filter);
            if (response && response.status === 'success') {
                const jobData = response.jobs[0];
                setFormData({
                    ...jobData,
                    requiredSkills: jobData.requiredSkills.join(', ') // Convert array to comma-separated string
                });
            }
            const responses = await getComanyApi();
            if (responses && responses.status === 'success') {
                const companyNames = responses.companies.map(company => company.companyName);
                setcompanies(companyNames);
            }
        };
        fetchJob();
    }, [id]);

    const handleNext = () => {
        setStep(2); // Move to JobEditPreview
    };

    const handleBack = () => {
        setStep(1); // Move back to EditJobForm
    };

    const handleSubmit = async () => {
        const updatedJob = {
            ...formData,
            // experience: parseInt(formData.experience, 10),
            requiredSkills: formData.requiredSkills.split(','), // Uncomment if requiredSkills is a string
        };

        const response = await updateJobApi(id, updatedJob);
        if (response && response.status === 'success') {
            setFormData({});
            setStep(1);
            navigate('/'); // Redirect to job listing or another appropriate page
        }
    };

    return (
        <>
            {formData && (
                <>
                    {step === 1 && (
                        <EditJobForm
                            companyNames={companies}
                            formData={formData}
                            onNext={handleNext}
                            setFormData={setFormData}
                        />
                    )}
                    {step === 2 && (
                        <JobEditPreview
                            formData={formData}
                            onBack={handleBack}
                            onSubmit={handleSubmit}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default EditJobPage;

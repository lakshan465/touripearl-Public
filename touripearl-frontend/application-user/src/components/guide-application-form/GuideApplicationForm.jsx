import React from 'react'
import {useState} from 'react';
import {Check, User, MapPin, Briefcase, FileCheck, Loader2} from 'lucide-react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import ContactDetailsStep from './steps/ContactDetailsStep';
import ProfessionalInfoStep from './steps/ProfessionalInfoStep '
import LicenseStep from './steps/LicenseStep';
import axiosFetch from '../../utils/axiosFetch';
import {jsPDF} from "jspdf";
import toast from 'react-hot-toast';
import {Card, CardContent, CardTitle, CardHeader} from '@components/Card/Card';
import {useNavigate} from 'react-router-dom';


function GuideApplicationForm() {

    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const totalSteps = 4;
    const isLastStep = currentStep === totalSteps - 1;
    const navigate = useNavigate();
    const [validateErrors, setValidateErrors] = useState({});

    const initialFormData = {
        firstname: '',
        lastname: '',
        email: '',
        gender: '',
        birthday: '',
        nationality: '',
        country: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        biography: '',
        applicationLanguages: [],
        interests: [],
        workingAreas: [],
        workingDays: [],
        extraInformation: '',
        hasLicense: '',
        feedbackMessage: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const steps = [
        {title: 'Personal Info', icon: User},
        {title: 'Contact Details', icon: MapPin},
        {title: 'Professional Info', icon: Briefcase},
        {title: 'License & Submit', icon: FileCheck}
    ];
    const baseURL = `${window.location.protocol}//${window.location.host}`;


    const initialImages = {
        NICImageFront: null,
        NICImageBack: null,
        profleImage: null,
        licenseImageFront: null,
        licenseImageBack: null
    };

    const [images, setImages] = useState(initialImages);
    const generatePdf = (id) => {
        try {
            // Initialize PDF document
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Set document title
            const title = 'Guide Application Form';
            doc.setFontSize(16);
            doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, {align: 'center'});

            // Set normal font size for content
            doc.setFontSize(12);

            // Add content
            doc.text('Your application has been submitted successfully.', 20, 40);
            doc.text('You can check your application status using the following link:', 20, 50);

            // Add URL with blue color
            doc.setTextColor(0, 0, 255);
            const statusUrl = `${baseURL}/application/status/${id}`;
            doc.text(statusUrl, 20, 60);

            // Reset text color
            doc.setTextColor(0, 0, 0);

            // Add footer with date
            const date = new Date().toLocaleDateString();
            doc.setFontSize(10);
            doc.text(`Generated on: ${date}`, 20, doc.internal.pageSize.getHeight() - 20);

            // Save the PDF
            doc.save('application.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error('Failed to generate PDF');
        }
    };

    const validatePersonalInfo = () =>{
        const stepErrors = {};
        if(!formData.firstname) stepErrors.firstname = "First name is required";
        if (!formData.lastname) stepErrors.lastname = "Last name is required";

        if (!formData.email) {
            stepErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            stepErrors.email = "Please enter a valid email address";
        }

        if (!formData.gender) stepErrors.gender = "Please select a gender";

        if (!formData.birthday) {
            stepErrors.birthday = "Birthday is required";
        } else {
            const birthDate = new Date(formData.birthday);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (birthDate > today) {
                stepErrors.birthday = "Birthday cannot be in the future";
            } else if (age < 18) {
                stepErrors.birthday = "You must be at least 18 years old";
            }
        }

        if (!formData.nationality) stepErrors.nationality = "Nationality is required";
        if (!formData.country) stepErrors.country = "Country is required";
        
        return stepErrors;

    }

    const validateContactDetails = () => {
        const stepErrors = {};
        
        if (!formData.street) stepErrors.street = "Street address is required";
        if (!formData.city) stepErrors.city = "City is required";
        if (!formData.state) stepErrors.state = "State is required";
        if (!formData.postalCode) stepErrors.postalCode = "Postal code is required";
        
        if (!formData.phone) {
            stepErrors.phone = "Contact number is required";
        } else if (formData.phone.length !== 10) {
            stepErrors.phone = "Contact number must be exactly 10 digits";
        } else if (formData.phone[0] !== '0') {
            stepErrors.phone = "Contact number must start with 0";
        }
        
        return stepErrors;
    };

    const validateProfessionalInfo = () => {
        const stepErrors = {};
        
        if (!formData.biography || formData.biography.trim().length < 10) {
            stepErrors.biography = "Please provide a detailed biography (at least 10 characters)";
        }
        
        if (!formData.applicationLanguages || formData.applicationLanguages.length === 0) {
            stepErrors.applicationLanguages = "Please add at least one language";
        }
        
        if (!formData.workingAreas || formData.workingAreas.length === 0) {
            stepErrors.workingAreas = "Please select at least one working district";
        }
        
        if (!formData.workingDays || formData.workingDays.length === 0) {
            stepErrors.workingDays = "Please select at least one working day";
        }
        
        if (!formData.extraInformation) {
            stepErrors.extraInformation = "Please provide additional information";
        }
        
        return stepErrors;
    };

    const validateLicenseStep = () => {
        const stepErrors = {};
        
        if (formData.hasLicense === '') {
            stepErrors.hasLicense = "Please indicate if you have a tour guide license";
        }
        
        // Check if required images are uploaded
        if (!images.profileImage) {
            stepErrors.profileImage = "Profile image is required";
        }
        
        if (!images.NICImageFront) {
            stepErrors.NICImageFront = "NIC front image is required";
        }
        
        if (!images.NICImageBack) {
            stepErrors.NICImageBack = "NIC back image is required";
        }
        
        // Only validate license images if user has a license
        if (formData.hasLicense === true) {
            if (!images.licenseImageFront) {
                stepErrors.licenseImageFront = "License front image is required";
            }
            
            if (!images.licenseImageBack) {
                stepErrors.licenseImageBack = "License back image is required";
            }
        }
        
        return stepErrors;
    };

    const validateCurrentStep = () => {
        let currentErrors = {};
        
        switch (currentStep) {
            case 0:
                currentErrors = validatePersonalInfo();
                break;
            case 1:
                currentErrors = validateContactDetails();
                break;
            case 2:
                currentErrors = validateProfessionalInfo();
                break;
            case 3:
                currentErrors = validateLicenseStep();
                break;
            default:
                break;
        }
        
        setValidateErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };

    const nextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    }

    const resetForm = () => {
        setFormData(initialFormData);
        setImages(initialImages);
        setCurrentStep(0);
        setError('');
        setValidateErrors({});
    };

    const handleSubmit = async (e) => {
        // Validate final step before submission
        if (!validateCurrentStep()) {
            return;
        }
        try {
            console.log(JSON.stringify(formData));

            const fd = new FormData();
            for (const [key, value] of Object.entries(images)) {
                if (value) {
                    fd.append(key, value);
                }
            }
            fd.append('body', new Blob([JSON.stringify(formData)], {type: 'application/json'}));

            toast.promise(
                async () => {
                    setIsLoading(true);
                    try {
                        const response = await axiosFetch.post('/api/v1/guideApplications', fd, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        if (response.data.code === 201) {
                            console.log(response);
                            generatePdf(response.data.object);
                            setSuccess(true);
                            resetForm();
                        } else if (response.data.code === 409) {
                            setCurrentStep('A guide application with this email is already exists');
                        } else {
                            alert('Error submitting form.');
                        }
                    } finally {
                        setIsLoading(false);
                    }
                }, {
                    success: 'Application submitted successfully!',
                    loading: 'Submitting application...',
                    error: (error) => error.response?.data?.message || 'An error occurred while submitting the form. Please try again.'
                }
            );
        } catch (error) {
            setError('An error occurred while submitting the form. Please try again.');
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <PersonalInfoStep formData={formData} setFormData={setFormData} validateErrors={validateErrors} setValidateErrors={setValidateErrors}/>
            case 1:
                return <ContactDetailsStep formData={formData} setFormData={setFormData} validateErrors={validateErrors} setValidateErrors={setValidateErrors}/>
            case 2:
                return <ProfessionalInfoStep formData={formData} setFormData={setFormData} validateErrors={validateErrors} setValidateErrors={setValidateErrors}/>
            case 3:
                return <LicenseStep formData={formData} setFormData={setFormData} setImages={setImages} validateErrors={validateErrors} setValidateErrors={setValidateErrors}/>
            default:
                null;
        }
    }

    if (success) {
        return (
            <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow">
                <div className="text-center">
                    <div className="mb-4 text-highlight">
                        <svg
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="mb-4 text-2xl font-bold text-primary">
                        Application Submitted Successfully!
                    </h2>
                    <p className="mb-8 text-secondary">
                        Thank you for your application. We will review it and get back to you soon.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 text-white bg-highlight rounded hover:bg-highlight/90"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-primary">
                    Guide Application Form
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow">
                    <div className="mb-8">
                        <div className='text-2xl font-bold text-accent justify-self-center'>Fill out all the fields</div>
                        <div className="flex justify-between mb-8">
                            {steps.map((step, index) => (
                                <div key={step.title} className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        index <= currentStep ? 'bg-primary text-white' : 'bg-light/50 text-secondary'
                                    }`}>
                                        {index < currentStep ? <Check size={20}/> : <step.icon size={20}/>}
                                    </div>
                                    <span className="mt-2 text-sm text-secondary">{step.title}</span>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
                                {error}
                            </div>
                        )}

                        <div className='mb-8'>
                            {renderStep()}
                        </div>
                        <div className="flex justify-between">
                            <button onClick={prevStep} disabled={currentStep === 0}
                                    className={`px-4 py-2 rounded ${currentStep === 0
                                        ? 'bg-gray-200 cursor-not-allowed text-secondary'
                                        : 'bg-secondary text-white hover:bg-secondary/90'
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                disabled={isLoading}
                                className={
                                    `px-4 py-2 text-white rounded 
                                    ${isLastStep ? 'bg-highlight hover:bg-highlight/90' : 'bg-primary hover:bg-primary/90'}
                                    ${isLoading && 'cursor-not-allowed disabled:bg-primary/50'}`
                                }
                                onClick={() => {
                                    if (isLastStep) {
                                        handleSubmit();
                                    } else {
                                        nextStep({target: {name: 'step', value: currentStep + 1}});
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin inline-block mr-2" size={20}/>
                                        Sending...
                                    </>
                                ) : (isLastStep ? 'Submit' : 'Next')}
                            </button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default GuideApplicationForm
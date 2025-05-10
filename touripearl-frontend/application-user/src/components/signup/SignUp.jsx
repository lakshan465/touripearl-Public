import { useState } from 'react';
import { ToggleLeft as Google } from 'lucide-react';
import axiosFetch from "../../utils/axiosFetch.js";
import StepOne from "./steps/StepOne.jsx";
import StepTwo from "./steps/StepTwo.jsx";
import { useNavigate } from "react-router-dom";

const initialFormData = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    bio: '',
    interests: {}, // Initialize interests as an empty object
    languages: {} // Initialize languages as an empty object
};

const SignUp = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();

    const validateStepOne = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.userName) newErrors.userName = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const validateStepTwo = () => {
        const newErrors = {};
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.street) newErrors.street = 'Street address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State/Province is required';
        if (!formData.zipCode) newErrors.zipCode = 'ZIP/Postal code is required';
        if (!formData.country) newErrors.country = 'Please select a country';
        if (!formData.bio) newErrors.bio = 'Please tell us about yourself';
        if (Object.keys(formData.languages).length === 0) newErrors.languages = 'Please select your languages';
        return newErrors;
    };

    const handleNext = () => {
        const stepOneErrors = validateStepOne();
        if (Object.keys(stepOneErrors).length === 0) {
            setCurrentStep(2);
            setErrors({});
        } else {
            setErrors(stepOneErrors);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(1);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentStep === 1) {
            handleNext();
        } else {
            const stepTwoErrors = validateStepTwo();
            if (Object.keys(stepTwoErrors).length === 0) {
                console.log(formData);
                try {
                    await axiosFetch.post('api/v1/tourists/save', formData);
                    alert('Account created successfully!');
                    navigate('/login');
                } catch (e) {
                    console.error(e);
                    alert('An error occurred while creating your account.');
                }
            } else {
                setErrors(stepTwoErrors);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInterestToggle = (interest) => {
        setFormData(prev => {
            const updatedInterests = { ...prev.interests };
            if (updatedInterests[interest.value]) {
                delete updatedInterests[interest.value]; // Remove interest if already selected
            } else {
                updatedInterests[interest.value] = interest.label; // Add interest with its label
            }
            return {
                ...prev,
                interests: updatedInterests,
            };
        });
    };

    const handleLanguageChange = (selectedLanguages) => {
        setFormData(prev => ({
            ...prev,
            languages: selectedLanguages
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
            <div className="bg-white/80 rounded-2xl shadow-xl w-full max-w-2xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary">Join Touripearl</h1>
                    <p className="text-secondary mt-2">Start your journey with us today</p>
                    <div className="flex justify-center mt-4">
                        <div className="flex items-center space-x-4">
                            <div
                                className={`h-2 w-2 rounded-full ${currentStep === 1 ? 'bg-highlight' : 'bg-accent'}`}></div>
                            <div
                                className={`h-2 w-2 rounded-full ${currentStep === 2 ? 'bg-highlight' : 'bg-accent'}`}></div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {currentStep === 1 ? (
                        <StepOne
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                    ) : (
                        <StepTwo
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            handleInterestToggle={handleInterestToggle}
                            handleLanguageChange={handleLanguageChange}
                        />
                    )}

                    <div className="flex gap-4">
                        {currentStep === 2 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="flex-1 bg-white border-2 border-accent text-primary rounded-lg py-3
                                hover:bg-gray-50 transition-colors"
                            >
                                Previous
                            </button>
                        )}
                        <button
                            type='submit'
                            className="flex-1 bg-primary text-white rounded-lg py-3 hover:bg-primary/90
                            transition-colors focus:ring-2 focus:ring-highlight focus:ring-offset-2"
                        >
                            {currentStep === 1 ? 'Next' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-secondary">
                    Already have an account?{' '}
                    <a href="/login" className="text-highlight hover:underline">
                        Log in here
                    </a>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
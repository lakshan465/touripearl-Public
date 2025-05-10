import { useState } from 'react';
import { useAuth } from '../../utils/Auth.js';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(newErrors).length > 0) {
            toast.error(newErrors.email || newErrors.password);
            return;
        }

        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
        } catch (error) {
            toast.error(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-primary via-secondary to-accent">
            <div className="w-full min-h-screen backdrop-blur-sm bg-white/10 flex">
                {/* Left Panel - Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                    <div className="max-w-xl w-full mx-auto backdrop-blur-md bg-white/80 p-8 rounded-2xl shadow-lg">
                        <div className="space-y-2 mb-8">
                            <h1 className="text-4xl font-bold tracking-tight text-primary">
                                Welcome back
                            </h1>
                            <p className="text-secondary/90">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-sm font-medium text-primary">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-secondary"/>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="name@example.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-accent/20 text-primary shadow-sm placeholder-secondary/50 focus:ring-2 focus:ring-highlight/50 focus:border-transparent focus:outline-none backdrop-blur-sm"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="password" className="text-sm font-medium text-primary">
                                    Password
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-secondary"/>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/50 border border-accent/20 text-primary shadow-sm placeholder-secondary/50 focus:ring-2 focus:ring-highlight/50 focus:border-transparent focus:outline-none backdrop-blur-sm"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <NavLink
                                    to="/forgot-password"
                                    className="text-sm font-medium text-highlight hover:text-highlight/80 hover:underline transition-colors"
                                >
                                    Forgot password?
                                </NavLink>
                            </div>

                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-highlight/50 disabled:cursor-wait transition-all duration-300"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                                <ArrowRight className="w-4 h-4"/>
                            </button>

                            <div className="text-center text-sm text-secondary">
                                Don't have an account?{' '}
                                <NavLink
                                    to="/signUp"
                                    className="font-medium text-highlight hover:text-highlight/80 hover:underline transition-colors"
                                >
                                    Create an account
                                </NavLink>
                            </div>
                        </form>

                        <p className="mt-8 text-xs text-center text-secondary/90">
                            By signing in, you agree to our{' '}
                            <a href="#"
                               className="text-highlight hover:text-highlight/80 hover:underline transition-colors">Terms
                                of Service</a>{' '}
                            and{' '}
                            <a href="#"
                               className="text-highlight hover:text-highlight/80 hover:underline transition-colors">Privacy
                                Policy</a>
                        </p>
                    </div>
                </div>

                {/* Right Panel - Content */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 lg:px-24">
                    <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl space-y-6">
                        <h2 className="text-3xl font-bold text-white">TouriPearl</h2>
                        <p className="text-lg/relaxed text-light/90">
                            Discover amazing destinations and create unforgettable memories with our curated travel
                            experiences.
                        </p>
                        <div className="pt-4">
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-light/80"></div>
                                <div className="w-2 h-2 rounded-full bg-light/60"></div>
                                <div className="w-2 h-2 rounded-full bg-light/40"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
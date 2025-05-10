import React from 'react';
import { MapPin, Users, Award, DollarSign, MessageCircle, Calendar, Compass, Star, CheckCircle, ChevronRight } from 'lucide-react';
import {Link} from "react-router-dom";

export default function GuideIntro() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative">
                <div className="w-full h-96 overflow-hidden">
                    <img
                        src="/images/guide-intro/hero.jpg"
                        alt="Touripearl guide experience"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Become a <span className="text-teal-300">Touripearl</span> Guide
                        </h1>
                        <p className="text-xl text-white max-w-2xl mx-auto">
                            Share your passion for travel and create unforgettable experiences
                        </p>
                        <Link
                            to={'/guide-application-form'}
                        >
                            <button
                                className="mt-8 bg-teal-500 hover:bg-teal-600 text-white font-medium px-8 py-3 rounded-full shadow-lg transition duration-200">
                                Apply Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="container mx-auto px-4 py-16 max-w-5xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Share Your Local Expertise</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join our global community of passionate guides and help travelers discover authentic experiences
                        while earning flexible income.
                    </p>
                </div>
            </div>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Why Become a Touripearl
                        Guide?</h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="bg-teal-100 p-3 rounded-full">
                                    <DollarSign className="text-teal-600" size={24}/>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-medium text-gray-800">Flexible Income</h3>
                                    <p className="text-gray-600">Set your own rates and schedule. Keep 85% of what you
                                        earn.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-teal-100 p-3 rounded-full">
                                    <Users className="text-teal-600" size={24}/>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-medium text-gray-800">Meet New People</h3>
                                    <p className="text-gray-600">Connect with travelers from around the world and share
                                        your culture.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-teal-100 p-3 rounded-full">
                                    <Award className="text-teal-600" size={24}/>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-medium text-gray-800">Build Your Reputation</h3>
                                    <p className="text-gray-600">Earn badges, positive reviews, and grow your personal
                                        brand.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-teal-100 p-3 rounded-full">
                                    <Compass className="text-teal-600" size={24}/>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-medium text-gray-800">Design Your Experiences</h3>
                                    <p className="text-gray-600">Create unique tours and activities based on your
                                        passion and expertise.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <img
                                src="/images/guide-intro/img2.jpg"
                                alt="Guide showing landmarks to tourists"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="mt-16 bg-teal-50 p-8 rounded-xl shadow-md">
                        <h3 className="text-2xl font-medium text-gray-800 mb-6 text-center">Guide Success Stories</h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center mb-4">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                                        <img src="/images/guide-intro/img1.jpg" alt="Guide avatar"
                                             className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-gray-800 font-medium text-lg">Maria from Barcelona</p>
                                        <div className="flex items-center">
                                            <Star className="text-yellow-400" size={16}/>
                                            <Star className="text-yellow-400" size={16}/>
                                            <Star className="text-yellow-400" size={16}/>
                                            <Star className="text-yellow-400" size={16}/>
                                            <Star className="text-yellow-400" size={16}/>
                                            <span className="ml-2 text-gray-600 text-sm">(127 tours)</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"Becoming a Touripearl guide has allowed me to share
                                    my love for Barcelona's hidden culinary gems while meeting amazing people from
                                    across the globe."</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center mb-4">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                                        <img src="/images/guide-intro/img3.jpg" alt="Guide avatar"
                                             className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-gray-800 font-medium text-lg">Takashi from Kyoto</p>
                                        <div className="flex items-center">
                                            <Star className="text-yellow-400" size={16}/>
                                            <Star className="text-yellow-400" size={16}/>
                                            <Star className="text-yellow-400" size={16}/>
                                            <Star className="text-yellow-400" size={16}/>
                                            <Star className="text-yellow-400" size={16}/>
                                            <span className="ml-2 text-gray-600 text-sm">(93 tours)</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"I've been able to showcase traditional Japanese
                                    crafts to visitors while supporting local artisans. The platform's design makes it
                                    easy to manage bookings."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Guide Requirements</h2>

                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="md:w-1/2">
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <CheckCircle className="text-teal-600 mt-1 flex-shrink-0" size={20}/>
                                    <div className="ml-3">
                                        <h3 className="text-xl font-medium text-gray-800">Local Knowledge</h3>
                                        <p className="text-gray-600">Deep familiarity with your destination, including
                                            history, culture, and hidden gems.</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <CheckCircle className="text-teal-600 mt-1 flex-shrink-0" size={20}/>
                                    <div className="ml-3">
                                        <h3 className="text-xl font-medium text-gray-800">Communication Skills</h3>
                                        <p className="text-gray-600">Proficiency in English and/or other relevant
                                            languages for your destination.</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <CheckCircle className="text-teal-600 mt-1 flex-shrink-0" size={20}/>
                                    <div className="ml-3">
                                        <h3 className="text-xl font-medium text-gray-800">Reliability</h3>
                                        <p className="text-gray-600">Commitment to maintaining schedules and providing
                                            consistent quality service.</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <CheckCircle className="text-teal-600 mt-1 flex-shrink-0" size={20}/>
                                    <div className="ml-3">
                                        <h3 className="text-xl font-medium text-gray-800">Passion for Hospitality</h3>
                                        <p className="text-gray-600">Genuine interest in creating memorable experiences
                                            for travelers.</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <CheckCircle className="text-teal-600 mt-1 flex-shrink-0" size={20}/>
                                    <div className="ml-3">
                                        <h3 className="text-xl font-medium text-gray-800">Documentation</h3>
                                        <p className="text-gray-600">Valid ID and any necessary permits or licenses for
                                            your specific tour activities.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/2">
                            <div className="rounded-xl overflow-hidden shadow-lg h-full">
                                <img
                                    src="/images/guide-intro/img4.jpg"
                                    alt="Passionate guide sharing local knowledge"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">How to Join Touripearl</h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <img
                                src="/images/guide-intro/img5.jpg"
                                alt="Guide onboarding process"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-8">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white font-bold">
                                        1
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-medium text-gray-800">Complete Your Application</h3>
                                    <p className="text-gray-600 mt-1">Fill out our comprehensive guide application form
                                        with your personal information, experience, and proposed tour ideas.</p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white font-bold">
                                        2
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-medium text-gray-800">Verification Process</h3>
                                    <p className="text-gray-600 mt-1">Our team will verify your identity, review your
                                        qualifications, and may conduct a virtual interview.</p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white font-bold">
                                        3
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-medium text-gray-800">Create Your Experiences</h3>
                                    <p className="text-gray-600 mt-1">Design your tour offerings with detailed
                                        descriptions, itineraries, pricing, and captivating photos.</p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white font-bold">
                                        4
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-medium text-gray-800">Go Live!</h3>
                                    <p className="text-gray-600 mt-1">Once approved, your profile and experiences will
                                        be published on our platform for travelers to discover.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced User Experience Section */}
            <section className="py-16 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Enhanced User Experience</h2>

                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="md:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                                    <div className="text-center mb-4">
                                        <div
                                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500 mb-4">
                                            <Calendar className="text-white" size={32}/>
                                        </div>
                                        <h3 className="text-xl font-medium">Intuitive Dashboard</h3>
                                    </div>
                                    <p className="text-center">Manage bookings, update availability, and track earnings
                                        with our user-friendly guide dashboard.</p>
                                </div>

                                <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                                    <div className="text-center mb-4">
                                        <div
                                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500 mb-4">
                                            <MessageCircle className="text-white" size={32}/>
                                        </div>
                                        <h3 className="text-xl font-medium">Real-Time Messaging</h3>
                                    </div>
                                    <p className="text-center">Connect with travelers before, during, and after tours
                                        with our secure messaging system.</p>
                                </div>

                                <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                                    <div className="text-center mb-4">
                                        <div
                                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500 mb-4">
                                            <MapPin className="text-white" size={32}/>
                                        </div>
                                        <h3 className="text-xl font-medium">Interactive Maps</h3>
                                    </div>
                                    <p className="text-center">Create and share custom routes with interactive maps that
                                        highlight key points of interest.</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/3">
                            <div className="rounded-xl overflow-hidden shadow-lg h-full">
                                <img
                                    src="/images/guide-intro/vector.jpg"
                                    alt="Passionate guide sharing local knowledge"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Call to Action */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Share Your Local Expertise?</h2>
                    <p className="text-xl text-gray-600 mb-8">Join our global community of passionate guides today</p>

                    <Link
                        to={'/guide-application-form'}
                    >
                        <button
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-4 rounded-full shadow-lg transition duration-200 text-lg flex items-center mx-auto">
                            Apply Now
                            <ChevronRight className="ml-2" size={20}/>
                        </button>
                    </Link>

                    <p className="mt-8 text-gray-500">
                        Questions? Contact us at <span className="text-teal-600">guides@touripearl.com</span>
                    </p>
                </div>
            </section>
        </div>
    );
}
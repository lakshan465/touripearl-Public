import React from 'react';
import { Map, Users, Home, Car, Compass, Bell, Star, ThumbsUp, Calendar } from 'lucide-react';

export default function CustomizedIntro() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Hero Section */}
            <section className="relative py-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/api/placeholder/1200/600"
                        alt="Beautiful tourist destination"
                        className="w-full h-full object-cover opacity-30 dark:opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600/70 to-blue-600/70 dark:from-teal-800/80 dark:to-blue-900/80"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Create Your Perfect Custom Tour</h1>
                        <p className="text-lg text-white/90 mb-8">Connect with local guides who will tailor your travel experience based on your preferences and interests.</p>
                        <button className="bg-white text-teal-700 dark:bg-teal-600 dark:text-white py-3 px-8 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                            Create Your Tour Now
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">How Custom Tours Work</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mb-4">
                                <Map className="text-teal-600 dark:text-teal-300" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">1. Create Your Tour Request</h3>
                            <p className="text-gray-600 dark:text-gray-300">Fill out a simple form with your destination, group size, accommodation needs, transportation preferences, and must-see attractions.</p>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mb-4">
                                <Bell className="text-teal-600 dark:text-teal-300" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">2. Guides Review & Respond</h3>
                            <p className="text-gray-600 dark:text-gray-300">Available guides receive your request and interested guides will add their pricing details for your consideration.</p>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mb-4">
                                <ThumbsUp className="text-teal-600 dark:text-teal-300" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">3. Choose & Confirm</h3>
                            <p className="text-gray-600 dark:text-gray-300">Review guide profiles, ratings, and pricing. Select your preferred guide and confirm your custom tour with payment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Tour Features */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Customize Every Detail of Your Tour</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Map className="text-teal-600 dark:text-teal-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Select Your Destination</h3>
                                        <p className="text-gray-600 dark:text-gray-300">Choose any location you wish to explore, from popular tourist spots to hidden local gems.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Users className="text-teal-600 dark:text-teal-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Specify Group Size</h3>
                                        <p className="text-gray-600 dark:text-gray-300">Whether you're traveling solo, as a couple, or with family and friends, we'll find a guide that fits your needs.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Home className="text-teal-600 dark:text-teal-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Accommodation Options</h3>
                                        <p className="text-gray-600 dark:text-gray-300">Let guides know if you need help with accommodation arrangements or if you've already booked your stay.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Car className="text-teal-600 dark:text-teal-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Transportation Preferences</h3>
                                        <p className="text-gray-600 dark:text-gray-300">Request local transportation services or specify if you'll arrange your own way around.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Compass className="text-teal-600 dark:text-teal-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Custom Attractions</h3>
                                        <p className="text-gray-600 dark:text-gray-300">Highlight the specific attractions, experiences, or hidden spots you want to include in your tour.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <img
                                src="/api/placeholder/600/800"
                                alt="Customized tour experience"
                                className="w-full h-auto rounded-xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Guide Selection Process */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">How Guides Respond to Your Request</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                            <img src="/api/placeholder/400/240" alt="Guide profile view" className="w-full h-48 object-cover rounded-lg mb-6" />
                            <h3 className="text-xl font-semibold mb-4">Guide's Point of View</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mt-1">
                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-300">1</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Guides receive notifications about new tour requests that match their availability.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mt-1">
                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-300">2</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Guides can view all details of your tour request and decide if they want to take it.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mt-1">
                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-300">3</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Interested guides add their pricing and any special notes for the tour.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mt-1">
                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-300">4</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Guides organize their tour requests into New, Selected, and Confirmed categories.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                            <img src="/api/placeholder/400/240" alt="Tourist selection process" className="w-full h-48 object-cover rounded-lg mb-6" />
                            <h3 className="text-xl font-semibold mb-4">Your Selection Process</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mt-1">
                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-300">1</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">You receive notifications when guides express interest in your tour request.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mt-1">
                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-300">2</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Review each guide's profile, ratings, reviews, and their price quote for your tour.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mt-1">
                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-300">3</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Select the guide who best matches your preferences and budget.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mt-1">
                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-300">4</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Complete payment to confirm your tour and start planning details with your chosen guide.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Tour Examples */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Popular Custom Tour Experiences</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
                            <div className="relative h-48">
                                <img src="/api/placeholder/400/300" alt="City tour" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4">
                                    <h3 className="text-white font-bold text-xl">City Exploration</h3>
                                    <div className="flex items-center gap-1 text-amber-400 mt-1">
                                        <Star size={16} />
                                        <Star size={16} />
                                        <Star size={16} />
                                        <Star size={16} />
                                        <Star size={16} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Discover hidden gems, local hotspots, and iconic landmarks with a knowledgeable city guide.</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Users size={16} />
                                    <span>1-6 travelers</span>
                                    <span className="mx-1">•</span>
                                    <Calendar size={16} />
                                    <span>4-8 hours</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
                            <div className="relative h-48">
                                <img src="/api/placeholder/400/300" alt="Food tour" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4">
                                    <h3 className="text-white font-bold text-xl">Culinary Journey</h3>
                                    <div className="flex items-center gap-1 text-amber-400 mt-1">
                                        <Star size={16} />
                                        <Star size={16} />
                                        <Star size={16} />
                                        <Star size={16} />
                                        <Star size={16} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Taste authentic local cuisine at the best spots known only to residents with a foodie guide.</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Users size={16} />
                                    <span>2-8 travelers</span>
                                    <span className="mx-1">•</span>
                                    <Calendar size={16} />
                                    <span>3-5 hours</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
                            <div className="relative h-48">
                                <img src="/api/placeholder/400/300" alt="Adventure tour" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4">
                                    <h3 className="text-white font-bold text-xl">Adventure Excursion</h3>
                                    <div className="flex items-center gap-1 text-amber-400 mt-1">
                                        <Star size={16} />
                                        <Star size={16} />
                                        <Star size={16} />
                                        <Star size={16} />
                                        <Star size={16} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Experience thrilling outdoor activities with expert guides who know the best spots for adventure.</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Users size={16} />
                                    <span>1-4 travelers</span>
                                    <span className="mx-1">•</span>
                                    <Calendar size={16} />
                                    <span>Full day</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-800 dark:to-blue-900">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience a Customized Tour?</h2>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">Create your personalized travel experience with local guides who know their cities best.</p>
                    <button className="bg-white text-teal-700 dark:bg-teal-500 dark:text-white py-3 px-8 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
                        Create Your Custom Tour
                    </button>
                </div>
            </section>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import { getGuideProfile } from "../../api/guideAPI";
import { Link, useParams } from "react-router-dom";
import { MapPin, Mail, Phone, Star, Clock, Globe, Calendar, Users, Languages, Briefcase, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@components/card/card";
import DateRangeAvailabilityCalendar from "../DateAvalabilityCalender";

const GuideProfile = () => {
    const { id } = useParams();
    const [guide, setGuide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const data = await getGuideProfile(id);
                setGuide(data.object);
                setReviews(data.object.reviewList);
                console.log(data.object.reviewList)
            } catch (error) {
                console.error("Error fetching guide profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGuide();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-lg font-medium text-red-600 dark:text-red-400">
                    Could not load guide profile. Please try again.
                </div>
            </div>
        );
    }

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Icon className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
                <span className="text-gray-600 dark:text-gray-400">{value}</span>
            </div>
        </div>
    );

    const getLastSeen = (lastSeen) => {
        const now = new Date();
        const lastSeenDate = new Date(lastSeen);
        const diffInSeconds = Math.floor((now - lastSeenDate) / 1000);
        if (diffInSeconds < 60) {
            return "Online";
        } else {
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            return diffInMinutes <= 60 ? `${diffInMinutes} minutes ago` : lastSeenDate.toLocaleString();
        }
    };

    const StarRating = ({rating}) => {
        return (
            <div className="text-accent">
                {'★'.repeat(rating)}
                {'☆'.repeat(5 - rating)}
            </div>
        );
    };

    const isOnline = getLastSeen(guide.lastSeen) === "Online";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 transform transition-all hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="relative group">
                            <div
                                className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-50 group-hover:opacity-100 blur transition duration-300"/>
                            <img
                                src={guide?.profileImageUrl?.resourceUrl}
                                alt={`${guide.firstname}'s Profile`}
                                className="relative w-40 h-40 rounded-full object-cover border-4 border-white dark:border-gray-700"
                            />
                            {/* Status Indicators */}
                            <div
                                className={`absolute -top-2 -right-2 px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-medium shadow-lg ${
                                    isOnline ? 'bg-green-50 text-green-600 dark:bg-green-900/90 dark:text-green-300' : 'bg-gray-50 text-gray-600 dark:bg-gray-700/90 dark:text-gray-300'
                                }`}>
                                <div
                                    className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}/>
                                <span>{getLastSeen(guide.lastSeen)}</span>
                            </div>
                            {guide.hasLicense && (
                                <div
                                    className="absolute -bottom-2 -right-2 bg-green-50 text-green-600 dark:bg-green-900/90 dark:text-green-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                                    <CheckCircle2 className="w-4 h-4"/>
                                    <span className="text-sm font-medium">Licensed</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
                                {guide.firstname} {guide.lastname}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <div
                                    className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/90 dark:text-yellow-300 px-4 py-1.5 rounded-full shadow-sm">
                                    <Star className="w-4 h-4"/>
                                    <span className="font-medium">{guide.starMean}</span>
                                </div>
                                <div
                                    className="flex items-center gap-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/90 dark:text-blue-300 px-4 py-1.5 rounded-full shadow-sm">
                                    <Globe className="w-4 h-4"/>
                                    <span>{guide.nationality}</span>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">{guide.biography}</p>
                        </div>
                    </div>
                </div>

                {/* Contact & Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover:shadow-lg transition-shadow dark:bg-gray-900">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-500"/>
                                Contact Information
                            </h2>
                            <div className="space-y-2">
                                <InfoItem icon={MapPin} label="Location" value={`${guide.city}, ${guide.country}`}/>
                                <InfoItem icon={Mail} label="Email" value={guide.email}/>
                                <InfoItem icon={Phone} label="Phone" value={guide.phone}/>
                                <InfoItem icon={Clock} label="Last Active" value={getLastSeen(guide.lastSeen)}/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow dark:bg-gray-900">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-blue-500"/>
                                Professional Details
                            </h2>
                            <div className="space-y-2">
                                <InfoItem
                                    icon={Languages}
                                    label="Languages"
                                    value={guide.guideLanguages.map(lang => lang.languageName).join(", ")}
                                />
                                <InfoItem
                                    icon={MapPin}
                                    label="Working Areas"
                                    value={guide.workingAreas.join(", ")}
                                />
                                <InfoItem
                                    icon={Calendar}
                                    label="Available"
                                    value={guide.workingDays.join(", ")}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Availability Calendar Section */}
                <Card className="hover:shadow-lg transition-shadow dark:bg-gray-900">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-blue-500"/>
                            Guide Availability
                        </h2>
                        <div className="text-gray-600 dark:text-gray-400 mb-4">
                            <p className="mb-2">Check {guide.firstname}'s availability for your trip dates:</p>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                                    <span>Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                                    <span>Unavailable (Booked)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                                    <span>Past Dates</span>
                                </div>
                            </div>
                        </div>
                        <DateRangeAvailabilityCalendar guideId={id}/>
                    </CardContent>
                </Card>

                {/* Tours Section */}
                <Card className="hover:shadow-lg transition-shadow dark:bg-gray-900">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-blue-500"/>
                            Available Tours
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {guide.tours.map(tour => (
                                <Link to={`/tours/${tour.id}`} key={tour.id}
                                      className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-xl">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-500 transition-colors">
                                        {tour.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {tour.description}
                                    </p>
                                    <div
                                        className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4"/>
                                            {new Date(tour.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4"/>
                                            {tour.duration} days
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            show more details
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id}
                             className="p-4 border border-secondary rounded-lg bg-light/50 dark:bg-gray-900/50">
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-10 h-10 rounded-full bg-light dark:bg-gray-800 flex items-center justify-center text-primary dark:text-white">
                                    <span className="text-sm font-bold">
                                    {review.touristResponseDto.userName ? review.touristResponseDto.userName.split(" ").map((word) =>
                                        word[0]).join("") : null}
                                </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-semibold text-primary dark:text-white">{review.touristResponseDto.userName}</p>
                                            <StarRating rating={review.rating}/>
                                        </div>
                                        <span className="text-secondary dark:text-gray-300 text-sm">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-secondary dark:text-gray-300">{review?.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuideProfile;
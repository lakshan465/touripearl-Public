import React from "react"; //find which guide choose tourist application and their bid
import { useParams, useNavigate, Link } from "react-router-dom";
import TouristLayout from "../user-layouts/TouristLayout.jsx";
import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // FontAwesome Star Icons

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
} from "../table/Table.jsx";
import { Eye } from "lucide-react"; // Import the Eye icon
import Loader from "../../pages/admin/pages/GuideManagementPage/guideComponents/Loding2.jsx";
import axiosFetch from "../../utils/axiosFetch.js";

import Cookies from "js-cookie";

function ConfirmTourList() {
    const [loading, setLoading] = useState(false);
    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const guideId = Cookies.get("UUID");

    const fetchTour = async (page) => {
        try {
            setLoading(true);
            const response = await axiosFetch.get(
                `api/v1/tourists/touristIdc`,
                {
                    params: { page },
                }
            );
            setApplications(response.data.content || []);
            setCurrentPage(response.data.page.number);
            setTotalPages(response.data.page.totalPages || 0);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const handlePageChange = (page) => {
        if (page !== currentPage) setCurrentPage(page);
    };

    useEffect(() => {
        fetchTour(currentPage);
    }, [currentPage]);

    return (
        <TouristLayout>
            <div className="relative max-w-full mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 shadow-md">
                <div className="flex justify-center my-4 items-center mx-4">
                    <Link to="/customTour">
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md flex justify-center hover:opacity-90 hover:text-gray-200 transition duration-300 transform hover:scale-105">
                            Create New Custom Tour
                        </button>
                    </Link>
                    <Link to="/confirmCustomTour">
                        <button className="ml-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md flex justify-center hover:opacity-90 hover:text-gray-200 transition duration-300 transform hover:scale-105">
                            Your Confirm Tours
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                    {applications.map((tour) => (
                        <div
                            key={tour.tourIdc}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                        >
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tour.startDatec} - {tour.endDatec}</h3>
                            </div>

                            <div className="mt-4 space-y-2">
                                {/* Need Hotel Booking */}
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Need Hotel Booking:</span>
                                    <span className={`text-sm px-3 py-1 rounded-full font-semibold ${tour.accommodation ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-800"}`}>
                                        {tour.accommodation ? "Yes" : "No"}
                                    </span>
                                </div>

                                {/* Need Vehicle Booking */}
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Need Vehicle Booking:</span>
                                    <span className={`text-sm px-3 py-1 rounded-full font-semibold ${tour.guideWithVehicle ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-800"}`}>
                                        {tour.guideWithVehicle ? "Yes" : "No"}
                                    </span>
                                </div>

                                {/* Need Tickets Booking */}
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Need Tickets Booking:</span>
                                    <span className={`text-sm px-3 py-1 rounded-full font-semibold ${tour.guideNeedToBookTicket ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-800"}`}>
                                        {tour.guideNeedToBookTicket ? "Yes" : "No"}
                                    </span>
                                </div>

                                {/* Number of Travelers */}
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Number of Travelers:</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tour.travelersc}</span>
                                </div>

                                {/* PickUp Location */}
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">PickUp Location:</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tour.pickupLocationc}</span>
                                </div>

                                {/* Visiting Places */}
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Visiting Places:</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {tour.placesToVisitc && tour.placesToVisitc.length > 0 ? (
                                            tour.placesToVisitc.join(", ")
                                        ) : (
                                            <span className="text-gray-500">No places specified</span>
                                        )}
                                    </span>
                                </div>

                                {/* Special Attraction */}
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Special Attraction:</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {tour.specialAttractionsc && tour.specialAttractionsc.length > 0 ? (
                                            tour.specialAttractionsc.join(", ")
                                        ) : (
                                            <span className="text-gray-500">No Special Attractions specified</span>
                                        )}
                                    </span>
                                </div>

                                {/* Activities */}
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Activities:</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {tour.activitiesc && tour.activitiesc.length > 0 && tour.activitiesc.some(activity => activity.trim() !== "") ? (
                                            tour.activitiesc.filter(activity => activity.trim() !== "").join(", ")
                                        ) : (
                                            <span className="text-gray-500">No Activities specified</span>
                                        )}
                                    </span>
                                </div>

                                {/* Transport Vehicle Type */}
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Transport Vehicle Type:</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tour.transportc}</span>
                                </div>

                                {/* Rating */}
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Tourist Rating:</span>
                                    <div className="flex items-center">
                                        {Array.from({ length: 5 }, (_, index) => {
                                            if (index < Math.floor(tour.starMeanc)) {
                                                return <FaStar key={index} className="text-yellow-500" />;
                                            } else if (index < tour.starMeanc) {
                                                return <FaStarHalfAlt key={index} className="text-yellow-500" />;
                                            } else {
                                                return <FaRegStar key={index} className="text-yellow-500" />;
                                            }
                                        })}
                                    </div>
                                </div>

                                {/* Guide Image */}
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Guide Profile Pic:</span>
                                    <div className="w-9 h-9 rounded-full overflow-hidden">
                                        <img src={tour.profilePictureUrlc} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300">
                                    Review
                                </button>
                            </div>


                        </div>
                    ))}
                </div>

                {totalPages > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </TouristLayout>
    );
}

export default ConfirmTourList;

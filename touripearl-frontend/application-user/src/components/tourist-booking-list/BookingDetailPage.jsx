import React, {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import axiosFetch from "../../utils/axiosFetch";
import TouristLayout from "../user-layouts/TouristLayout.jsx";
import ReviewPopup from "../review-popup/ReviewPopup.jsx";

export default function BookingDetailPage() {
    const {bookingId} = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReviewPopUp, setIsReviewPopUp] = useState(false);

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        setLoading(true);
        try {
            const response = await axiosFetch.get(`/api/v1/booking/${bookingId}`);
            console.log(response)
            if (response.data) {
                setBooking(response.data.object);
            } else {
                setError("Booking not found");
            }
        } catch (err) {
            setError("Failed to fetch booking details. Please try again later.");
            console.error("Error fetching booking details:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            CONFIRMED: "bg-green-100 text-green-800 border-green-200",
            PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
            CANCELLED: "bg-red-100 text-red-800 border-red-200",
            COMPLETED: "bg-blue-100 text-blue-800 border-blue-200"
        };

        const style = statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${style}`}>
        {status}
      </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-4">
                <div className="bg-red-50 p-6 rounded-lg text-center max-w-lg w-full">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-4">
                <div className="bg-gray-50 p-6 rounded-lg text-center max-w-lg w-full">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Booking Not Found</h2>
                    <p className="text-gray-700 mb-4">The booking you're looking for doesn't exist or has been
                        removed.</p>
                    <button
                        onClick={() => navigate("/bookings")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        View All Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <TouristLayout>
            <div className="max-w-full mx-auto p-4 bg-gray-600 py-20">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:underline"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Back to Bookings
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">
                                {booking.customTourResponseDto ? "Custom Tour Booking" : "Property Booking"}
                            </h1>
                            {getStatusBadge(booking.status)}
                        </div>
                        <p className="mt-2 text-blue-100">
                            {booking.customTourResponseDto ? booking.customTourResponseDto.name : `Property ID: ${booking.propertyId}`}
                        </p>
                    </div>

                    {/* Booking Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Booking Information</h2>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-600 block">Booking Period</span>
                                        <span className="font-medium">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </span>
                                        <span className="text-sm text-gray-500 ml-2">
                    ({calculateDuration(booking.startDate, booking.endDate)} days)
                  </span>
                                    </div>

                                    {booking.customTourResponseDto && (
                                        <div>
                                            <span className="text-gray-600 block">Tour Type</span>
                                            <span className="font-medium">Custom Tour</span>
                                        </div>
                                    )}

                                    <div>
                                        <span className="text-gray-600 block">Status</span>
                                        <span className="font-medium">{booking.status}</span>
                                    </div>
                                </div>
                            </div>

                            {booking.reservationResponseDto && (
                                <div>
                                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Reservation Details</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-600 block">Reservation ID</span>
                                            <span className="font-medium">{booking.reservationResponseDto.id}</span>
                                        </div>
                                        {booking.reservationResponseDto.price && (
                                            <div>
                                                <span className="text-gray-600 block">Price</span>
                                                <span
                                                    className="font-medium">${booking.reservationResponseDto.price.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Custom Tour Details */}
                        {booking.customTourResponseDto && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Custom Tour Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-600 block">Tour Name</span>
                                            <span className="font-medium">{booking.customTourResponseDto.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 block">Destination</span>
                                            <span
                                                className="font-medium">{booking.customTourResponseDto.destination || "Not specified"}</span>
                                        </div>
                                        {booking.customTourResponseDto.touristCount && (
                                            <div>
                                                <span className="text-gray-600 block">Number of Tourists</span>
                                                <span
                                                    className="font-medium">{booking.customTourResponseDto.touristCount}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {booking.customTourResponseDto.description && (
                                            <div>
                                                <span className="text-gray-600 block">Description</span>
                                                <p className="text-gray-800">{booking.customTourResponseDto.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Property Details */}
                        {booking.propertyId && !booking.customTourResponseDto && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Property Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-600 block">Property ID</span>
                                            <span className="font-medium">{booking.propertyId}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 p-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                                <Link to={`/tourist/booking-list/${bookingId}/cancel`}>
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Cancel Booking
                                    </button>
                                </Link>
                            )}
                            {((new Date(booking.endDate) >= new Date()) && booking.status === "COMPLETED") ? (
                                    <button
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-not-allowed"
                                        disabled
                                        title={'It is not time to complete'}
                                    >
                                        Complete & Write Review
                                    </button>
                                ) :
                                <button
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    onClick={() => setIsReviewPopUp(true)}
                                >
                                    Complete & Write Review
                                </button>
                            }
                            {isReviewPopUp && <ReviewPopup onClose={() => setIsReviewPopUp(false)}
                                                           id={booking.reservationResponseDto.viewResponseDto.guideId} bookingId={booking.propertyId}/>}

                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Print Details
                            </button>

                            {new Date(booking.endDate) >= new Date() ? (

                                <button
                                    className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                                    disabled
                                >
                                    Open Dispute
                                </button>
                            ) : (
                                <Link to={`/dispute/${bookingId}`}>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Open Dispute
                                    </button>
                                </Link>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </TouristLayout>
    );
}
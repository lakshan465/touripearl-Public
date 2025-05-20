
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {
    Calendar,
    Clock,
    DollarSign,
    User,
    Users,
    Home,
    FileText,
    Mail,
    Phone,
    Check,
    X,
    AlertCircle
} from 'lucide-react';
import axiosFetch from "../../../../utils/axiosFetch.js";
import GuideDashboard from "../../Dashboard/GuideDashboard.jsx";

const BookingDetailsGuide = () => {
    const {bookingId} = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                setLoading(true);
                const response = await axiosFetch.get(`/api/v1/booking/${bookingId}`);
                setBooking(response.data.object);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading booking details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-red-500 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle size={24}/>
                    <span>Error loading booking: {error}</span>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-red-500 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle size={24}/>
                    <span>No booking found with ID: {bookingId}</span>
                </div>
            </div>
        );
    }

    const {reservationResponseDto, startDate, endDate, propertyId} = booking;
    const tourist = reservationResponseDto.touristResponseDto;
    const view = reservationResponseDto.viewResponseDto;

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <GuideDashboard>
            <div className="max-w-6xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                {/* Booking Summary Card */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-8">
                    <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Booking #{bookingId.substring(0, 8)}</h2>
                            <span
                                className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(reservationResponseDto.status)}`}>
              {reservationResponseDto.status}
            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Calendar size={20}/> Reservation Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
                                            <p className="font-medium">{formatDate(startDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Calendar className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Check-out</p>
                                            <p className="font-medium">{formatDate(endDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Clock className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                                            <p className="font-medium">{new Date(reservationResponseDto.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <DollarSign className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Cost</p>
                                            <p className="font-medium">${reservationResponseDto.totalCost}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User size={20}/> Guest Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <User className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Guest Name</p>
                                            <p className="font-medium">{tourist.firstName} {tourist.lastName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Mail className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="font-medium">{tourist.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Phone className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                            <p className="font-medium">{tourist.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-6"/>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Home size={20}/> Property Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Home className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Property ID</p>
                                            <p className="font-medium">{propertyId}</p>
                                        </div>
                                    </div>
                                    {view && (
                                        <>
                                            <div className="flex items-start gap-2">
                                                <FileText className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">View Name</p>
                                                    <p className="font-medium">{view.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <FileText className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                                                    <p className="font-medium">{view.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Clock className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={18}/>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                                                    <p className="font-medium">{view.duration} days</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Users size={20}/> Tour People
                                </h3>
                                {reservationResponseDto.tourPeoples && reservationResponseDto.tourPeoples.length > 0 ? (
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                                        <table className="min-w-full">
                                            <thead>
                                            <tr>
                                                <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-300">Name</th>
                                                <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-300">Passport</th>
                                                <th className="text-left text-sm font-medium text-gray-500 dark:text-gray-300">Type</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {reservationResponseDto.tourPeoples.map((person, index) => (
                                                <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                                                    <td className="py-2">{person.name}</td>
                                                    <td className="py-2">{person.passportNumber}</td>
                                                    <td className="py-2">{person.type || "N/A"}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 italic">No tour people information available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    <button
                        className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-md flex items-center gap-2">
                        <FileText size={18}/>
                        Generate Invoice
                    </button>
                    {reservationResponseDto.status !== 'CANCELLED' && (
                        <button
                            className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white px-6 py-2 rounded-md flex items-center gap-2">
                            <X size={18}/>
                            Cancel Booking
                        </button>
                    )}
                    <button
                        className="bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 text-white px-6 py-2 rounded-md flex items-center gap-2">
                        <Mail size={18}/>
                        Contact Guest
                    </button>
                </div>
            </div>
        </GuideDashboard>
    );
};

export default BookingDetailsGuide;
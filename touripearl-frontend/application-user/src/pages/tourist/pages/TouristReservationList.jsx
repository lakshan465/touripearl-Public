import React, {useEffect, useState} from 'react';
import axiosFetch from '../../../utils/axiosFetch';
import {Calendar, Clock, Map, Camera, User, AlertCircle, Loader2, Check, X, Info, Search} from 'lucide-react';
import {format} from 'date-fns';
import TouristLayout from '../../../components/user-layouts/TouristLayout';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import ReviewPopup from "../../../components/review-popup/ReviewPopup.jsx";

const TouristReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const [isReviewPopUp, setIsReviewPopUp] = useState(false);

    const fetchReservations = async (searchKeyword = keyword, pageNumber = page, pageSize = size) => {
        setLoading(true);
        try {
            const response = await axiosFetch.get('/api/reservations/tourist/search-by-keyword', {
                params: {
                    page: pageNumber,
                    size: pageSize,
                    keyword: searchKeyword
                }
            });
            setReservations(response.data.object.content);
            setTotalPages(response.data.object.page.totalPages || 1);
            setTotalElements(response.data.object.page.totalElements || 0);

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchReservations(keyword, 0, size);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(0);
        // You could also add filtering by status in your API call here
        fetchReservations(keyword, 0, size);
    };

    const getStatusDetails = (status) => {
        switch (status) {
            case 'PENDING':
                return {
                    icon: <Clock className="w-5 h-5"/>,
                    label: 'Pending',
                    description: 'Awaiting confirmation from the host',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200'
                };
            case 'CONFIRMED':
                return {
                    icon: <Check className="w-5 h-5"/>,
                    label: 'Confirmed',
                    description: 'Your reservation is confirmed',
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200'
                };
            case 'CANCELLED':
                return {
                    icon: <X className="w-5 h-5"/>,
                    label: 'Cancelled',
                    description: 'This reservation has been cancelled',
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200'
                };
            case 'PAID':
                return {
                    icon: <Check className="w-5 h-5"/>,
                    label: 'Paid',
                    description: 'Payment received for this reservation',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200'
                }
            default:
                return {
                    icon: <Info className="w-5 h-5"/>,
                    label: 'Unknown',
                    description: 'Status unknown',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200'
                };
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'MMM dd, yyyy');
        } catch (e) {
            return dateString;
        }
    };

    const isUpcoming = (startDate) => {
        try {
            const today = new Date();
            const start = new Date(startDate);
            return start >= today;
        } catch (e) {
            return false;
        }
    };

    const isPast = (endDate) => {
        try {
            const today = new Date();
            const end = new Date(endDate);
            return end < today;
        } catch (e) {
            return false;
        }
    };

    // Client-side filtering based on tab selection
    // Note: Ideally, this filtering would be done on the server side
    const filteredReservations = reservations.filter(reservation => {
        if (activeTab === 'all') return true;
        if (activeTab === 'upcoming') return isUpcoming(reservation.startDate);
        if (activeTab === 'past') return isPast(reservation.endDate);
        if (activeTab === 'confirmed') return reservation.status === 'CONFIRMED';
        if (activeTab === 'pending') return reservation.status === 'PENDING';
        if (activeTab === 'paid') return reservation.status === 'PAID';
        return true;
    });

    const calculateDaysUntil = (startDate) => {
        try {
            const today = new Date();
            const start = new Date(startDate);
            const diffTime = Math.abs(start - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch (e) {
            return null;
        }
    };

    const openReview = (guideId) => {
        console.log(guideId)
        navigate(`/guide/review/${guideId}`, {
            state: {backgroundLocation: {pathname: location.pathname}},
        });
    }

    return (
        <TouristLayout>
            <div className='w-full dark:bg-gray-900'>
                <div className="max-w-6xl mx-auto p-4 py-20 dark:bg-gray-900">
                    <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">My Travel reservations</h1>
                    <p className="text-gray-600 mb-6 dark:text-gray-300">View and manage all your upcoming and past
                        travel experiences</p>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex items-center">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500"/>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Search your reservations..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                        <nav className="flex -mb-px space-x-8 overflow-x-auto">
                            <button
                                onClick={() => handleTabChange('all')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'all'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                                All reservations
                            </button>
                            <button
                                onClick={() => handleTabChange('upcoming')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'upcoming'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => handleTabChange('past')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'past'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                                Past
                            </button>
                            <button
                                onClick={() => handleTabChange('confirmed')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'confirmed'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                                Confirmed
                            </button>
                            <button
                                onClick={() => handleTabChange('pending')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'pending'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => handleTabChange('paid')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'paid'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                                Paid
                            </button>
                        </nav>
                    </div>

                    {/* Loading and Error States */}
                    {loading && (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin"/>
                            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading your reservations...</span>
                        </div>
                    )}

                    {error && !loading && (
                        <div
                            className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-700 p-4 mb-4">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500"/>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Unable to load
                                        your reservations</h3>
                                    <div className="mt-1 text-sm text-red-700 dark:text-red-300">Please try again later
                                        or contact support.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reservations List */}
                    {!loading && !error && (
                        <>
                            {/* Results counter */}
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Showing {filteredReservations.length} of {totalElements} reservations
                            </div>

                            {filteredReservations.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Camera className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4"/>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No
                                        reservations found</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        {keyword ? `No results found for "${keyword}"` :
                                            activeTab === 'all'
                                                ? "You haven't made any reservations yet."
                                                : `You don't have any ${activeTab} reservations.`}
                                    </p>
                                    <div className="space-x-4">
                                        {keyword && (
                                            <button
                                                onClick={() => {
                                                    setKeyword('');
                                                    fetchReservations('', 0, size);
                                                }}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                        <button
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Explore Destinations
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ul className="space-y-6">
                                        {filteredReservations.map(reservation => {
                                            const statusDetails = getStatusDetails(reservation.status);
                                            const daysUntil = calculateDaysUntil(reservation.startDate);
                                            const isUpcomingTrip = isUpcoming(reservation.startDate);

                                            return (
                                                <li key={reservation.id}>
                                                    <div
                                                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border ${statusDetails.borderColor}`}>
                                                        <div className="px-6 py-5">
                                                            {/* Status Bar */}
                                                            <div
                                                                className={`flex items-center p-2 mb-4 rounded-md ${statusDetails.bgColor}`}>
                                                                <div className={`${statusDetails.color} mr-2`}>
                                                                    {statusDetails.icon}
                                                                </div>
                                                                <div>
                                                                    <span
                                                                        className={`font-medium ${statusDetails.color}`}>{statusDetails.label}</span>
                                                                    <span
                                                                        className="text-gray-500 dark:text-gray-400 text-sm ml-2">{statusDetails.description}</span>
                                                                </div>

                                                                {isUpcomingTrip && daysUntil !== null && (
                                                                    <div
                                                                        className="ml-auto bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                                                                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days away`}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Main Content */}
                                                            <div className="flex flex-col md:flex-row">
                                                                {/* Left: Image Placeholder */}
                                                                <div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
                                                                    <div
                                                                        className="bg-gray-200 dark:bg-gray-700 rounded-lg h-40 flex items-center justify-center">
                                                                        <Camera
                                                                            className="h-8 w-8 text-gray-400 dark:text-gray-500"/>
                                                                    </div>
                                                                </div>

                                                                {/* Right: Details */}
                                                                <div className="w-full md:w-2/3">
                                                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                                                        {reservation.viewResponseDto.name}
                                                                    </h2>

                                                                    <div className="flex items-start mb-3">
                                                                        <Map
                                                                            className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2 mt-0.5"/>
                                                                        <span
                                                                            className="text-gray-600 dark:text-gray-300">
                                                                    {reservation.viewResponseDto.location || 'Location details not available'}
                                                                </span>
                                                                    </div>

                                                                    <div
                                                                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                                        <div className="flex items-center">
                                                                            <Calendar
                                                                                className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2"/>
                                                                            <div>
                                                                                <div
                                                                                    className="text-sm text-gray-500 dark:text-gray-400">Check-in
                                                                                </div>
                                                                                <div
                                                                                    className="font-medium dark:text-gray-100">{formatDate(reservation.startDate)}</div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center">
                                                                            <Calendar
                                                                                className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2"/>
                                                                            <div>
                                                                                <div
                                                                                    className="text-sm text-gray-500 dark:text-gray-400">Check-out
                                                                                </div>
                                                                                <div
                                                                                    className="font-medium dark:text-gray-100">{formatDate(reservation.endDate)}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                                        reserved on {formatDate(reservation.createdAt)}
                                                                    </div>

                                                                    <div className="flex flex-wrap gap-2">
                                                                        <Link
                                                                            to={`/tourist/reservations/${reservation.id}/`}
                                                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                        >
                                                                            View Details
                                                                        </Link>

                                                                        {reservation.status === 'CONFIRMED' && isUpcomingTrip && (
                                                                            <Link
                                                                                to={`/tourist/reservations/${reservation.id}/`}
                                                                                >
                                                                            <button
                                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                            >
                                                                                Make Payment
                                                                            </button>
                                                                            </Link>
                                                                        )}

                                                                        {reservation.status === 'PENDING' && (
                                                                            <Link
                                                                                to={`/tourist/reservations/cancel/${reservation.id}/`}
                                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                                            >
                                                                                Cancel Request
                                                                            </Link>
                                                                        )}

                                                                        {isPast(reservation.endDate) && reservation.status === 'CONFIRMED' && (
                                                                            <button
                                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                                                onClick={() => setIsReviewPopUp(true)}
                                                                            >
                                                                                Complete & Write Review
                                                                            </button>
                                                                        )}
                                                                        {isReviewPopUp && <ReviewPopup onClose={() => setIsReviewPopUp(false)} id={reservation.viewResponseDto.guideId}/>}

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* Pagination */}
                                    <div className="flex justify-between items-center mt-6">
                                        <button
                                            onClick={() => {
                                                if (page > 0) {
                                                    const newPage = page - 1;
                                                    setPage(newPage);
                                                    fetchReservations(keyword, newPage, size);
                                                }
                                            }}
                                            disabled={page === 0}
                                            className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                                                page === 0 ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Previous
                                        </button>

                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            Page {page + 1} of {totalPages || 1}
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (page + 1 < totalPages) {
                                                    const newPage = page + 1;
                                                    setPage(newPage);
                                                    fetchReservations(keyword, newPage, size);
                                                }
                                            }}
                                            disabled={page + 1 >= totalPages}
                                            className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                                                page + 1 >= totalPages ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </TouristLayout>
    );
};

export default TouristReservationList;
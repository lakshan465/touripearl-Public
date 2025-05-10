import {useState, useEffect} from "react";
import axiosFetch from "../../utils/axiosFetch";
import {Link} from "react-router-dom";
import TouristLayout from "../user-layouts/TouristLayout.jsx";

export default function TouristBookingsList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchBookings();
    }, [page, size]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await axiosFetch.get("/api/v1/booking/allBookings/tourist", {
                params: {
                    page: page,
                    size: size
                }
            });
            console.log(response)
            if (response.data && response.data.object) {
                setBookings(response.data.object.content);
                setTotalPages(response.data.object.page.totalPages);
            } else {
                setBookings([]);
                setTotalPages(0);
            }
            setError(null);
        } catch (err) {
            setError("Failed to fetch bookings. Please try again later.");
            console.error("Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <TouristLayout>
        <div className="w-full max-w-full mx-auto p-4 py-20 bg-gray-600">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">{error}</div>
            ) : bookings.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-md text-center">
                    <p className="text-gray-600">No bookings found.</p>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="mt-4 flex items-center">
                        <label htmlFor="page-size" className="p-4 mr-2 text-sm text-gray-700">Bookings per page:</label>
                        <select
                            id="page-size"
                            value={size}
                            onChange={(e) => {
                                setSize(Number(e.target.value));
                                setPage(0);
                            }}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {bookings.map((booking, index) => (
                            <div key={index} className="p-6 hover:bg-gray-50">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-medium">
                                                {booking.customTourResponseDto ?
                                                    `Custom Tour (${booking.customTourResponseDto.name})` :
                                                    `Property Booking (ID: ${booking.propertyId})`
                                                }
                                            </h3>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                                        </div>

                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>
                                                <span className="font-medium">Duration:</span>{" "}
                                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                            </p>

                                            {booking.reservationResponseDto && (
                                                <p>
                                                    <span className="font-medium">Reservation:</span>{" "}
                                                    {booking.reservationResponseDto.id}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Link to={`/tourist/booking-list/${booking.propertyId}`}>
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                disabled={page >= totalPages - 1}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{page + 1}</span> of{" "}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                     aria-label="Pagination">
                                    <button
                                        onClick={() => setPage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>

                                    {[...Array(Math.min(5, totalPages)).keys()].map((i) => {
                                        const pageNumber = i + Math.max(0, Math.min(page - 2, totalPages - 5));
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setPage(pageNumber)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    page === pageNumber
                                                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                }`}
                                            >
                                                {pageNumber + 1}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                        disabled={page >= totalPages - 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
        </TouristLayout>
    );
}
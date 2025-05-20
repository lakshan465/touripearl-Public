import {useParams, useNavigate, Link} from "react-router-dom";
import { useState } from "react";
import axiosFetch from "../../utils/axiosFetch.js";

const BookingCancel = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Create booking cancel request object matching backend DTO
            const cancelRequest = {
                bookingId: bookingId,
                reason: reason
            };

            // Send cancel request to the backend
            await axiosFetch.post("/api/v1/booking/cancel", cancelRequest);
            setSuccess(true);
            setTimeout(() => {
                navigate("/tourist/booking-list");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to cancel booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto my-10 p-6 bg-green-50 rounded-lg shadow">
                <h2 className="text-xl font-bold text-green-700 mb-4">Booking Cancelled Successfully!</h2>
                <p className="mb-4">Your booking has been cancelled.</p>
                <p>Redirecting to bookings page...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Cancel Booking #{bookingId}</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="reason">
                        Cancellation Reason
                    </label>
                    <textarea
                        id="reason"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        rows="4"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        placeholder="Please provide a reason for cancelling this booking"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Link
                        to='/tourist/booking-list'
                        >
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"

                    >
                        Go Back
                    </button>
                    </Link>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                        disabled={isSubmitting || !reason.trim()}
                    >
                        {isSubmitting ? "Cancelling..." : "Cancel Booking"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingCancel;
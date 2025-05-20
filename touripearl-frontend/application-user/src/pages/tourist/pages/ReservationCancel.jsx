import React, { useState, useEffect } from 'react';
import axiosFetch from '../../../utils/axiosFetch';
import TouristLayout from '../../../components/user-layouts/TouristLayout';
import { AlertTriangle, CheckCircle, Info, Loader2, XCircle, ArrowLeft, Clock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ReservationCancel = () => {
    const { id: reservationId } = useParams();
    const navigate = useNavigate();
    const [cancellationReason, setCancellationReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reservationDetails, setReservationDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        fetchReservationDetails();
        setShowConfirmation(false);
    }, [reservationId]);

    const fetchReservationDetails = async () => {
        setLoading(true);
        try {
            const response = await axiosFetch.get(`/api/reservations/${reservationId}`);
            setReservationDetails(response.data);
        } catch (error) {
            toast.error('Unable to find this reservation. Please check the ID and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (e) => {
        e.preventDefault();

        if (!showConfirmation) {
            setShowConfirmation(true);
            return;
        }

        setIsSubmitting(true);
        try {
            await axiosFetch.put(`/api/reservations/${reservationId}`, {
                cancellationReason,
                status: 'CANCELLED'
            });
            toast.success('Your reservation has been successfully cancelled.');
            setCancellationReason('');
            setReservationDetails(null);
            setShowConfirmation(false);
            navigate('/tourist/reservations/');
        } catch (error) {
            toast.error('We encountered an issue while cancelling your reservation. Please try again or contact customer support.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <TouristLayout>
            <div className='w-full dark:bg-gray-800'>
            <div className="max-w-4xl mx-auto px-4 py-20 dark:bg-gray-800">
                <div className="mb-4">
                    <button onClick={handleGoBack} className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} className="mr-1" />
                        <span>Back to My Bookings</span>
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                    <div className="bg-blue-600 dark:bg-blue-800 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold flex items-center">
                            <XCircle className="mr-2" size={24} />
                            Cancel Your Reservation
                        </h1>
                        <p className="mt-1 opacity-90">We're sorry to see your plans change</p>
                    </div>

                    <div className="p-6">
                        {reservationDetails && (
                            console.log(reservationDetails),
                            <form onSubmit={handleCancelReservation}>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                                            <Clock className="mr-2 text-blue-600 dark:text-blue-400" size={20} /> Tell Us Why You're Cancelling
                                        </h2>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Create Date: {reservationDetails.createdAt}</span>
                                        <textarea
                                            rows="4"
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                            placeholder="Please let us know why you need to cancel."
                                            value={cancellationReason}
                                            onChange={(e) => setCancellationReason(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {showConfirmation && (
                                        <div className="bg-red-50 dark:bg-red-900 p-5 rounded-lg border border-red-200 dark:border-red-700 animate-fadeIn">
                                            <div className="flex items-start">
                                                <AlertTriangle className="text-red-500 dark:text-red-400 mt-1 mr-3" size={24} />
                                                <div>
                                                    <h3 className="font-medium text-red-800 dark:text-red-300">Confirm Cancellation</h3>
                                                    <p className="mt-2 text-red-700 dark:text-red-400">Are you sure you want to cancel this reservation? This action cannot be undone.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !cancellationReason.trim()}
                                            className={`px-6 py-2.5 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400 dark:bg-gray-600' : showConfirmation ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'}`}
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : showConfirmation ? 'Confirm Cancellation' : 'Cancel My Reservation'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </TouristLayout>
    );
};

export default ReservationCancel;
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, CheckCircle, XCircle, Flag, Award } from 'lucide-react';
import axiosFetch from "../../../../../utils/axiosFetch.js";

const BookingStat = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingMetrics = async () => {
            try {
                setLoading(true);
                const response = await axiosFetch.get('/api/v1/dashboard/guide/bookings-metrics');
                setMetrics(response.data.object);
                setLoading(false);
            } catch (err) {
                setError('Failed to load booking metrics');
                setLoading(false);
                console.error('Error fetching booking metrics:', err);
            }
        };

        fetchBookingMetrics();
    }, []);

    // Format data for recharts
    const prepareChartData = (metricsData) => {
        if (!metricsData) return [];

        return [
            {
                name: 'Bookings',
                CONFIRMED: metricsData.CONFIRMED || 0,
                CANCELLED: metricsData.CANCELLED || 0,
                COMPLETED: metricsData.COMPLETED || 0,
                IN_DISPUTE: metricsData.IN_DISPUTE || 0,
            }
        ];
    };

    const renderMetricCard = (title, value, icon, color, bgColor) => (
        <div className={`${bgColor} p-4 rounded-lg shadow flex items-center space-x-4`}>
            <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="mt-2 text-gray-600">Loading booking metrics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-600">{error}</p>
                <button
                    className="mt-2 text-sm text-red-700 underline"
                    onClick={() => window.location.reload()}
                >
                    Try again
                </button>
            </div>
        );
    }

    const chartData = prepareChartData(metrics);
    const totalBookings = metrics ?
        (metrics.CONFIRMED || 0) + (metrics.CANCELLED || 0) + (metrics.COMPLETED || 0) + (metrics.IN_DISPUTE || 0) : 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Booking Metrics</h1>
                <div className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-sm font-medium">
                    Total Bookings: {totalBookings}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderMetricCard(
                    "Confirmed",
                    metrics?.CONFIRMED || 0,
                    <CheckCircle size={18} className="text-green-600" />,
                    "text-green-600",
                    "bg-white"
                )}
                {renderMetricCard(
                    "Cancelled",
                    metrics?.CANCELLED || 0,
                    <XCircle size={18} className="text-red-600" />,
                    "text-red-600",
                    "bg-white"
                )}
                {renderMetricCard(
                    "Completed",
                    metrics?.COMPLETED || 0,
                    <Award size={18} className="text-blue-600" />,
                    "text-blue-600",
                    "bg-white"
                )}
                {renderMetricCard(
                    "In Dispute",
                    metrics?.IN_DISPUTE || 0,
                    <Flag size={18} className="text-amber-600" />,
                    "text-amber-600",
                    "bg-white"
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 h-72">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Booking Status Distribution</h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="CONFIRMED" name="Confirmed" fill="#22c55e" />
                            <Bar dataKey="CANCELLED" name="Cancelled" fill="#ef4444" />
                            <Bar dataKey="COMPLETED" name="Completed" fill="#3b82f6" />
                            <Bar dataKey="IN_DISPUTE" name="In Dispute" fill="#f59e0b" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No booking data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingStat;
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader2, Calendar, CheckCheck, CreditCard, XCircle, Clock } from 'lucide-react';
import axiosFetch from "../../../../../utils/axiosFetch.js";

const ReservationStat = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axiosFetch.get('api/v1/dashboard/guide/tours-metrics');
                setStats(response.data.object);
                setLoading(false);
            } catch (err) {
                setError('Failed to load reservation statistics');
                setLoading(false);
                console.error('Error fetching stats:', err);
            }
        };

        fetchStats();
    }, []);

    // Colors for the pie chart
    const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#6366f1'];

    // Format data for recharts
    const prepareChartData = (statsData) => {
        if (!statsData) return [];

        return [
            { name: 'Pending', value: statsData.PENDING, icon: <Clock size={18} /> },
            { name: 'Confirmed', value: statsData.CONFIRMED, icon: <CheckCheck size={18} /> },
            { name: 'Paid', value: statsData.PAID, icon: <CreditCard size={18} /> },
            { name: 'Cancelled', value: statsData.CANCELLED, icon: <XCircle size={18} /> }
        ].filter(item => item.value > 0);
    };

    const renderStatCard = (title, value, icon, color) => (
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
            <div className={`p-3 rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="text-2xl text-gray-700 font-bold">{value}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="mt-2 text-gray-600">Loading reservation statistics...</p>
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

    const chartData = prepareChartData(stats);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Reservation Statistics</h1>
                <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Total: {stats?.ALL || 0} reservations</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderStatCard("Pending", stats?.PENDING || 0, <Clock size={18} className="text-white" />, "bg-blue-500")}
                {renderStatCard("Confirmed", stats?.CONFIRMED || 0, <CheckCheck size={18} className="text-white" />, "bg-green-500")}
                {renderStatCard("Paid", stats?.PAID || 0, <CreditCard size={18} className="text-white" />, "bg-amber-500")}
                {renderStatCard("Cancelled", stats?.CANCELLED || 0, <XCircle size={18} className="text-white" />, "bg-red-500")}
            </div>

            <div className="bg-white rounded-lg shadow p-4 h-64">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Reservation Distribution</h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} reservations`, 'Count']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No reservation data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservationStat;
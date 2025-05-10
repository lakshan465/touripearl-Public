import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axiosFetch from '../../../../../utils/axiosFetch';

const EventStatsChart = () => {
    const [eventCounts, setEventCounts] = useState({
        UPCOMING: 0,
        PAST: 0,
        ALL: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventCounts = async () => {
            setLoading(true);
            try {
                const response = await axiosFetch.get('/api/v1/dashboard/admin/events/counts');
                if (response.status === 200 && response.data.code === 200) {
                    setEventCounts(response.data.object);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event counts:', error);
                setError('Failed to load event data');
                setLoading(false);
            }
        };

        fetchEventCounts();
    }, []);

    if (loading) {
        return (
            <div className="p-4 bg-white dark:bg-primary rounded-xl shadow-md">
                <div className="text-center text-gray-500 dark:text-gray-400">Loading event data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-white dark:bg-primary rounded-xl shadow-md">
                <div className="text-center text-red-500 dark:text-red-400">{error}</div>
            </div>
        );
    }

    const total = eventCounts.ALL;
    const pieData = [
        { name: 'Upcoming', value: eventCounts.UPCOMING },
        { name: 'Past', value: eventCounts.PAST }
    ];

    const COLORS = ['#EAB308', '#EF4444'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-primary p-2 border dark:border-secondary rounded shadow">
                    <p className="text-sm text-gray-900 dark:text-light">{`${payload[0].name}: ${payload[0].value}`}</p>
                    <p className="text-sm text-gray-900 dark:text-light">{`(${Math.round((payload[0].value / total) * 100)}%)`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-4 bg-white dark:bg-primary rounded-xl shadow-md">
            <h2 className="text-xl font-bold dark:text-light mb-4">Event Status Statistics</h2>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EventStatsChart;
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import axiosFetch from "../../../../../utils/axiosFetch";

const ActiveGuideStatsChart = () => {
    const [activeGuideData, setActiveGuideData] = useState({
        now: 0,
        fiveMin: 0,
        hour: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setLoading(true);
        axiosFetch.get("/api/v1/dashboard/admin/guides/active")
            .then((response) => {
                setActiveGuideData({
                    now: response.data.object.nowTime,
                    fiveMin: response.data.object.fiveMin,
                    hour: response.data.object.hour
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError("Failed to load activeGuide data");
                setLoading(false);
            });
    }, []);

    const SimpleMetricBox = ({ label, value }) => (
        <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-sm border dark:border-secondary">
            <h3 className="text-sm text-gray-600 dark:text-light">{label}</h3>
            <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-light">{value.toLocaleString()}</span>
            </div>
        </div>
    );

    const DetailedMetricBox = ({ label,total }) => {

        return (
            <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-sm border dark:border-secondary">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm text-gray-600 dark:text-light">{label}</h3>
                </div>
                <div className="text-sm text-gray-500 dark:text-light mt-1">
                    Total: {total.toLocaleString()}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-4 bg-white dark:bg-primary rounded-xl shadow-md">
                <div className="text-center text-gray-500 dark:text-gray-400">Loading activeGuide data...</div>
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

    const chartData = [
        {
            name: 'Now',
            value: activeGuideData.now,
        },
        {
            name: 'Last 5 Minutes',
            value: activeGuideData.fiveMin,
        },
        {
            name: 'Last Hour',
            value: activeGuideData.hour,
        }
    ];

    return (
        <>
            {/* Simple View */}
            <div className="p-4 bg-white dark:bg-primary rounded-xl shadow-md space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-light">Active Guides</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight"
                    >
                        See More
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SimpleMetricBox label="Now" value={activeGuideData.now} />
                    <SimpleMetricBox label="Last 5 Minutes" value={activeGuideData.fiveMin} />
                    <SimpleMetricBox label="Last Hour" value={activeGuideData.hour} />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-primary rounded-xl p-6 w-11/12 max-w-4xl max-h-90vh overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-light">Detailed Active Guide Statistics</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-red-500 dark:text-red-400 hover:animate-pulse text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <DetailedMetricBox
                                label="Now"
                                total={activeGuideData.now}
                            />
                            <DetailedMetricBox
                                label="Last 5 Minutes"
                                total={activeGuideData.fiveMin}
                            />
                            <DetailedMetricBox
                                label="Last Hour"
                                total={activeGuideData.hour}
                            />
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActiveGuideStatsChart;
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import axiosFetch from "../../../../../utils/axiosFetch";

const SignupStatsChart = () => {
  const [signupData, setSignupData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosFetch.get("/api/v1/dashboard/admin/user/signups")
        .then((response) => {
          setSignupData({
            daily: response.data.object.daily,
            weekly: response.data.object.weekly,
            monthly: response.data.object.monthly
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError("Failed to load signup data");
          setLoading(false);
        });
  }, []);

  const SimpleMetricBox = ({ label, value }) => (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-secondary dark:border-gray-700">
        <h3 className="text-sm text-secondary dark:text-gray-400">{label}</h3>
        <div className="mt-2">
          <span className="text-2xl font-bold text-primary dark:text-gray-100">{value.toLocaleString()}</span>
        </div>
      </div>
  );

  const DetailedMetricBox = ({ label, value, average, total }) => {
    const trend = value >= average ? 'up' : 'down';

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-secondary dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-secondary dark:text-gray-400">{label}</h3>
            {trend === 'up' ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 animate-bounce" />
            ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 animate-bounce" />
            )}
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-primary dark:text-gray-100">{value}</span>
            <span className="text-sm text-secondary dark:text-gray-400 ml-2">per day</span>
          </div>
          <div className="text-sm text-secondary dark:text-gray-400 mt-1">
            Total: {total.toLocaleString()}
          </div>
        </div>
    );
  };

  if (loading) {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-center text-secondary dark:text-gray-400">Loading signup data...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-center text-red-500 dark:text-red-400">{error}</div>
        </div>
    );
  }

  const chartData = [
    {
      name: 'Daily',
      value: signupData.daily,
    },
    {
      name: 'Weekly',
      value: Math.round(signupData.weekly / 7),
    },
    {
      name: 'Monthly',
      value: Math.round(signupData.monthly / 30),
    }
  ];

  return (
      <>
        {/* Simple View */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary dark:text-gray-100">User Signups</h2>
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight/90"
            >
              See More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SimpleMetricBox label="Daily Signups" value={signupData.daily} />
            <SimpleMetricBox label="Weekly Signups" value={signupData.weekly} />
            <SimpleMetricBox label="Monthly Signups" value={signupData.monthly} />
          </div>
        </div>

        {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-11/12 max-w-4xl max-h-90vh overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary dark:text-gray-100">Detailed Signup Statistics</h2>
                  <button
                      onClick={() => setShowModal(false)}
                      className="text-secondary dark:text-gray-400 hover:animate-pulse text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <DetailedMetricBox
                      label="Daily Signups"
                      value={signupData.daily}
                      average={signupData.weekly / 7}
                      total={signupData.daily}
                  />
                  <DetailedMetricBox
                      label="Weekly Average"
                      value={Math.round(signupData.weekly / 7)}
                      average={signupData.monthly / 30}
                      total={signupData.weekly}
                  />
                  <DetailedMetricBox
                      label="Monthly Average"
                      value={Math.round(signupData.monthly / 30)}
                      average={signupData.monthly / 30}
                      total={signupData.monthly}
                  />
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6998AB" radius={[4, 4, 0, 0]} /> {/* Using 'accent' color from theme */}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default SignupStatsChart;
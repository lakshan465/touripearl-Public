import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axiosFetch from '../../../../../utils/axiosFetch';

const UserVerifyStatsChart = () => {
  const [verifyCounts, setVerifyCounts] = useState({
    VERIFIED: 0,
    NON_VERIFIED: 0,
    ALL: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerifyCounts = async () => {
      setLoading(true);
      try {
        const response = await axiosFetch.get('/api/v1/dashboard/admin/user/verified');
        if (response.status === 200 && response.data.code === 200) {
          setVerifyCounts(response.data.object);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching verify counts:', error);
        setError('Failed to load verification data');
        setLoading(false);
      }
    };

    fetchVerifyCounts();
  }, []);

  if (loading) {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-center text-secondary dark:text-gray-400">Loading verification data...</div>
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

  const total = verifyCounts.VERIFIED + verifyCounts.NON_VERIFIED;
  const pieData = [
    { name: 'Verified', value: verifyCounts.VERIFIED },
    { name: 'Non-Verified', value: verifyCounts.NON_VERIFIED },
  ];

  // Using custom colors from Tailwind config
  const COLORS = ['#6998AB', '#9A55F3']; // Primary for verified, Highlight for non-verified

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
          <div className="bg-white dark:bg-gray-800 p-2 border border-secondary dark:border-gray-700 rounded shadow">
            <p className="text-sm text-secondary dark:text-gray-100">{`${payload[0].name}: ${payload[0].value}`}</p>
            <p className="text-sm text-secondary dark:text-gray-100">{`(${Math.round((payload[0].value / total) * 100)}%)`}</p>
          </div>
      );
    }
    return null;
  };

  return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-4">User Verification Statistics</h2>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
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

export default UserVerifyStatsChart;
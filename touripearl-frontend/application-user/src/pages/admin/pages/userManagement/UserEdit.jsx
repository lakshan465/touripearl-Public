import React, { useState, useEffect } from 'react';
import Loader from '../../../../components/loader/Loader';
import Dashboard from '../../dashboard/Dashboard';
import axiosFetch from '../../../../utils/axiosFetch';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserEdit = () => {
    const { userId } = useParams();
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await axiosFetch.get(`/api/v1/users/${userId}`);
                const initialData = response.data.object;
                setFormData({
                    isEnabled: initialData.enabled,
                    isCredentialsNonExpired: initialData.credentialsNonExpired,
                    isAccountNonLocked: initialData.accountNonLocked,
                    isAccountNonExpired: initialData.accountNonExpired
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.promise(
            async () => {
                setIsLoading(true);
                const response = await axiosFetch.put(`/api/v1/users/${userId}`, formData);
                if (response && response.data.code === 201) {
                    navigate(`/admin/user-management/${userId}`);
                }
            },
            {
                loading: 'Updating user...',
                success: 'User updated successfully',
                error: error => `Error updating user: ${error.message}`
            }
        );
        setIsLoading(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.checked
        }));
    };

    return (
        <Dashboard title="User Update">
            {isLoading ? <Loader /> : (
                <div className="p-4 border border-secondary rounded-lg bg-white dark:bg-gray-800 max-w-lg mx-auto">
                    <h2 className="text-xl font-bold mb-4 text-primary dark:text-white">Update User Status</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {Object.entries(formData).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-secondary dark:text-gray-300">
                                <label htmlFor={key} className="cursor-pointer">
                                    {key.replace(/([A-Z])/g, ' $1').replace('is', '').trim()}
                                </label>
                                <input
                                    type="checkbox"
                                    id={key}
                                    name={key}
                                    checked={value}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-highlight cursor-pointer focus:ring-2 focus:ring-highlight"
                                />
                            </div>
                        ))}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-highlight text-white py-2 px-4 rounded hover:bg-highlight/90 transition-colors"
                        >
                            Update User
                        </button>
                    </form>
                </div>
            )}
        </Dashboard>
    );
};

export default UserEdit;
import React, {useState} from 'react';
import {Loader2, Trash2, Plus} from 'lucide-react';
import axiosFetch from '../../utils/axiosFetch';
import {jsPDF} from "jspdf";

const AddDestinationForm = () => {
    const [formData, setFormData] = useState({
        destinationName: '',
        shortDescription: '',
        fullDescription: '',
        location: '',
        bestTimeToVisit: '',
        isActive: true
    });

    const [mainImage, setMainImage] = useState(null);
    const [subImages, setSubImages] = useState([]);
    const [activities, setActivities] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMainImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setMainImage(e.target.files[0]);
        } else {
            setError('Please select a valid file');
        }
    };

    const handleSubImagesChange = (e) => {
        if (e.target.files) {
            setSubImages(Array.from(e.target.files));
        }
    };

    const handleActivityChange = (index, field, value) => {
        setActivities(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value
            };
            return updated;
        });
    };

    const handleActivityImageChange = (index, e) => {
        if (e.target.files[0]) {
            handleActivityChange(index, 'activityImage', e.target.files[0]);
        }
    };

    const addActivity = () => {
        setActivities(prev => [...prev, {
            activityName: '',
            activityImage: null
        }]);
    };

    const removeActivity = (index) => {
        setActivities(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setFormData({
            destinationName: '',
            shortDescription: '',
            fullDescription: '',
            location: '',
            bestTimeToVisit: '',
            isActive: true
        });
        setMainImage(null);
        setSubImages([]);
        setActivities([]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Validate activities
        if (activities.some(activity => !activity.activityName || !activity.activityImage)) {
            setError('Please fill in all activity fields and include images');
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            if (!mainImage) {
                setError('Main image is required');
                setIsSubmitting(false);
                return;
            }

            // Validate activity images
            for (let i = 0; i < activities.length; i++) {
                if (!activities[i].activityImage) {
                    setError(`Image for Activity ${i + 1} is required`);
                    setIsSubmitting(false);
                    return;
                }
            }
            // Add main image
            if (mainImage) {
                formDataToSend.append('mainImage', mainImage);
            }

            // Add sub images
            subImages.forEach(image => {
                formDataToSend.append('subImages', image);
            });

            // Add destination data
            const destinationData = {
                ...formData,
                activities: activities.map(activity => ({
                    activityName: activity.activityName,
                }))
            };

            formDataToSend.append('body', new Blob([JSON.stringify(destinationData)], {
                type: 'application/json'
            }));

            // Add activity images separately
            activities.forEach((activity, index) => {
                if (activity.activityImage) {
                    formDataToSend.append('activityImages', activity.activityImage);
                }
            });
            const response = await axiosFetch.post('/api/v1/destinations', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.code === 201) {
                setSuccess(true);
                resetForm();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred while adding the destination';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="relative">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"></div>

                <div className="fixed inset-0 flex items-center justify-center z-20">
                    <div className="max-w-5xl mx-auto bg-light dark:bg-gray-900 rounded-lg shadow-lg p-6">
                        <div className="text-center">
                            <h2 className="mb-4 text-2xl font-bold text-primary dark:text-white">
                                Destination Added Successfully!
                            </h2>
                            <button
                                onClick={() => setSuccess(false)}
                                className="px-6 py-2 text-white bg-highlight rounded-lg hover:bg-highlight/90 transition-colors"
                            >
                                Add Another Destination
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary">
            <form onSubmit={handleSubmit}
                  className="max-w-4xl p-6 mx-auto bg-light dark:bg-gray-900 rounded-lg shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-primary dark:text-white">Add New Destination</h2>

                {/* Basic Information */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                                Destination Name
                            </label>
                            <input
                                type="text"
                                name="destinationName"
                                value={formData.destinationName}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-secondary rounded-lg bg-white dark:bg-gray-800 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-secondary rounded-lg bg-white dark:bg-gray-800 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                                Short Description
                            </label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                className="w-full h-24 p-3 border border-secondary rounded-lg bg-white dark:bg-gray-800 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                                Full Description
                            </label>
                            <textarea
                                name="fullDescription"
                                value={formData.fullDescription}
                                onChange={handleInputChange}
                                className="w-full h-32 p-3 border border-secondary rounded-lg bg-white dark:bg-gray-800 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                                Main Image
                            </label>
                            <input
                                type="file"
                                onChange={handleMainImageChange}
                                accept="image/*"
                                className="w-full p-3 border border-secondary rounded-lg bg-white dark:bg-gray-800 text-secondary dark:text-gray-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                                Sub Images
                            </label>
                            <input
                                type="file"
                                onChange={handleSubImagesChange}
                                accept="image/*"
                                multiple
                                className="w-full p-3 border border-secondary rounded-lg bg-white dark:bg-gray-800 text-secondary dark:text-gray-200"
                            />
                        </div>
                    </div>

                    {/* Activities */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-lg font-medium text-primary dark:text-white">Activities</label>
                            <button
                                type="button"
                                onClick={addActivity}
                                className="flex items-center px-4 py-2 text-white bg-highlight rounded-lg hover:bg-highlight/90"
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                Add Activity
                            </button>
                        </div>

                        {activities.map((activity, index) => (
                            <div key={index}
                                 className="p-4 border border-secondary rounded-lg bg-white dark:bg-gray-800">
                                <div className="flex justify-between mb-4">
                                    <h3 className="text-lg font-medium text-primary dark:text-white">Activity {index + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeActivity(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5"/>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={activity.activityName}
                                        onChange={(e) => handleActivityChange(index, 'activityName', e.target.value)}
                                        placeholder="Activity Name"
                                        className="w-full p-3 border border-secondary rounded-lg bg-white dark:bg-gray-800 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
                                        required
                                    />
                                    <input
                                        type="file"
                                        onChange={(e) => handleActivityImageChange(index, e)}
                                        accept="image/*"
                                        className="w-full p-3 border border-secondary rounded-lg bg-white dark:bg-gray-800 text-secondary dark:text-gray-200"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                            Best Time to Visit
                        </label>
                        <input
                            type="text"
                            name="bestTimeToVisit"
                            value={formData.bestTimeToVisit}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-secondary rounded-lg bg-white dark:bg-gray-800 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col space-y-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center py-3 text-white bg-highlight rounded-lg hover:bg-highlight/90 disabled:bg-highlight/50 transition-colors"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-white"/>
                                    Creating Destination...
                                </>
                            ) : (
                                'Add Destination'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={isSubmitting}
                            className="py-3 text-secondary dark:text-gray-200 bg-gray-800 dark:bg-accent rounded-lg hover:bg-gray-800/75 dark:hover:bg-accent/75 transition-colors"
                        >
                            Reset Form
                        </button>
                    </div>
                </div>

                {isSubmitting && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="p-6 bg-light dark:bg-gray-900 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-3">
                                <Loader2 className="w-6 h-6 text-accent animate-spin"/>
                                <span className="text-lg font-medium text-primary dark:text-white">Creating Destination...</span>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>

    );
};

export default AddDestinationForm;
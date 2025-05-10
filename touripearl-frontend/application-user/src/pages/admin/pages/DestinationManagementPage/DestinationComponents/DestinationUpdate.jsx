import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, Plus } from 'lucide-react';
import axiosFetch from '../../../../../utils/axiosFetch';
import { useParams } from 'react-router-dom';
import Dashboard from '../../../dashboard/Dashboard';

const DestinationUpdate = () => {
    const [formData, setFormData] = useState({
        destinationName: '',
        shortDescription: '',
        fullDescription: '',
        location: '',
        bestTimeToVisit: '',
        isActive: true
    });
    
    const {destinationId} = useParams();
    const [mainImage, setMainImage] = useState(null);
    const [subImages, setSubImages] = useState([]);
    const [activities, setActivities] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData]=useState();
    const [isDeletingImage, setIsDeletingImage] = useState(false);
    
    const getDestination = async() => {
        const response = await axiosFetch.get(`/api/v1/destinations/${destinationId}`)
        console.log(response)
        setInitialData(response.data.object);
        // Initialize formData with initial values
        setFormData({
            destinationName: response.data.object.destinationName,
            shortDescription: response.data.object.shortDescription,
            fullDescription: response.data.object.fullDescription,
            location: response.data.object.location,
            bestTimeToVisit: response.data.object.bestTimeToVisit,
            isActive: response.data.object.active 
        });
    }

    useEffect(() => {
        getDestination();
    },[destinationId])
    
    const handleDeleteSubImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this sub image?')) {
            return;
        }

        setIsDeletingImage(true);
        try {
            await axiosFetch.delete(`/api/v1/destinations/${destinationId}/subimages/${imageId}`);
            
            // Update the local state to reflect the deletion
            setInitialData(prevData => ({
                ...prevData,
                allDestinationImages: prevData.allDestinationImages.filter(
                    img => img.destinationImageId !== imageId
                )
            }));
            setError('');
        } catch (error) {
            setError('Failed to delete sub image: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setIsDeletingImage(false);
        }
    };
    
    const handleDeleteMainImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this sub image?')) {
            return;
        }

        setIsDeletingImage(true);
        try {
            await axiosFetch.delete(`/api/v1/destinations/${destinationId}/mainimage/${imageId}`);
            
            // Update the local state to reflect the deletion
            setInitialData(prevData => ({
                ...prevData,
                allDestinationImages: prevData.allDestinationImages.filter(
                    img => img.destinationImageId !== imageId
                )
            }));
            setError('');
        } catch (error) {
            setError('Failed to delete sub image: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setIsDeletingImage(false);
        }
    };

    const handleDeleteActivity = async (activityName) => {
        if (!window.confirm(`Are you sure you want to delete the activity: ${activityName}?`)) {
            return;
        }
    
        try {
            await axiosFetch.delete(`/api/v1/destinations/${destinationId}/activities/${activityName}`);
            
            // Update the local state to reflect the deletion
            setInitialData(prevData => ({
                ...prevData,
                activities: prevData.activities.filter(
                    activity => activity.activityName !== activityName
                )
            }));
            setError('');
        } catch (error) {
            setError('Failed to delete activity: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = (e) => {
        const value = e.target.value; 
        console.log(value)
        setFormData(prev => ({
            ...prev,
            isActive: value
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

        

        try {
            const formDataToSend = new FormData();
            
            
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

            
            console.log(formData.isActive)
        // Combine formData with initial data for unchanged fields
        const destinationData = {
            destinationName: formData.destinationName || initialData.destinationName,
            shortDescription: formData.shortDescription || initialData.shortDescription,
            fullDescription: formData.fullDescription || initialData.fullDescription,
            location: formData.location || initialData.location,
            bestTimeToVisit: formData.bestTimeToVisit || initialData.bestTimeToVisit,
            active: formData.isActive || initialData.active,
            activities: [
                // Only add new activities if they exist
                ...activities.map(activity => ({
                    activityName: activity.activityName,
                }))
            ]
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
            const response = await axiosFetch.put(`/api/v1/destinations/${destinationId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(destinationData);
            if (response.data.code === 200) {
                setSuccess(true);
                resetForm();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred while updating the destination';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    {if (success) {
        return (
            <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow">
                <div className="text-center">
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">
                        Destination Updated Successfully!
                    </h2>
                    
                </div>
            </div>
        );
    }}

    return (
        
        (
            initialData &&
            <Dashboard title="Destination Update">
            <form onSubmit={handleSubmit} className="max-w-4xl p-6 mx-auto">
            <h2 className="mb-6 text-2xl font-bold">Update Destination</h2>
            
            <div >
                        <label className="block mb-2 text-sm font-medium">
                            Destination Id
                        </label>
                        <input
                            type="text"
                            defaultValue={destinationId}
                            onChange={handleInputChange}
                            className="w-full p-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
            {/* Basic Information */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Destination Name
                        </label>
                        <input
                            type="text"
                            name="destinationName"
                            defaultValue={initialData.destinationName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            defaultValue={initialData.location}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Short Description
                        </label>
                        <textarea
                            name="shortDescription"
                            defaultValue={initialData.shortDescription}
                            onChange={handleInputChange}
                            className="w-full h-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Full Description
                        </label>
                        <textarea
                            name="fullDescription"
                            defaultValue={initialData.fullDescription}
                            onChange={handleInputChange}
                            className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <div className='grid grid-cols-5 gap-4'>
                    {initialData.allDestinationImages
                        .filter(img => img.destinationImagePurpose === 'MAIN_IMAGE')
                        .map((item, index) => (
                        <div key={index} className="relative group">
                            <img width="150" src={item.destinationImageResourceUrl} alt="" />
                            <button
                                type="button"
                                onClick={() => handleDeleteMainImage(item.destinationImageId)}
                                disabled={isDeletingImage}
                                className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600 disabled:bg-red-300"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        ))
                    }
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Main Image
                        </label>
                        <input
                            type="file"
                            onChange={handleMainImageChange}
                            accept="image/*"
                            className="w-full p-2 border rounded-lg"
                            
                        />
                    </div>
                    <div className='grid grid-cols-5 gap-4'>
                    {initialData.allDestinationImages
                        .filter(img => img.destinationImagePurpose === 'SUB_IMAGE')
                        .map((item, index) => (
                            <div key={index} className="relative group">
                            <img 
                                width="150" 
                                src={item.destinationImageResourceUrl} 
                                alt={`Sub image ${index + 1}`}
                                className="w-full h-auto" 
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteSubImage(item.destinationImageId)}
                                disabled={isDeletingImage}
                                className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600 disabled:bg-red-300"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        ))
                    }
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Sub Images
                        </label>
                        <input
                            type="file"
                            onChange={handleSubImagesChange}
                            accept="image/*"
                            multiple
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                </div>

                {/* Activities */}
                
                <div className="space-y-4">
                    <div className="grid items-center justify-between grid-cols-5">
                        {initialData.activities.map((item, index) => (
                            <div key={index} className='relative flex-row'>
                                <p>{item.activityName}</p>
                                <img src={item.activityImageUrl} alt={`Activity ${index + 1}`} width="150" />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteActivity(item.activityName)}
                                    className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full hover:bg-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-lg font-medium">Activities</label>
                        <button
                            type="button"
                            onClick={addActivity}
                            className="flex items-center px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Activity
                        </button>
                    </div>

                    {activities.map((activity, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between mb-4">
                                <h3 className="text-lg font-medium">Activity {index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeActivity(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={activity.activityName}
                                    onChange={(e) => handleActivityChange(index, 'activityName', e.target.value)}
                                    placeholder="Activity Name"
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                                <input
                                    type="file"
                                    onChange={(e) => handleActivityImageChange(index, e)}
                                    accept="image/*"
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium">
                        Best Time to Visit
                    </label>
                    <input
                        type="text"
                        name="bestTimeToVisit"
                        defaultValue={initialData.bestTimeToVisit}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium">
                        Status
                    </label>
                    <select className="p-2 border rounded" defaultValue={initialData.active}  onChange={handleStatusChange}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                {error && (
                    <div className="p-3 text-red-500 bg-red-100 rounded">
                        {error}
                    </div>
                )}

                <div className="flex flex-col space-y-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Updating Destination...
                            </>
                        ) : (
                            'Update Destination'
                        )}
                    </button>

                    
                </div>
            </div>

            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <div className="flex items-center space-x-3">
                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                            <span className="text-lg font-medium">Updating Destination...</span>
                        </div>
                    </div>
                </div>
            )}
        </form>
        </Dashboard>
        )
        
    );
};

export default DestinationUpdate;
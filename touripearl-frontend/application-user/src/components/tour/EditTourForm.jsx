import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axiosFetch from "../../utils/axiosFetch";
import { CalendarDays, Clock, MapPin, Users, DollarSign, Calendar, Utensils, Bus, Plus, Minus, FileCheck } from "lucide-react";
import toast from 'react-hot-toast'

const EditTourForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        date: "",
        duration: "",
        price: "",
        availableSlots: "",
        difficultyLevel: "",
        includesTransport: false,
        includesMeals: false,
        meetingPoint: "",
        departureTime: "",
        timeline: [],
        destinations: [],
        isAvailable: false,
    });

    const [destinations, setDestinations] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState("");
    useEffect(() => {
        axiosFetch.get(`/api/tours/${id}`)
            .then(response => {
                const tourData = response.data.object;
                setFormData({
                    ...tourData,
                    destinations: tourData.destinations.map(destination => destination.destinationId)
                });
            })
            .catch(error => {
                console.error("Error fetching tour details", error);
            });
    }, [id]);

    useEffect(() => {
        // Fetch available destinations from the backend
        axiosFetch.get("/api/v1/destinations/all")
            .then(response => {
                setDestinations(response.data.object);// Store destinations in state
            })
            .catch(error => {
                if (error.response && error.response.status === 403) {
                    console.error("Access denied (403 Forbidden). Check authentication or permissions.");
                } else {
                    console.error("Error fetching destinations:", error);
                }
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleAddDestination = () => {
        if (selectedDestination && !formData.destinations.includes(selectedDestination)) {
            setFormData(prev => ({
                ...prev,
                destinations: [...prev.destinations, selectedDestination],
            }));
        }
    };

    const handleRemoveDestination = (destination) => {
        setFormData(prev => ({
            ...prev,
            destinations: prev.destinations.filter(d => d !== destination),
        }));
    };

    const handleTimelineChange = (index, name, value) => {
        const updatedTimeline = [...formData.timeline];
        updatedTimeline[index] = { ...updatedTimeline[index], [name]: value };
        setFormData({ ...formData, timeline: updatedTimeline });
    };

    const addTimelineEntry = () => {
        setFormData({
            ...formData,
            timeline: [
                ...formData.timeline,
                { time: "", activity: "", location: "", sequenceOrder: formData.timeline.length + 1 }
            ],
        });
    };

    const removeTimelineEntry = (index) => {
        const updatedTimeline = formData.timeline.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            timeline: updatedTimeline.map((entry, i) => ({ ...entry, sequenceOrder: i + 1 })),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const tourData = {
            ...formData,
            duration: parseInt(formData.duration, 10),
            price: parseFloat(formData.price),
            availableSlots: parseInt(formData.availableSlots, 10),
        };
        toast.promise(
            async ()=> {
                await axiosFetch.put(`/api/tours/${id}`, tourData);
                console.log(tourData)
                navigate("/guide/tour-management");
            },{
                loading: 'Updating tour...',
                success: 'Tour updated successfully!',
                error: 'Error updating tour'
            }
        );
    };


    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Calendar className="h-6 w-6" />
                        Edit Tour
                    </h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tour Name
                                    </label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 h-32"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Date
                                    </label>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tour Details */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Duration (days)
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Price
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Available Slots
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <input
                                            type="number"
                                            name="availableSlots"
                                            value={formData.availableSlots}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Difficulty Level
                                </label>
                                <select
                                    name="difficultyLevel"
                                    value={formData.difficultyLevel}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                >
                                    <option value="">Select Difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Challenging">Challenging</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Transport Included
                                </label>
                                <div className="flex items-center space-x-2 mt-2">
                                    <input
                                        type="checkbox"
                                        name="includesTransport"
                                        checked={formData.includesTransport}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                    <Bus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Meals Included
                                </label>
                                <div className="flex items-center space-x-2 mt-2">
                                    <input
                                        type="checkbox"
                                        name="includesMeals"
                                        checked={formData.includesMeals}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                    <Utensils className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Meeting Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Meeting Point
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    <input
                                        name="meetingPoint"
                                        value={formData.meetingPoint}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Departure Time
                                </label>
                                <input
                                    type="time"
                                    name="departureTime"
                                    value={formData.departureTime}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                />
                            </div>
                        </div>

                        {/* Destination Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Destination</label>
                            <div className="flex gap-4">
                                <select
                                    value={selectedDestination}
                                    onChange={(e) => setSelectedDestination(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                >
                                    <option value="">-- Select a Destination --</option>
                                    {destinations.map((dest) => (
                                        <option key={dest.destinationId} value={dest.destinationId}>{dest.destinationName}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddDestination}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </button>
                            </div>
                        </div>

                        {/* Selected Destinations */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selected Destinations</label>
                            <ul className="border border-gray-300 dark:border-gray-600 rounded-md p-3">
                                {formData.destinations.length > 0 ? (
                                    formData.destinations.map((dest, index) => (
                                        <li key={index} className="flex justify-between items-center p-2 border-b last:border-0 dark:border-gray-600">
                                            {destinations.find(d => d.destinationId === dest)?.destinationName}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDestination(dest)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">No destinations added yet.</p>
                                )}
                            </ul>
                        </div>

                        {/* Timeline Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tour Timeline
                                </label>
                                <button
                                    type="button"
                                    onClick={addTimelineEntry}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Entry
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.timeline.map((entry, index) => (
                                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input
                                                type="time"
                                                value={entry.time}
                                                onChange={(e) => handleTimelineChange(index, "time", e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                            />
                                            <input
                                                placeholder="Activity"
                                                value={entry.activity}
                                                onChange={(e) => handleTimelineChange(index, "activity", e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    placeholder="Location"
                                                    value={entry.location}
                                                    onChange={(e) => handleTimelineChange(index, "location", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                />
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTimelineEntry(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-600 rounded-md"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Availability Toggle */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Available for Booking
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FileCheck className="h-4 w-4 mr-2" />
                            Update Tour
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTourForm;
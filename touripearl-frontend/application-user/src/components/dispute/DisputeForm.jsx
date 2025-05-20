import { useState, useEffect } from "react";
import axiosFetch from "../../utils/axiosFetch.js";
import { useParams } from "react-router-dom";

export default function DisputeForm() {
    const { bookingId } = useParams(); // Get bookingId from URL parameters
    const [formData, setFormData] = useState({
        description: "",
        reason: "",
        bookingId: bookingId || "" // Initialize with the URL parameter if available
    });
    const [images, setImages] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [booking, setBooking] = useState(null);
    const [isLoadingBooking, setIsLoadingBooking] = useState(true);

    // Fetch specific booking using the bookingId from params
    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) {
                setIsLoadingBooking(false);
                return;
            }

            try {
                setIsLoadingBooking(true);
                const response = await axiosFetch.get(`/api/v1/booking/${bookingId}`);

                if (response.data.object) {
                    setBooking(response.data.object);
                    // Pre-fill the bookingId in the form
                    setFormData(prev => ({ ...prev, bookingId }));
                }
                setIsLoadingBooking(false);
            } catch (error) {
                console.error("Failed to fetch booking", error);
                setIsLoadingBooking(false);
            }
        };

        fetchBooking();
    }, [bookingId]);
    const reasons = [
        {value:"SERVICE_NOT_AS_DESCRIBED",label:"Service not as described"},
        {value:"UNAUTHORIZED_CHARGES" ,label: "Unauthorized charges"},
        {value:"POOR_COMMUNICATION,", label: "Poor communication"},
        {value:"UNPROFESSIONAL_BEHAVIOR", label: "Unprofessional behavior"},
        {value:"LATE_CHECK_IN" , label: "Late check-in"},
        {value:"LATE_CHECK_OUT", label: "Late check-out"},
        {value:"OTHER",label: "Other"}
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            // Limit to 5 images
            if (images.length + filesArray.length > 5) {
                alert("You can upload a maximum of 5 images");
                return;
            }

            // Add new files to existing ones
            setImages([...images, ...filesArray]);

            // Create preview URLs
            const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
        }
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviewUrls[index]);

        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviewUrls = [...imagePreviewUrls];
        newPreviewUrls.splice(index, 1);
        setImagePreviewUrls(newPreviewUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.description || !formData.reason || !formData.bookingId) {
            alert("Please fill in all required fields");
            return;
        }

        setIsLoading(true);

        try {
            // Create form data
            const submitData = new FormData();

            // Add images
            images.forEach(image => {
                submitData.append("Images", image);
            });

            // Add dispute data as JSON blob
            const disputeDto = {
                description: formData.description,
                reason: formData.reason,
                bookingId: formData.bookingId
            };

            submitData.append("body", new Blob([JSON.stringify(disputeDto)], {
                type: "application/json"
            }));

            // Make the actual API call
            const response = await axiosFetch.post("/api/v1/disputes/raise", submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Dispute submitted successfully!");

            // Reset form
            setFormData({
                description: "",
                reason: "",
                bookingId: bookingId || "" // Retain the bookingId from params
            });

            // Clear images
            imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
            setImages([]);
            setImagePreviewUrls([]);

        } catch (error) {
            console.error("Error submitting dispute:", error);
            alert("Failed to submit dispute. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


                return (
                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Raise a Dispute</h2>

                    {isLoadingBooking ? (
                        <div className="text-center py-4">Loading booking details...</div>
                    ) : (
                        (booking.status === "IN_DISPUTE")?
                        <h2 className="text-xl font-bold text-gray-800 mb-6">This Booking is on Dispute</h2>
                    :
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Booking Information */}
                            {booking ? (
                                <div className="mb-4 p-3 border rounded-md bg-gray-50">
                                    <h3 className="font-medium text-gray-700">Booking Details</h3>
                                    <p className="text-sm text-gray-700">
                                        <span
                                            className="font-medium">Stay dates:</span> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </p>
                                    {booking.propertyName && (
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Property:</span> {booking.propertyName}
                                        </p>
                                    )}
                                    <input type="hidden" name="bookingId" value={bookingId}/>
                                </div>
                            ) : (
                                <div className="mb-4 p-3 border rounded-md bg-red-50 text-red-700">
                                    <p>Booking not found or could not be loaded.</p>
                                    <p className="text-sm">Please check the booking ID or try again later.</p>
                                </div>
                            )}

                            {/* Reason */}
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    {reasons && reasons.map((reason) =>
                                        <option key={reason.label} value={reason.value}>{reason.label}</option>
                                    )}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Please provide details about your dispute..."
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Images (Optional, max 5)
                                </label>
                                <div
                                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                            >
                                                <span>Upload files</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    disabled={images.length >= 5}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5 files</p>
                                    </div>
                                </div>

                                {/* Image previews */}
                                {imagePreviewUrls.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                        {imagePreviewUrls.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-20 w-full object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                                    disabled={isLoading || !booking}
                                >
                                    {isLoading ? "Submitting..." : "Submit Dispute"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                );
                }
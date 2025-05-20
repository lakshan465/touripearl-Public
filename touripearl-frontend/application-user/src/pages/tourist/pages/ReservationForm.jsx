import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosFetch from "../../../utils/axiosFetch.js";
import TouristLayout from "../../../components/user-layouts/TouristLayout.jsx";
import { 
  Calendar, 
  Users, 
  List, 
  Trash2, 
  PlusCircle, 
  Clipboard, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Loader2,
  User,
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  MapPin,
  Camera,
  DollarSign,
  Globe
} from "lucide-react";
import DateSelection from "../../../components/DateSelection/DateSelection.jsx";

const TouristReservationForm = () => {
    const { id } = useParams();
    const [availableSlots, setAvailableSlots] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [tourPeople, setTourPeople] = useState([]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const [tourDetails, setTourDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axiosFetch.get(`/api/tours/${id}`)
            .then(response => {
                setTourDetails(response.data.object);
                setAvailableSlots(response.data.object.availableSlots);
            })
            .catch(error => {
                console.error("Error fetching tour details.", error);
                setError("Failed to fetch tour details.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleAddPerson = () => {
        if (tourPeople.length < availableSlots) {
            setTourPeople([...tourPeople, { name: "", passportNumber: "", type: "ADULT" }]);
        } else {
            setError("This tour is almost full! No more spots available.");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handlePersonChange = (index, field, value) => {
        const updatedPeople = [...tourPeople];
        updatedPeople[index][field] = value;
        setTourPeople(updatedPeople);
    };

    const handleRemovePerson = (index) => {
        const updatedPeople = [...tourPeople];
        updatedPeople.splice(index, 1);
        setTourPeople(updatedPeople);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(startDate == ""){
            setError("select date");
            return;
        }
        setIsSubmitting(true);
        setError("");
        
        const reservationData = {
            tourId: id,
            startDate,
            totalCost:tourDetails.price*tourPeople.length,
            tourPeoples: tourPeople
        };
        
        axiosFetch.post("/api/reservations", reservationData)
            .then(response => {
                console.log("Reservation created successfully", response.data);
                setSuccess("Your adventure is booked! Check your email for confirmation details.");
                setTourPeople([]);
                setStartDate("");
                setTimeout(() => setSuccess(""), 5000);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(error => {
                console.error("Error creating reservation.", error);
                setError("We couldn't complete your booking. " + (error.response?.data?.message || "Please try again."));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const getProgressColor = () => {
        const filled = tourPeople.length;
        const total = availableSlots;
        const percentage = (filled / total) * 100;
        
        if (percentage < 50) return "bg-green-500";
        if (percentage < 80) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getAvailabilityMessage = () => {
        const remaining = availableSlots - tourPeople.length;
        
        if (remaining === 0) return "Fully booked for your group!";
        if (remaining <= 3) return `Only ${remaining} spots left!`;
        if (remaining <= 6) return "Limited spots available!";
        return "Good availability!";
    };

    const getAvailabilityColor = () => {
        const remaining = availableSlots - tourPeople.length;
        
        if (remaining === 0) return "text-green-600";
        if (remaining <= 3) return "text-red-600";
        if (remaining <= 6) return "text-amber-600";
        return "text-green-600";
    };

    if (loading) {
        return (
            <TouristLayout>
                <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center min-h-[300px]">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={36} />
                    <p className="text-gray-600">Loading your adventure details...</p>
                </div>
            </TouristLayout>
        );
    }

    return (
        <TouristLayout>
            <div className="max-w-4xl mx-auto mb-12 py-20">
                <div className="mb-4">
                    <button 
                        onClick={() => window.history.back()} 
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        <span>Back to Experiences</span>
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold flex items-center">
                            <Camera className="mr-2" size={24} />
                            Book Your Adventure
                        </h1>
                        {tourDetails && (
                            <p className="mt-1 opacity-90">
                                {tourDetails.name || "Amazing Experience"}
                            </p>
                        )}
                    </div>

                    <div className="p-6">
                        {/* Notification area */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center animate-fadeIn">
                                <AlertTriangle className="text-red-500 mr-2 flex-shrink-0" size={20} />
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center animate-fadeIn">
                                <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={20} />
                                <p className="text-green-700">{success}</p>
                            </div>
                        )}

                        {/* Tour info card */}
                        {tourDetails && (
                            <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-start">
                                    <Info className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                    <div className="w-full">
                                        <h3 className="font-medium text-blue-800">Experience Details</h3>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center text-blue-700">
                                                <CalendarIcon size={14} className="mr-2" />
                                                <span>Duration: {tourDetails.duration || "N/A"} days of adventure</span>
                                            </div>
                                            <div className="flex items-center text-blue-700">
                                                <Clock size={14} className="mr-2" />
                                                <span>Start Time: {tourDetails.startTime || "Flexible"}</span>
                                            </div>
                                            {tourDetails.location && (
                                                <div className="flex items-center text-blue-700">
                                                    <MapPin size={14} className="mr-2" />
                                                    <span>Location: {tourDetails.location}</span>
                                                </div>
                                            )}
                                            {tourDetails.languages && (
                                                <div className="flex items-center text-blue-700">
                                                    <Globe size={14} className="mr-2" />
                                                    <span>Languages: {tourDetails.languages}</span>
                                                </div>
                                            )}
                                            {tourDetails.price && (
                                                <div className="flex items-center text-blue-700">
                                                    <DollarSign size={14} className="mr-2" />
                                                    <span>Price: {tourDetails.price}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center font-medium" >
                                                <Users size={14} className="mr-2" />
                                                <span>{getAvailabilityMessage()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Date selection */}
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                    <Calendar className="mr-2 text-blue-600" size={20} />
                                    When do you want to go?
                                </h2>
                                <div className="flex flex-col">
                                    <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1">
                                        Select your preferred date
                                    </label>
                                    <DateSelection
                                        guideId={tourDetails?.guideId}
                                        setSelectedDate={setStartDate}
                                        tourDateRange={tourDetails.duration}
                                    />
                                    {startDate && (
                                        <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-indigo-800 flex items-center justify-between">
                                            <span>
                                                Selected start date: {startDate}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Participants section */}
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-800 flex items-center mb-2 md:mb-0">
                                        <Users className="mr-2 text-blue-600" size={20} />
                                        Who's joining this adventure?
                                    </h2>
                                    
                                    {/* Slots indicator */}
                                    <div className="bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
                                        <div className="text-sm text-gray-600 mb-1">
                                            Your group: <span className="font-medium">{tourPeople.length}</span> of {availableSlots} spots
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`${getProgressColor()} h-2 rounded-full transition-all duration-300 ease-in-out`}
                                                style={{ width: `${(tourPeople.length / availableSlots) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {tourPeople.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                                        <User className="mx-auto text-gray-400 mb-2" size={32} />
                                        <p className="text-gray-500 mb-4">Who's coming on this adventure?</p>
                                        <button
                                            type="button"
                                            onClick={handleAddPerson}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            <PlusCircle className="mr-1" size={16} />
                                            Add Traveler
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {tourPeople.map((person, index) => (
                                            <div key={index} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                                                    <h3 className="font-medium text-gray-800 flex items-center">
                                                        <User className="mr-2 text-blue-600" size={16} />
                                                        Traveler #{index + 1}
                                                    </h3>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemovePerson(index)}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                                                        aria-label="Remove traveler"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Full Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                            placeholder="As shown on ID/passport"
                                                            value={person.name}
                                                            onChange={(e) => handlePersonChange(index, "name", e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            <div className="flex items-center">
                                                                <Clipboard className="mr-1 text-gray-500" size={14} />
                                                                Passport/ID Number
                                                            </div>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                            placeholder="Required for some activities"
                                                            value={person.passportNumber}
                                                            onChange={(e) => handlePersonChange(index, "passportNumber", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Traveler Type
                                                        </label>
                                                        <select
                                                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                            value={person.type}
                                                            onChange={(e) => handlePersonChange(index, "type", e.target.value)}
                                                            required
                                                        >
                                                            <option value="ADULT">Adult (12+ years)</option>
                                                            <option value="CHILD">Child (2-11 years)</option>
                                                            <option value="INFANT">Infant (0-2 years)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                onClick={handleAddPerson}
                                                disabled={tourPeople.length >= availableSlots}
                                                className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                                                    ${tourPeople.length >= availableSlots 
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'}`}
                                            >
                                                <PlusCircle className="mr-1" size={16} />
                                                Add Another Traveler
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit section */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <div>
                                    {tourPeople.length === 0 && (
                                        <p className="text-sm text-amber-600 flex items-center">
                                            <AlertTriangle size={14} className="mr-1" />
                                            Please add at least one traveler
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || tourPeople.length === 0 || !startDate}
                                    className={`px-6 py-2.5 rounded-md text-white font-medium transition-colors flex items-center
                                        ${(isSubmitting || tourPeople.length === 0 || !startDate)
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow'}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            Booking...
                                        </>
                                    ) : (
                                        'Secure Your Adventure!'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </TouristLayout>
    );
};

export default TouristReservationForm;
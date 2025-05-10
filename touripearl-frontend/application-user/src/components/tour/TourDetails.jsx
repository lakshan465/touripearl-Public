import {Link, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import axiosFetch from "../../utils/axiosFetch.js";
import {
    Calendar,
    Clock,
    DollarSign,
    MapPin,
    Users,
    Activity,
    Coffee,
    Bus,
    ChevronLeft,
    Timer
} from "lucide-react";

const TourDetails = ({view}) => {
    const { id } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosFetch.get(`api/tours/${id}`)
            .then(response => {
                setTour(response.data.object);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching tour details.", error);
                setError("Failed to load tour details.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
    );

    if (!tour) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <p className="text-gray-500 dark:text-gray-400">Tour not found.</p>
        </div>
    );

    return (
        <div className="w-full mx-auto py-20 px-10 space-y-6 bg-gray-100 dark:bg-gray-900">
            {<Link to={ view==="guide" ? '/guide/tour-management':'/home'}>
            <button
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
            >
                <ChevronLeft size={20} />
                Back to Tours
            </button>
            </Link>}

            <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{tour.name}</h1>

                <p className="text-lg text-gray-700 dark:text-gray-300">{tour.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tour Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-blue-500" size={20} />
                                <span className="text-gray-700 dark:text-gray-300">${tour.price}(per person)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="text-blue-500" size={20} />
                                <span className="text-gray-700 dark:text-gray-300">{tour.date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Timer className="text-blue-500" size={20} />
                                <span className="text-gray-700 dark:text-gray-300">{tour.duration} days</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="text-blue-500" size={20} />
                                <span className="text-gray-700 dark:text-gray-300">{tour.availableSlots} slots available</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Activity className="text-blue-500" size={20} />
                                <span className="text-gray-700 dark:text-gray-300">Difficulty: {tour.difficultyLevel}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Additional Info</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Bus className="text-blue-500" size={20} />
                                <span className="text-gray-700 dark:text-gray-300">
                  Transport: {tour.includesTransport ? "Included" : "Not included"}
                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Coffee className="text-blue-500" size={20} />
                                <span className="text-gray-700 dark:text-gray-300">
                  Meals: {tour.includesMeals ? "Included" : "Not included"}
                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-blue-500" size={20} />
                                <span className="text-gray-700 dark:text-gray-300">{tour.meetingPoint}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="text-blue-500" size={20} />
                                <span className="text-gray-700 dark:text-gray-300">{tour.departureTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Destinations</h2>
                    <div className="grid gap-4">
                        {tour.destinations.map(dest => (
                            <div key={dest} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{dest.destinationName}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{dest.shortDescription}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tour Timeline</h2>
                    <div className="space-y-4">
                        {tour.timeline.map(event => (
                            <div key={event.time} className="flex gap-4 items-start">
                                <div className="flex-shrink-0 w-24 text-blue-500 font-medium">
                                    {event.time}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {event.activity}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <Link to={`/book/predefined/${tour.id}`}>
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Book Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TourDetails;
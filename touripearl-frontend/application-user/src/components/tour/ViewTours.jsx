import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosFetch from "../../utils/axiosFetch.js";
import { Calendar, Clock, MapPin, Users, Utensils, Bus } from "lucide-react";

const ViewTours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        axiosFetch.get("/api/tours")
            .then(response => {
                setTours(response.data.object.content);
                console.log(response.data.object.content)
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching tours.", error);
                setError("Failed to load tours. Please try again.");
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center text-gray-600 py-8">Loading tours...</p>;
    if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

    return (
        <div className="w-full mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8">Available Tours</h2>
            {tours.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tours.map((tour) => (
                        <li key={tour.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold mb-2">{tour.name}</h3>
                            <p className="text-gray-600 mb-4">{tour.description}</p>

                            <div className="space-y-3 mb-4">
                                <p className="flex items-center text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{tour.date}</span>
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>{tour.duration} days</span>
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <Users className="w-4 h-4 mr-2" />
                                    <span>{tour.availableSlots} slots</span>
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{tour.meetingPoint}</span>
                                </p>

                                <div className="flex gap-4">
                                    {tour.includesTransport && (
                                        <span className="flex items-center text-gray-600">
                                            <Bus className="w-4 h-4 mr-1" />
                                            Transport
                                        </span>
                                    )}
                                    {tour.includesMeals && (
                                        <span className="flex items-center text-gray-600">
                                            <Utensils className="w-4 h-4 mr-1" />
                                            Meals
                                        </span>
                                    )}
                                </div>

                                <p className="text-2xl font-bold text-blue-600 mt-2">
                                    ${tour.price}
                                    <span className="text-sm text-gray-500 font-normal ml-1">per person</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4">
                                <Link
                                    to={`/tours/${tour.id}`}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    View Details
                                </Link>
                                    <>
                                        <Link
                                            to={`/edit-tour/${tour.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(tour.id)}
                                            className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </>

                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No tours available.</p>
            )}
        </div>
    );
};


export default ViewTours;


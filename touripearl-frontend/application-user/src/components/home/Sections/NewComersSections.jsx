import {Star, ArrowRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import axiosFetch from "../../../utils/axiosFetch.js";
import {useEffect, useState} from "react";

const NewComersSection = () => {
    const [guides, setGuides] = useState([]);

    const getGuides = async () => {
        try {
            const response = await axiosFetch.get('api/v1/guide/list/new', {
                params: {
                    searchTxt: "",
                    page: 0,
                    size: 2
                }
            })
            console.log(response?.data?.object?.guideDetailsList)
            setGuides(response?.data?.object?.guideDetailsList)
            console.log(guides)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getGuides()
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                    Newly Joined Guides
                </h2>
                <Link
                    className="flex items-center gap-2 text-blue-600 hover:text-purple-600 transition-all duration-300 group dark:text-blue-400 dark:hover:text-purple-400"
                    to="/top-rated-guides"
                >
                    <span className="font-semibold">View All</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"/>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {guides && guides.map(guide => (
                    <Link
                        to={`/guides/${guide.id}`}
                        key={guide.id}
                        className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <img
                            src={guide?.profileImageUrl?.resourceUrl}
                            alt={guide.firstname}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                        <div className="absolute bottom-0 p-6 text-white">
                            <h3 className="text-xl font-semibold mb-2">{guide.firstname+" "+guide.lastname}</h3>
                            <p className="mb-2">{guide.country}</p>
                            <div className="flex items-center space-x-2 mb-4">
                                <Star className="w-4 h-4 text-yellow-400"/>
                                <span>{guide.starMean}</span>
                                <span>•</span>
                            </div>
                            <button
                                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                                onClick={() => {
                                    new Notification(`Booked ${guide.firstname+" "+guide.lastname}`)
                                }}
                            >
                                Book Now
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
export default NewComersSection;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosFetch from '@utils/axiosFetch';
import { MapPin, Calendar, Cloud } from 'lucide-react';
import GuestLayout from '@components/user-layouts/GuestLayout';

const ViewAllEvents = () => {
    const [events, setEvents] = useState([]);
    const [size, setSize] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosFetch.get('/api/v1/events/upcoming-events', {
                params: {
                    page: 0,
                    size: size,
                },
            });
            setEvents(response.data.object.content);
        };
        fetchData();
    }, [size]);

    const handleSeeMore = () => {
        setSize(prevSize => prevSize + 5);
    };

    return (
        <GuestLayout>
            <div className="max-w-full mx-auto px-10 py-16 bg-light dark:bg-gray-900 text-secondary transition-colors duration-300">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-12 text-center">
                    All Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => {
                        const mainImage = event.images.find(image => image.eventImageType === 'MAIN_IMAGE');
                        return (
                            <div
                                key={event.id}
                                className="bg-light/50 dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="relative aspect-video">
                                    <img
                                        src={mainImage ? mainImage.eventImageResourceUrl : event.images[0].eventImageResourceUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <h3 className="text-2xl font-bold mb-2 line-clamp-1">{event.title}</h3>
                                        <p className="text-sm text-gray-200 line-clamp-2">{event.shortDescription}</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-2 text-secondary">
                                        <Calendar className="w-5 h-5 text-accent shrink-0" />
                                        <span className="truncate">
                                        {new Date(event.startDateTime).toLocaleDateString()} ~ {new Date(event.endDateTime).toLocaleDateString()}
                                    </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-secondary">
                                        <MapPin className="w-5 h-5 text-accent shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-secondary">
                                        <Cloud className="w-5 h-5 text-accent shrink-0" />
                                        <span className="truncate">{event.weatherSuitability}</span>
                                    </div>
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="inline-block text-primary hover:text-accent transition-colors duration-300"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleSeeMore}
                        className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors duration-300"
                    >
                        See More
                    </button>
                </div>
            </div>
        </GuestLayout>
    );
};

export default ViewAllEvents;
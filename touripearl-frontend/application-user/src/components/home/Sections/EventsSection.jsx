import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, MapPin, Calendar, Cloud  } from 'lucide-react';
import axiosFetch from '@utils/axiosFetch';
import { Link, useNavigate } from 'react-router-dom';

const EventSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredId, setHoveredId] = useState(null);
    const [eventsPerView, setEventsPerView] = useState(2);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosFetch.get('/api/v1/events/upcoming-events', {
                params: { 
                    page: 0, 
                    size: 4, 
                }
            });
            
            
            const eventsData = response?.data?.object?.content || [];
            setEvents(eventsData);
            console.log(response);
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setEventsPerView(1);
            } else if (window.innerWidth < 1024) {
                setEventsPerView(2);
            } else {
                setEventsPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex + eventsPerView >= events.length ? 0 : prevIndex + eventsPerView
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex - eventsPerView < 0 ? events.length - eventsPerView : prevIndex - eventsPerView
        );
    };

    return (
        <div className="px-4 py-16 mx-auto max-w-7xl rounded-xl bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text dark:from-blue-400 dark:to-purple-400">
                    Latest Events in Sri Lanka
                </h2>
                <Link className="flex items-center gap-2 text-blue-600 transition-all duration-300 hover:text-purple-600 group dark:text-blue-400 dark:hover:text-purple-400"
                    to="/upcoming-events"
                >
                    <span className="font-semibold">View All</span>
                    <ArrowRight className="w-5 h-5 transition-transform transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="relative">
                <div className="overflow-hidden">
                    <div 
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * (100 / eventsPerView)}%)` }}
                    >
                        {events ? events.map(event => {
                            const mainImage = event.images.find(image => image.eventImageType === 'MAIN_IMAGE');
                            return (
                                <div 
                                    key={event.id} 
                                    className={`w-full sm:w-1/2 lg:w-1/${eventsPerView} flex-shrink-0 px-4`}
                                    onMouseEnter={() => setHoveredId(event.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => { navigate(`/events/${event.id}`); }}
                                >
                                    <div className="overflow-hidden transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800">
                                        <div className="relative aspect-video">
                                            <img 
                                                src={mainImage ? mainImage.eventImageResourceUrl : event.images[0].eventImageResourceUrl}
                                                alt={event.title}
                                                className="object-cover w-full h-full transition-transform duration-700 ease-out"
                                                style={{
                                                    transform: hoveredId === event.id ? 'scale(1.05)' : 'scale(1)'
                                                }}
                                                loading='lazy'
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                                <h3 className="mb-2 text-2xl font-bold">{event.title}</h3>
                                                <p className="text-sm text-gray-200 line-clamp-2">{event.shortDescription}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-5 h-5" />
                                                <span>{new Date(event.startDateTime).toLocaleDateString()} ~ {new Date(event.endDateTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <MapPin className="w-5 h-5" />
                                                <span>{event.venue}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Cloud  className="w-5 h-5" />
                                                <span>{event.weatherSuitability}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    :"No Upcoming Events"
                    }
                    </div>
                </div>

                <button 
                    onClick={prevSlide}
                    className="absolute left-0 p-3 transition-all duration-300 transform -translate-x-4 -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 dark:bg-gray-700"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>

                <button 
                    onClick={nextSlide}
                    className="absolute right-0 p-3 transition-all duration-300 transform translate-x-4 -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 dark:bg-gray-700"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
            </div>
        </div>
    );
};

export default EventSection;
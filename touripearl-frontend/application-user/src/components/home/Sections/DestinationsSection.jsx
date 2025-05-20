import React, { useEffect } from 'react'
import { useState } from 'react'
import axiosFetch from '../../../utils/axiosFetch';
import {ArrowRight, Calendar, ChevronLeft, ChevronRight, Cloud, MapPin} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';

const DestinationsSection = () => {
    const [destinations, setDestinations] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredId, setHoveredId] = useState(null);
    const [destinationsPerView, setDestinationsPerView] = useState(2);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchDestinationData = async () =>{
            const response = await axiosFetch.get('api/v1/destinations',{
                params:{
                    page:0,
                    size:4
                }
            })
            const activeDestinations = response.data.object.content.filter(
                destination => destination.active === true
              );
              setDestinations(activeDestinations);
        }
        fetchDestinationData();
    },[]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setDestinationsPerView(1);
            } else if (window.innerWidth < 1024) {
                setDestinationsPerView(2);
            } else {
                setDestinationsPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + destinationsPerView >= destinations.length ? 0 : prevIndex + destinationsPerView
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - destinationsPerView < 0 ? destinations.length - destinationsPerView : prevIndex - destinationsPerView
        );
    };

    

    return (
        <div className="px-4 py-16 mx-auto max-w-7xl rounded-xl bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text dark:from-blue-400 dark:to-purple-400">
                    Destinations in Sri Lanka
                </h2>
                <Link
                    className="flex items-center gap-2 text-blue-600 transition-all duration-300 hover:text-purple-600 group dark:text-blue-400 dark:hover:text-purple-400"
                    to="/destinations"
                >
                    <span className="font-semibold">View All</span>
                    <ArrowRight className="w-5 h-5 transition-transform transform group-hover:translate-x-1"/>
                </Link>
            </div>
            <div className="relative">
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{transform: `translateX(-${currentIndex * (100 / destinationsPerView)}%)`}}
                    >
                        {destinations ? destinations.map(destination => {
                                const mainImage =destination.allDestinationImages.find(allDestinationImage => allDestinationImage.destinationImagePurpose === 'MAIN_IMAGE');
                                return (
                                    <div
                                        key={destination.destinationId}
                                        className={`w-full sm:w-1/2 lg:w-1/${destinationsPerView} flex-shrink-0 px-4`}
                                        onMouseEnter={() => setHoveredId(destination.destinationId)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        onClick={() => {
                                            navigate(`/destinations/${destination.destinationId}`);
                                        }}
                                    >
                                        <div
                                            className="overflow-hidden transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800">
                                            <div className="relative aspect-video">
                                                <img
                                                    src={mainImage ? mainImage.destinationImageResourceUrl : destination.allDestinationImages[0].destinationImageResourceUrl}
                                                    alt={destination.title}
                                                    className="object-cover w-full h-full transition-transform duration-700 ease-out"
                                                    style={{
                                                        transform: hoveredId === destination.destinationId ? 'scale(1.05)' : 'scale(1)'
                                                    }}
                                                    loading='lazy'
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                                                <div className="absolute bottom-0 left-0 p-6 text-white">
                                                    <h3 className="mb-2 text-2xl font-bold">{destination.destinationName}</h3>
                                                    <p className="text-sm text-gray-200 line-clamp-2">{destination.shortDescription}</p>
                                                </div>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <Calendar className="w-5 h-5"/>
                                                    <span>Vist Between {destination.bestTimeToVisit}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <MapPin className="w-5 h-5"/>
                                                    <span>{destination.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                            : "No Destinations"
                        }
                    </div>
                </div>
                <button
                    onClick={prevSlide}
                    className="absolute left-0 p-3 transition-all duration-300 transform -translate-x-4 -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 dark:bg-gray-700"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200"/>
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-0 p-3 transition-all duration-300 transform translate-x-4 -translate-y-1/2 rounded-full shadow-lg top-1/2 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 dark:bg-gray-700"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200"/>
                </button>
            </div>
        </div>
    );
}
export default DestinationsSection;
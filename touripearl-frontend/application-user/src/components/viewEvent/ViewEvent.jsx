import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@components/Card/Card';
import { 
    MapPin, 
    Calendar, 
    Cloud, 
    DollarSign, 
    Users, 
    Camera, 
    Accessibility, 
    Info, 
    UserCheck, 
    ShieldCheck,
    Palette,
    Clock
} from 'lucide-react';
import axiosFetch from '@utils/axiosFetch';
import Loader from '@components/loader/Loader';

const ViewEvent = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            window.scrollTo(0, 0);
            const response = await axiosFetch.get(`/api/v1/events/${eventId}`);
            const fetchedEvent = response.data.object;
            setEvent(fetchedEvent);
            
            const mainImage = fetchedEvent.images.find(image => image.eventImageType === 'MAIN_IMAGE') || fetchedEvent.images[0];
            setSelectedImage(mainImage);
        };
        fetchEvent();
    }, [eventId]);

    if (!event) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-6">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols gap-8 p-4 sm:p-8">
                    {/* Image Gallery Section */}
                    <div className="space-y-4">
                        {/* Main Image Display */}
                        <div className="relative group">
                            <img
                                src={selectedImage?.eventImageResourceUrl || 'default-image-url'}
                                alt={event.title || 'Event Image'}
                                className="w-full h-[300px] sm:h-[500px] object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute bottom-4 left-4 bg-black/50 text-white font-bold px-3 py-1 rounded-full text-4xl flex items-center gap-2">
                                {event.title || 'Event Title'}
                            </div>
                            {event.highlights && event.highlights.length > 0 && (
                                <div className="absolute top-4 right-4 bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    {event.highlights.length} Highlights
                                </div>
                            )}
                        </div>
                        
                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            {event.images?.map((image, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => setSelectedImage(image)}
                                    className={`cursor-pointer rounded-lg overflow-hidden transition 
                                        ${selectedImage === image 
                                            ? 'ring-4 ring-blue-500 scale-105' 
                                            : 'hover:opacity-75'}`}
                                >
                                    <img
                                        src={image.eventImageResourceUrl || 'default-thumbnail-url'}
                                        alt={`Event image ${index + 1}`}
                                        className="w-full h-16 sm:h-20 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Full Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white flex items-center gap-2">
                                    <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    Event Description
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">{event.description || 'No description available.'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {event.location ?
                            <iframe 
                                src={event.location} 
                                width="900" 
                                height="450" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>:'Not Specified'
                            }
                        </CardContent>
                    </Card>

                    {/* Event Details Section */}
                    <div className="space-y-6">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 
                            bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {event.title || 'Event Title'}
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6">{event.shortDescription || 'No short description available.'}</p>
                        
                        {/* Event Essentials Grid */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Essentials</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg flex items-center gap-3">
                                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                            <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                                                {event.startDateTime ? new Date(event.startDateTime).toLocaleDateString() : 'N/A'} - 
                                                {event.endDateTime ? new Date(event.endDateTime).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg flex items-center gap-3">
                                        <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Venue</p>
                                            <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{event.venue || 'Not Specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Highlights */}
                        {event.highlights && event.highlights.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Highlights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {event.highlights.map((highlight, index) => (
                                            <div 
                                                key={index} 
                                                className="flex items-center gap-3 bg-indigo-50 dark:bg-gray-800 p-3 rounded-lg"
                                            >
                                                <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Event Details Grid */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Weather */}
                                    <div className="flex items-center gap-3 bg-purple-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <Cloud className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Weather: {event.weatherSuitability || 'Not Specified'}
                                        </span>
                                    </div>

                                    {/* Pricing */}
                                    <div className="flex items-center gap-3 bg-yellow-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Pricing</p>
                                            <div className="text-gray-700 dark:text-gray-300">
                                                {event.currencyType || 'N/A'} - Local: {event.localPrice || 'N/A'} | Foreign: {event.foreignPrice || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Event Accessibility and Features */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Accessibility and Features</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    {/* Family Friendly */}
                                    <div className="flex items-center gap-3 bg-pink-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Family Friendly: {event.familyFriendly ? 'Yes' : 'No'}
                                        </span>
                                    </div>

                                    {/* Wheelchair Accessibility */}
                                    <div className="flex items-center gap-3 bg-teal-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <Accessibility className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Wheelchair Access: {event.wheelchairAccessible ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Restrictions and Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Restrictions and Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    {/* Senior Friendliness */}
                                    <div className="flex items-center gap-3 bg-orange-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <UserCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Senior Friendly: {event.seniorFriendly ? 'Yes' : 'No'}
                                        </span>
                                    </div>

                                    {/* Dress Code */}
                                    <div className="flex items-center gap-3 bg-rose-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <Palette className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Dress Code: {event.dressCode || 'Not Specified'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Photography and Age Restrictions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Photography and Age Restrictions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    {/* Photography Policy */}
                                    <div className="flex items-center gap-3 bg-emerald-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Photography: {event.photography || 'Allowed'}
                                        </span>
                                    </div>

                                    {/* Minimum Age */}
                                    <div className="flex items-center gap-3 bg-sky-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Minimum Age: {(event.minimumAge > 0) ? `${event.minimumAge} years` : 'No Restriction'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEvent;
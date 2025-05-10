import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../card/Card'
import axiosFetch from '../../utils/axiosFetch'
import { Calendar, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GuestLayout from '../user-layouts/GuestLayout'

const DestinationCards = () => {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const handleCardClick = (destinationId) => {
    navigate(`/destinations/${destinationId}`);
  };
  
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await axiosFetch.get('/api/v1/destinations');
        console.log(response.data.object.content);
        const activeDestinations = response.data.object.content.filter(
          destination => destination.active === true
        );
        setDestinations(activeDestinations);
        setError(null);
      } catch (error) {
        setError('Failed to fetch destinations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-600">Loading destinations...</div>
      </div>
    );
  }
      
  if (error) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
        {error}
      </div>
    );
  }
      
  if (!destinations || destinations.length === 0) {
    return (
      <div className="p-4 mb-4 text-blue-700 bg-blue-100 border-l-4 border-blue-500 rounded">
        No destinations found.
      </div>
    );
  }
      
  return (
    <GuestLayout>
      <div className="px-4 py-10">
      <p className="my-8 text-3xl font-bold text-center">Popular Destinations</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {destinations.map((destination, index) => (
          <div 
            className="cursor-pointer" 
            key={index} 
            onClick={() => handleCardClick(destination.destinationId)}
          >
            <Card hoverable>
              <CardHeader>
                <img 
                  className="justify-center object-cover w-full h-96" 
                  src={destination.allDestinationImages.find(
                    img => img.destinationImagePurpose === 'MAIN_IMAGE'
                  )?.destinationImageResourceUrl} 
                  alt={destination.destinationName}
                /> 
                <CardTitle className="pt-4 pb-4">
                  {destination.destinationName}
                </CardTitle>
                <div className="flex items-center gap-2 pb-3 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{destination.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <p className="font-bold">Best time to Visit:</p>
                </div>
                <div className="text-gray-600 ml-11">
                  {destination.bestTimeToVisit}
                </div>
              </CardHeader>
              <CardContent className="text-gray-800">
                {destination.shortDescription}
              </CardContent>
              <CardFooter>
                <div>
                  <h4 className="mb-2 font-semibold">Activities to do:</h4>
                  <ul className="pl-5 space-y-1 list-disc">
                    {destination.activities && destination.activities.map((activity, index) => (
                      <li key={index} className="text-gray-700">
                        {activity.activityName}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
    </GuestLayout>
  );
};

export default DestinationCards;
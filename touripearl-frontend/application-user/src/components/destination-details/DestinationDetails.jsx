import React from 'react'
import { useParams } from 'react-router-dom';
import axiosFetch from '../../utils/axiosFetch';
import { useState, useEffect } from 'react';
import ImageSlider from './ImageSlider';
import {Card, CardHeader, CardFooter} from '../card/Card';
import { MapPin, Calendar } from 'lucide-react';
import GuestLayout from '../user-layouts/GuestLayout';

const DestinationDetails = () => {
    const {destinationId} = useParams();
    const [destination, setDestination]=useState([]);
    const [error, setError]= useState(null);
    const [loading, setLoading]= useState(true);
    
    const fetchDestination = async () => {
        try {
            setLoading(true);
            const response = await axiosFetch.get(`/api/v1/destinations/${destinationId}`);
            console.log(response);
            setDestination(response.data.object);
            setError(null);
        } catch (error) {
            setError('Failed to fetch details. Please try again later.');
        }finally{
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchDestination();
    }, [destinationId]);

    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-gray-600">Loading details...</div>
          </div>
        );
      }
      
      if(error){
        return(
          
            <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
                {error}
            </div>
        
        );
      }
      
      

    
  return (
    
    <GuestLayout>
        <div className='px-10 py-14'>
        <div className='pt-4 text-4xl font-bold text-center'>
            {destination.destinationName}
        </div>
        <div className='flex justify-center item-center'>
            <ImageSlider images={destination.allDestinationImages}/>
        </div>
        <div className='grid grid-cols-1 gap-6 py-10 sm:grid-cols-3'>
            <Card className='px-6 py-10'>
                <CardHeader>
                <p className='py-3 text-2xl font-bold text-gray-800 '>
                    Location 
                </p>
                <div className="flex items-center gap-2 pb-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className='text-xl'>{destination.location}</span>
                </div>
                </CardHeader>
                <CardFooter>
                <p className='py-3 text-2xl font-bold text-gray-800 '>
                Best time to Visit
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span className='text-xl'>{destination.bestTimeToVisit}</span>
                </div>
                </CardFooter>
            </Card>
            <Card className='col-span-2 px-6 py-6 '>
                <p className='py-3 text-2xl font-bold text-gray-800 '>
                    About  
                </p>
                <div className='text-xl'>
                    {destination.fullDescription}
                </div>
            </Card>  
        </div>
        <Card className='p-4'>
            <p className='px-6 py-6 text-2xl font-bold text-gray-800 '>
                Activities to do
            </p>
           <div className="px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destination.activities.map((activity, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg">
                {activity.activityImageUrl && (
                  <div className="flex items-center justify-center w-full h-60">
                  <img 
                      src={activity.activityImageUrl} 
                      alt={activity.activityName}
                      className="object-cover w-full h-full rounded-lg"
                  />
              </div>
                )}
                <h3 className="mt-4 text-xl font-semibold text-center text-gray-800">
                  {activity.activityName}
                </h3>
              </div>
            ))}
          </div>
        </div>
        </Card>
    </div>
    </GuestLayout>
  )
}

export default DestinationDetails
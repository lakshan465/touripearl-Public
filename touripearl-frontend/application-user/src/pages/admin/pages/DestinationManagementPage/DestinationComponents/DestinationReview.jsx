import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axiosFetch from '../../../../../utils/axiosFetch';
import Dashboard from '../../../dashboard/Dashboard';
import {Card, CardHeader, CardContent} from '../../../../../components/card/Card';
import { Check, X } from 'lucide-react';

const DestinationReview = () => {
  const {destinationId} = useParams();
  const [destination, setDestination] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getDestination = async () =>{
    try {
      const response = await axiosFetch.get(`/api/v1/destinations/${destinationId}`)
      console.log(response);
      setDestination(response.data.object);
      setError(null);
    } catch (error) {
      setError('Failed to fetch destinations. Please try again later.');
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
          getDestination();
  },[destinationId])

  return (
    <Dashboard title="Destination Details">
      <div className='container max-w-4xl p-6 mx-auto'>
        <Card>
          <CardHeader>
            <div className='text-xl font-bold text-center'>
              {destination.destinationName}
            </div>
          </CardHeader>
          <CardContent className='text-lg '>
            <div className='grid grid-cols-3 py-4'>
              <p className='font-medium'>Destination Id</p>
              <span className='col-span-2 '> {destinationId}</span>
            </div>
            <div className='grid grid-cols-3 py-4'>
              <p className='font-medium'>Location</p>
              <span className='col-span-2'> {destination.location}</span>
            </div>
            <div className='grid grid-cols-3 py-4'>
              <p className='font-medium'>Best time to visit</p>
              <span className='col-span-2'>{destination.bestTimeToVisit}</span>
            </div>
            <div className='grid grid-cols-3 py-4'>
              <p className='font-medium'>Short Description</p>
              <span className='col-span-2'> {destination.shortDescription}</span>
            </div>
            <div className='grid grid-cols-3 py-4'>
              <p className='font-medium'>Full Description</p>
              <span className='col-span-2'>{destination.fullDescription}</span>
            </div>
            
            <div className='grid grid-cols-3 py-4'>
              <p className='font-medium'>Main Image</p>
              <div className="grid grid-cols-2 gap-4">
                  {destination?.allDestinationImages && destination.allDestinationImages
                      .filter(img => img.destinationImagePurpose === 'MAIN_IMAGE')
                      .map((mainImage, index) => (
                          <div key={index} className="flex flex-col">
                              <img 
                                  className="object-cover w-full h-48 rounded-lg" 
                                  src={mainImage.destinationImageResourceUrl} 
                                  alt={`Main Image ${index + 1} of ${destination.destinationName}`}
                              />
                          </div>
                      ))
                  }
              </div>
            </div>
            
            <div className='grid grid-cols-3 py-4'>
                <p className='font-medium'>Sub Images</p>
                <div className="grid grid-cols-2 gap-4">
                    {destination?.allDestinationImages && destination.allDestinationImages
                        .filter(img => img.destinationImagePurpose === 'SUB_IMAGE')
                        .map((subImage, index) => (
                            <div key={index} className="flex flex-col">
                                <img 
                                    className="object-cover w-full h-48 rounded-lg" 
                                    src={subImage.destinationImageResourceUrl} 
                                    alt={`Sub Image ${index + 1} of ${destination.destinationName}`}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
          
            <div className="grid grid-cols-3">
                <p className='font-medium'>Activities to do</p>
                {destination?.activities && destination.activities.map((activity, index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-4">
                        {activity.activityImageUrl && (
                            <div className="flex w-full h-32 col-span-2">
                                <img 
                                    src={activity.activityImageUrl} 
                                    alt={activity.activityName}
                                    className="object-cover w-full h-full rounded-lg"
                                />
                            </div>
                        )}
                        <h3 className="mt-4 text-center text-gray-800">
                            {activity.activityName}
                        </h3>
                    </div>
                ))}
            </div>
            
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  )
}

export default DestinationReview
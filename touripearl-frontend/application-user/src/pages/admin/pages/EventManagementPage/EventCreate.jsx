import React, { useState } from 'react';
import axiosFetch from '@utils/axiosFetch';
import Dashboard from '../../dashboard/Dashboard';
import FirstStep from './EventCreationSteps/FirstStep';
import SecondStep from './EventCreationSteps/SecondStep';
import ThirdStep from './EventCreationSteps/ThirdStep';
import { Card, CardContent, CardHeader, CardTitle } from '@components/Card/card';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EventCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    location: '',
    startDateTime: '',
    endDateTime: '',
    venue: '',
    weatherSuitability: '',
    highlights: [],
    foreignPrice: '',
    localPrice: '',
    currencyType: '',
    wheelchairAccessible: false,
    familyFriendly: false,
    seniorFriendly: false,
    dressCode: '',
    photography: '',
    minimumAge: '',
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [formImages, setFormImage] = useState({
    coverImage: null,
    mainImage: null,
    subImages: []
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "location" ? extractSrc(value) : (type === 'checkbox' ? checked : value)
    });
  };
  const extractSrc = (iframeString) => {
    const match = iframeString.match(/src="([^"]+)"/);
    if (match) {
      return match[1];
    } else {
      toast.error('Invalid iframe string');
      return '';
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormImage({
      ...formImages,
      [name]: name == "subImages" ? (Array.from(files)) : files[0]
    });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    console.log(formImages)
    
    if (formImages.mainImage) {
      data.append('mainImage', formImages.mainImage);
    }
    if (formImages.coverImage) {
      data.append('coverImage', formImages.coverImage);
    }

    // Append sub images
    if (formImages.subImages?.length > 0) {
      formImages.subImages.forEach(image => {
        data.append('subImages', image);
      });
    }
    
    data.append('body', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
    toast.promise(
      async () => {
        await axiosFetch.post('/api/v1/events', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        navigate('/admin/event-management');
      },{
        loading: 'Creating event...',
        success: 'Event created successfully!',
        error: (error)=> 'An error occurred: ' + error.response.data.message
      }

    );
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Dashboard title={'Create Event'}>
      <Card className="min-w-full mx-auto dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            {step === 1 && (
              <FirstStep 
                formData={formData} 
                handleChange={handleChange} 
              />
            )}
            
            {step === 2 && (
              <SecondStep 
                formData={formData} 
                handleChange={handleChange} 
              />
            )}
            
            {step === 3 && (
              <ThirdStep 
                formData={formData} 
                handleChange={handleChange} 
                handleFileChange={handleFileChange} 
              />
            )}

            <div className="flex justify-between">
              {(
                <button 
                  type="button" 
                  disabled={step == 1}
                  onClick={prevStep} 
                  className="px-4 py-2 border rounded dark:border-gray-600 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit"
                  onClick={() => { if (step == 3) { handleSubmit(); } }} 
                  className="px-4 py-2 bg-green-500 text-white rounded flex items-center dark:bg-green-700"
                >
                  <CheckCircle2 className="mr-2" />
                  Create Event
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Dashboard>
  );
};

export default EventCreate;
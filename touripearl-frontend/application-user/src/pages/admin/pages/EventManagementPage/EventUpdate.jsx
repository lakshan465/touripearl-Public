import React, { useEffect, useState } from 'react';
import axiosFetch from '@utils/axiosFetch';
import Dashboard from '../../dashboard/Dashboard';
import FirstStep from './EventCreationSteps/FirstStep';
import SecondStep from './EventCreationSteps/SecondStep';
import { Card, CardContent, CardHeader, CardTitle } from '@components/Card/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import UpdateLastStep from './EventUpdateStep/UpdateLastStep';
import toast from 'react-hot-toast';
import Button from '@components/ui/button/RUButton'

const EventUpdate = () => {
    const { eventId } = useParams();
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
  const navigate = useNavigate();
  useEffect(
    () => {
      const fetchEvent = async () => {
        try {
          const response = await axiosFetch(`/api/v1/events/${eventId}`);
          setFormData(response.data.object);
        } catch (error) {
          console.error('Failed to fetch event:', error);
        }
      };
      fetchEvent();
    },
    [eventId]
  );

  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);

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

  const handleSubmit = async () => {
    setError(null);
    toast.promise(
      async()=>{
      await axiosFetch.put(`/api/v1/events/update/${eventId}`, formData);
      navigate(`/admin/event-management/${eventId}`);
      },
      {
        loading: 'Updating event...',
        success: 'Event updated successfully',
        error: (error)=>error.response.data.message
      }
    );
    
  };
  const handleDelete = async() => {
    setError(null);
    toast.promise(
      async()=>{
      await axiosFetch.delete(`/api/v1/events/${eventId}`);
      navigate(`/admin/event-management`);
      },
      {
        loading: 'Deleting event...',
        success: 'Event Deleted successfully',
        error: (error)=>error.response.data.message
      }
    );
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Dashboard title={'Update Event'}>
      <Card className="min-w-full mx-auto dark:bg-gray-800 dark:text-white">
        <CardHeader className='p-0'>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Update Event {formData.title} 
            <Button
            onClick={handleDelete}
            type='warn'
            className='float-right'
            >
              Delete Event
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="flex items-center text-red-500 mb-4">
                <AlertCircle className="mr-2" />
                {error}
              </div>
            )}

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
              <UpdateLastStep 
                formData={formData} 
                handleChange={handleChange} 
              />
            )}

            <div className="flex justify-between">
              {(
                <Button
                  type="secondary" 
                  disabled={step == 1}
                  onClick={prevStep} 
                  className="px-4 py-2 border rounded dark:border-gray-600 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button 
                  type="primary" 
                  onClick={nextStep} 
                  className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="success"
                  onClick={() => { if (step == 3) { handleSubmit(); } }} 
                  className="px-4 py-2 bg-green-500 text-white rounded flex items-center dark:bg-green-700"
                >
                  <CheckCircle2 className="mr-2" />
                  Update Event
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Dashboard>
  );
};

export default EventUpdate;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosFetch from '../../../utils/axiosFetch';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Globe, 
  Info, 
  FileText, 
  UserCheck, 
  DollarSign, 
  Utensils, 
  Truck, 
  Map,
  Check,
  X,
  Loader,
  ArrowLeft
} from 'lucide-react';
import TouristLayout from '../../../components/user-layouts/TouristLayout';

const TouristReservation = () => {
  const reservationId = useParams().id;
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCallingPayment,setIsCallingPayment] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosFetch.get(`/api/reservations/${reservationId}`)
      .then(response => {
        setReservation(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reservation:', error);
        setError('Failed to load reservation details');
        setLoading(false);
      });
  }, [reservationId]);

  const confirmReservation = async() => {
    setIsCallingPayment(true);
    try {
        const response = await axiosFetch.get(`/api/payments/payForReservation`,{params:{amount:reservation.totalCost,reservationId:reservationId}});
        //setApprovalUrl(response.data);
        window.location.href = response.data.object; // Redirect to PayPal payment page
      } catch (error) {
        console.error("Payment error:", error);
      }finally {
      setIsCallingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900">
        <Loader className="animate-spin h-12 w-12 text-indigo-600 mb-4" />
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading reservation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="text-red-500 text-xl mb-4">
          <X className="h-12 w-12 mx-auto mb-2" />
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="text-amber-500 text-xl">
          <Info className="h-12 w-12 mx-auto mb-2" />
          Reservation not found
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <TouristLayout>
      <div className='w-full dark:bg-gray-900'>
        <div className="container mx-auto px-4 py-20 max-w-6xl dark:bg-gray-900">
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 mb-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 dark:bg-gray-800">
            <div className="bg-indigo-600 p-6">
              <h1 className="text-3xl font-bold text-white">Reservation Details</h1>
              <div className="flex flex-wrap mt-4 gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                  {reservation.status}
                </span>
                {reservation.status === 'CANCELLED' && reservation?.cancellationReason && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {reservation.cancellationReason}
                  </span>
                )}
                <span className="text-indigo-100 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created: {new Date(reservation.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Reservation Date Information */}
            <div className="p-6 border-b dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="text-indigo-600 h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Start Date</p>
                    <p className="font-medium dark:text-gray-100">{new Date(reservation.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-indigo-600 h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">End Date</p>
                    <p className="font-medium dark:text-gray-100">{new Date(reservation.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tourist Information */}
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="text-indigo-600" />
                Tourist Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <User className="text-indigo-600 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Name</p>
                    <p className="font-medium dark:text-gray-100">{reservation.touristResponseDto.firstName} {reservation.touristResponseDto.lastName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-indigo-600 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Email</p>
                    <p className="font-medium dark:text-gray-100">{reservation.touristResponseDto.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-indigo-600 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Phone</p>
                    <p className="font-medium dark:text-gray-100">{reservation.touristResponseDto.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="text-indigo-600 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Country</p>
                    <p className="font-medium dark:text-gray-100">{reservation.touristResponseDto.country}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-indigo-600 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">City/State</p>
                    <p className="font-medium dark:text-gray-100">{reservation.touristResponseDto.city}, {reservation.touristResponseDto.state}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="text-indigo-600 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Address</p>
                    <p className="font-medium dark:text-gray-100">{reservation.touristResponseDto.street}, {reservation.touristResponseDto.zipCode}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 col-span-full">
                  <Info className="text-indigo-600 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Bio</p>
                    <p className="font-medium dark:text-gray-100">{reservation.touristResponseDto.bio || 'No bio provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-indigo-600 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Join Date</p>
                    <p className="font-medium dark:text-gray-100">{new Date(reservation.touristResponseDto.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-indigo-600 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Last Active</p>
                    <p className="font-medium dark:text-gray-100">{new Date(reservation.touristResponseDto.lastActive).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour People */}
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="text-indigo-600" />
                Tour Participants
              </h2>
              {reservation.tourPeoples && reservation.tourPeoples.length > 0 ? (
                <div className="bg-gray-50 rounded-lg overflow-hidden dark:bg-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Passport Number</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {reservation.tourPeoples.map(person => (
                        <tr key={person.passportNumber}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{person.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{person.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{person.passportNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic dark:text-gray-300">No participants listed</p>
              )}
            </div>

            {/* Tour Details */}
            <div className="p-6 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Map className="text-indigo-600" />
                Tour Details
              </h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 dark:text-gray-100">{reservation.viewResponseDto.name}</h3>
                <p className="text-gray-700 mb-4 dark:text-gray-300">{reservation.viewResponseDto.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-indigo-600 h-5 w-5 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Tour Date</p>
                      <p className="font-medium dark:text-gray-100">{new Date(reservation.viewResponseDto.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="text-indigo-600 h-5 w-5 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Departure Time</p>
                      <p className="font-medium dark:text-gray-100">{reservation.viewResponseDto.departureTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="text-indigo-600 h-5 w-5 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Duration</p>
                      <p className="font-medium dark:text-gray-100">{reservation.viewResponseDto.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="text-indigo-600 h-5 w-5 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Price</p>
                      <p className="font-medium dark:text-gray-100">${reservation.viewResponseDto.price}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-indigo-600 h-5 w-5 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Meeting Point</p>
                      <p className="font-medium dark:text-gray-100">{reservation.viewResponseDto.meetingPoint}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="text-indigo-600 h-5 w-5 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Difficulty Level</p>
                      <p className="font-medium dark:text-gray-100">{reservation.viewResponseDto.difficultyLevel}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${reservation.viewResponseDto.includesMeals ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    <Utensils className="h-4 w-4" />
                    {reservation.viewResponseDto.includesMeals ? 'Meals Included' : 'Meals Not Included'}
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${reservation.viewResponseDto.includesTransport ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    <Truck className="h-4 w-4" />
                    {reservation.viewResponseDto.includesTransport ? 'Transport Included' : 'Transport Not Included'}
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${reservation.viewResponseDto.available ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                    {reservation.viewResponseDto.available ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    {reservation.viewResponseDto.available ? 'Available' : 'Not Available'}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200">
                    <UserCheck className="h-4 w-4" />
                    {reservation.viewResponseDto.availableSlots} slots available
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            {reservation.status === "CONFIRMED" && <button
              onClick={confirmReservation}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-10 disabled:cursor-not-allowed"
              disabled={reservation.status !== 'CONFIRMED' || isCallingPayment}
            >
              <Check className="h-4 w-4" />
              {isCallingPayment ? 'loading' : 'Make Payment'}
            </button>}
            <button
                onClick={window.print}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Print Reservation
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
            {/* <PayPalScriptProvider options={{ "client-id": "AXGnnyNkfxTWhMTgPhB7U5ovjMuuAFm2RdHWGkDZGloOZnm3HSr2ALmmM4t2QoH0qCjVf4l45v2_39s3" }}>
                    <h1>Pay with PayPal</h1>
                    <PaypalButton amount="100" />
            </PayPalScriptProvider> */}
        </div>
      </div>
    </TouristLayout>
  );
};

export default TouristReservation;
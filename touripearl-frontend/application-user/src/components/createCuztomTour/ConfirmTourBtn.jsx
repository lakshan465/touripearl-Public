import React from "react";
import FullBill from "./FullBill";
import { useLocation } from "react-router-dom";
import TouristLayout from "../user-layouts/TouristLayout.jsx";
import { useNavigate } from "react-router-dom";
import { SaveConfirmTour } from './SaveConfirmTour.js'

function ConfirmTourBtn() {
  const location = useLocation();
  const { guideData, tour } = location.state; // Extract guideData and tour from location state
  
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      // Call SaveConfirmTour using the data already available from location.state
      await SaveConfirmTour(guideData, tour); 
      // After saving the tour, navigate to the Payment Gateway page
      navigate("/customTourView/PaymentGateway");
    } catch (err) {
      console.error("Payment error:", err);
      // Optionally, you can show an error message here
    }
  };

  return (
    <TouristLayout>
      <div className="h-screen flex justify-center items-center bg-white dark:bg-gray-800 p-4">
        <div className="w-full max-w-4xl">
          <FullBill guideData={guideData} tour={tour} />
        </div>
        <div className="flex md:flex-row gap-8 justify-center items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <button 
            onClick={handlePayment}  // No need to pass data since it's already available
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 font-semibold text-lg"
          >
            Pay
          </button>
        </div>
      </div>
    </TouristLayout>
  );
}

export default ConfirmTourBtn;

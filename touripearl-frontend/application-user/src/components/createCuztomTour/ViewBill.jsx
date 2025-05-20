import React from "react";
import axios from "axios";
import FullBill from "./FullBill";
import { useLocation } from "react-router-dom";
import TouristLayout from "../user-layouts/TouristLayout.jsx";
import { SaveConfirmTour } from "./SaveConfirmTour.js";


function ViewBill() {
  const location = useLocation();
  const { guideData, tour } = location.state;
  const tot = tour.cost + guideData.margin + guideData.hotelCost + guideData.vehicleCost + guideData.visitTicketCost;

  const handlePayment = async () => {
    try {
      if (!tot || !tour?.tourId) {
        alert("Invalid payment details. Please check the tour data.");
        return;
      }

      // Optional: Save tour before payment
       await SaveConfirmTour(guideData, tour); 

      // Fetch PayPal payment link from backend using Axios
      const response = await axios.get(
        `${ "http://localhost:8085"}/api/payments/payForReservation`,
        {
          params: { amount: tot, reservationId: tour.tourId, customTour: true }, // Sending parameters in query string
        }
      );

      // Check if request was successful
      if (response.status === 201) {

        const approvalUrl = response.data.object;
        console.log(approvalUrl) // This should be the PayPal URL
        if (approvalUrl) {
          window.location.href = approvalUrl; // Redirect to PayPal approval URL
        } else {
          alert("Payment initiation failed: No approval URL returned.");
        }
      } else {
        alert("Payment initiation failed! Status code: " + response.status);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("An error occurred while processing payment: " + (error.response?.data?.message || error.message));
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
            onClick={handlePayment}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 font-semibold text-lg"
          >
            Pay
          </button>
        </div>
      </div>
    </TouristLayout>
  );
}

export default ViewBill;

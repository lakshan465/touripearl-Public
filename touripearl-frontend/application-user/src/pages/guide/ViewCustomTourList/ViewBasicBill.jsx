import React from "react";
import { useLocation } from "react-router-dom";
import GuideDashboard from "../Dashboard/GuideDashboard.jsx";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function ViewBasicBill() {
  const location = useLocation();
  const tour = location.state?.tour;
  const currentDate = new Date().toLocaleString();

  return (
    <GuideDashboard title={"Custom Tour Bill"}>
      <div className="min-h-screen bg-gray-900 p-8 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-700">Tour Invoice</h2>
            <Link
              to={{ pathname: `/guide/booking-management/oneTour` }}
              state={{ tour }}
            >
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
              </button>
            </Link>
          </div>

          <div className="space-y-4 text-lg text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Site Commission:</span>
              <span>${tour.basicCost}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Booking Ticket Service:</span>
              <span>${tour.bookingTicketService}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Guide Service:</span>
              <span>${tour.guideService}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Vehicle Service:</span>
              <span>${tour.vehicleService}</span>
            </div>

            <div className="flex justify-between text-xl font-bold text-green-600 border-t pt-4">
              <span>Total Cost:</span>
              <span>${tour.cost}</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Thank you for choosing TouriPearl</p>
            <p className="text-sm text-gray-500">Generated on: {currentDate}</p>
          </div>
        </div>
      </div>
    </GuideDashboard>
  );
}

export default ViewBasicBill;

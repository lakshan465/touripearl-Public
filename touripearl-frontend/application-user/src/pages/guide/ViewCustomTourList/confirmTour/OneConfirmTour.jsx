import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../../../admin/pages/GuideManagementPage/guideComponents/Loding2";
import toast from "react-hot-toast";
import GuideDashboard from "../../Dashboard/GuideDashboard.jsx";
import { ArrowLeft } from "lucide-react";

function OneConfirmTour() {
  const location = useLocation();
  const tour = location.state?.tour;
  const Navi = useNavigate();
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    console.log("Tour data:", tour);
    if (tour) {
      setApplication(tour);
    }
  }, [tour]);

  const currentDate = new Date().toLocaleDateString();

  return (
    <GuideDashboard title={"Selected Tour Details"}>
      <div className="min-h-screen bg-gray-800 shadow-md rounded-lg border border-gray-600 p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex justify-end">
          <Link to="/guide/booking-management/confirmTour">
            <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 transition duration-300 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          </Link>
        </div>

        {loading || !application ? (
          <Loader />
        ) : (
          <div className="space-y-4 text-lg text-gray-700">
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="space-y-4 text-lg text-gray-700">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Your Margin:</span>
                  <span>${application.marginc}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Hotel Cost:</span>
                  <span>${application.hotelCostc}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Visit Ticket Cost:</span>
                  <span>${application.visitTicketCostc}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Vehicle Cost:</span>
                  <span>${application.vehicleCostc}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Guide Service:</span>
                  <span>${application.guideServicec}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Booking Ticket Service:</span>
                  <span>${application.bookingTicketServicec}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-green-600 border-t pt-4">
                  <span>Your Total Gain:</span>
                  <span>${application.costc - 1000}</span>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">Thank you for choosing TouriPearl</p>
                  <p className="text-sm text-gray-500">Generated on: {currentDate}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-300">
              <p><strong>Start Date:</strong> {application.startDatec}</p>
              <p><strong>End Date:</strong> {application.endDatec}</p>
              <p><strong>Travelers:</strong> {application.travelersc}</p>
              <p><strong>Pickup Location:</strong> {application.pickupLocationc}</p>
              <p><strong>Languages:</strong> {application.languagec?.join(", ")}</p>
              <p><strong>Places to Visit:</strong> {application.placesToVisitc?.join(", ")}</p>
              <p><strong>Activities:</strong> {application.activitiesc?.join(", ")}</p>
              <p><strong>Special Attractions:</strong> {application.specialAttractionsc?.join(", ")}</p>
              <p><strong>Accommodation Type:</strong> {application.accommodationTypec}</p>
              <p><strong>Transport:</strong> {application.transportc}</p>
              <p><strong>Accommodation:</strong> {application.accommodationc ? "Yes" : "No"}</p>
              <p><strong>Guide With Vehicle:</strong> {application.guideWithVehiclec ? "Yes" : "No"}</p>
              <p><strong>Experience Level:</strong> {application.experienceLevelc || "N/A"}</p>
              <p><strong>Gender Preference:</strong> {application.genderPreferencec}</p>
              <p><strong>Specialized Guide:</strong> {application.specializedGuidec || "N/A"}</p>
              <p><strong>Upon Arrival:</strong> {application.uponArrivalc ? "Yes" : "No"}</p>
              <p><strong>Accessibility:</strong> {application.accessibilityc || "N/A"}</p>
              <p><strong>Custom Requests:</strong> {application.customRequestsc || "N/A"}</p>
            </div>
          </div>
        )}
      </div>
    </GuideDashboard>
  );
}

export default OneConfirmTour;

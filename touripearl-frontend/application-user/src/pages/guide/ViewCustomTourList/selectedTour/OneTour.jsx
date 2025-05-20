import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../../../admin/pages/GuideManagementPage/guideComponents/Loding2";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import GuideDashboard from "../../Dashboard/GuideDashboard.jsx";
import { ArrowLeft } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";

function OneTour() {
  const location = useLocation();
  const tour = location.state?.tour;
  const Navi = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  const tourid = tour?.tourId || "";

  const fetchTourData = async () => {
    try {
      if (tourid === "") {
        Navi("/guide/booking-management");
        toast.error("Bad Request!");
        return;
      }

      setLoading(true);
      const response = await axios.get(
        `http://localhost:8085/api/v1/guide/selectedTour/${tourid}`
      );
      setApplication(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch tour data");
    }
  };

  useEffect(() => {
    fetchTourData();
  }, []);

  if (!application) {
    return <p>No tour data available</p>;
  }

  const currentDate = new Date().toLocaleDateString();

  return (
    <GuideDashboard title={"Selected Tour List"}>
      <div className="min-h-screen bg-gray-800 shadow-md rounded-lg border border-gray-600 p-6 max-w-4xl mx-auto space-y-4">
        <div className=" top-0 right-0 z-10 flex justify-end">
          <Link to="/guide/booking-management/selectedTour">
            <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring focus:ring-blue-300 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-4 text-lg text-gray-700">
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="space-y-4 text-lg text-gray-700">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Your Margin:</span>
                  <span>${tour.margin}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Hotel Cost:</span>
                  <span>${tour.hotelCost}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Visit Ticket Cost:</span>
                  <span>${tour.visitTicketCost}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Vehicle Cost:</span>
                  <span>${tour.vehicleCost}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Guide Service:</span>
                  <span>${application.guideService}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Booking Ticket Service:</span>
                  <span>${application.bookingTicketService}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-green-600 border-t pt-4">
                  <span>Your Total Gain:</span>
                  <span>${application.cost - 1000}</span>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">Thank you for choosing TouriPearl</p>
                  <p className="text-sm text-gray-500">Generated on: {currentDate}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-300">
              <p>
                <span className="font-semibold text-gray-200">Start Date:</span>{" "}
                {application.startDate}
              </p>
              <p>
                <span className="font-semibold text-gray-200">End Date:</span>{" "}
                {application.endDate}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Travelers:</span>{" "}
                {application.travelers}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Pickup Location:</span>{" "}
                {application.pickupLocation}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Languages:</span>{" "}
                {application.language?.join(", ")}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Places to Visit:</span>{" "}
                {application.placesToVisit?.join(", ")}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Activities:</span>{" "}
                {application.activities?.join(", ")}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Special Attractions:</span>{" "}
                {application.specialAttractions?.join(", ")}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Accommodation Type:</span>{" "}
                {application.accommodationType}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Transport:</span>{" "}
                {application.transport}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Accommodation:</span>{" "}
                {application.accommodation ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Guide With Vehicle:</span>{" "}
                {application.guideWithVehicle ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Experience Level:</span>{" "}
                {application.experienceLevel}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Gender Preference:</span>{" "}
                {application.genderPreference}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Specialized Guide:</span>{" "}
                {application.specializedGuide}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Upon Arrival:</span>{" "}
                {application.upon_arrival ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Accessibility:</span>{" "}
                {application.accessibility}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Custom Requests:</span>{" "}
                {application.customRequests}
              </p>
            </div>
          </div>
        )}
      </div>
    </GuideDashboard>

  );
}

export default OneTour;

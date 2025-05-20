import React from "react";
import { useLocation, Link } from "react-router-dom";
import TouristLayout from "../user-layouts/TouristLayout.jsx";
import { ArrowLeft } from "lucide-react";

function ViewOneTour() {
  const location = useLocation();
  const tour = location.state?.tour;

  console.log(tour);

  if (!tour) {
    return (
      <div className="text-center text-xl text-red-500 py-20">
        No tour data available
      </div>
    );
  }

  return (
    <TouristLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
        {/* Tour Title */}
        <br />
        <br />
        <div className="text-center text-4xl font-bold text-white mb-10">
          <h2 className="mb-2">Tour Details</h2>
          <h3 className="text-lg font-semibold text-blue-300">
            This Tour Basic Cost: ${tour.cost}
          </h3>
        </div>

        {/* Tour Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
          {/* Boolean Fields */}
          {[
            { label: "Accommodation Needed", value: tour.accommodation },
            { label: "Guide with Vehicle", value: tour.guideWithVehicle },
            {
              label: "Guide Needs to Book Ticket",
              value: tour.guideNeedToBookTicket,
            },
            { label: "Upon Arrival", value: tour.upon_arrival },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                item.value ? "bg-green-700" : "bg-red-700"
              } shadow-md text-white text-lg text-center transition-all hover:scale-105`}
            >
              <span className="font-semibold block mb-2">{item.label}</span>
              {item.value ? "Yes" : "No"}
            </div>
          ))}

          {/* Normal Fields */}
          {[
            { label: "Start Date", value: tour.startDate },
            { label: "End Date", value: tour.endDate },
            { label: "Travelers", value: tour.travelers },
            { label: "Pickup Location", value: tour.pickupLocation },
            { label: "Languages", value: tour.language?.join(", ") },
            { label: "Places to Visit", value: tour.placesToVisit?.join(", ") },
            { label: "Activities", value: tour.activities?.join(", ") },
            {
              label: "Special Attractions",
              value: tour.specialAttractions?.join(", "),
            },
            { label: "Accommodation Type", value: tour.accommodationType },
            { label: "Transport", value: tour.transport },
            { label: "Gender Preference", value: tour.genderPreference },
            { label: "Accessibility", value: tour.accessibility },
            { label: "Tourist ID", value: tour.touristId },
            { label: "Custom Requests", value: tour.customRequests },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 shadow-md text-center hover:scale-105 transition-all"
            >
              <span className="text-sm font-semibold text-gray-400 block mb-2">
                {item.label}
              </span>
              <p className="text-lg break-words">{item.value || "N/A"}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link to="/customTourView">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg">
              Back to Tours List <ArrowLeft className="inline w-5 h-5 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </TouristLayout>
  );
}

export default ViewOneTour;

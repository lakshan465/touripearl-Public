import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../../admin/pages/GuideManagementPage/guideComponents/Loding2";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import GuideDashboard from "../Dashboard/GuideDashboard.jsx";
import { ArrowLeft } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
function ViewOneTour() {
  //const { tourid } = useParams();

  const location = useLocation();
  const tour = location.state?.tour; // Get tour data from state
  const Navi = useNavigate();
  const [margin, setMargin] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMarginThere, setIsMarginThere] = useState("");
  const [inputMargin, setInputMargin] = useState("");
  const [vehicleCost, setVehicleCost] = useState("");
  const [hotelCost, setHotelCost] = useState("");
  const [visitTicketCost, setVisitTicketCost] = useState("");

  const tourid = tour?.tourId || "";
  //const guideId = "118"; //use while production & dont remove this code line
  const guideId = Cookies.get("UUID"); //use this when it presentaing

  const fetchMargin = async () => {
    try {
      console.log(tour);
      if (tourid == "") {
        Navi("/guide/booking-management");
        toast.error("Bad Request!");
        return;
      }

      setLoading(true);
      const response = await axios.get(
        "http://localhost:8085/api/v1/guide/getOneTourMargin",
        {
          params: {
            guideId: guideId, // The guideId you're passing
            tourId: tourid, // The tourId you're passing
          },
        }
      );
      console.log(response.data);
      setMargin(response.data);
      //margin?setIsMarginThere(true):setIsMarginThere(false);
      //console.log(isMarginThere)

      setTimeout(() => {
        setLoading(false); //simulation
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };
  // Track changes to the `margin` state using `useEffect`
  useEffect(() => {
    if (margin > 0) {
      console.log("Margin updated:", margin);
      setIsMarginThere(true); // Set isMarginThere to true
    } else {
      setIsMarginThere(false); // Set it to false if no margin
    }
    setLoading(false); // Hide loading after margin is fetched
  }, [margin]); // Runs when margin changes

  const click = async () => {
    setMargin(inputMargin);
    if (!inputMargin) {
      toast.error("Enter Margin First!");
      return;
    }

    try {
      setIsMarginThere(true);
      const response = await axios.post(
        "http://localhost:8085/api/v1/guide/saveTourMargin",
        {
          guideId,
          tourId: tourid,
          margin: parseFloat(inputMargin),
          vehicleCost: vehicleCost,
          hotelCost: hotelCost,
          visitTicketCost: visitTicketCost,
        }
      );

      // Set the margin only if the save was successful
      setMargin(response.data.margin);
      fetchMargin();
      setMargin("");
      setInputMargin("");
      toast.success("Submitted successfully!");
    } catch (e) {
      console.log(e);
      alert("Failed to save margin");
    }
  };

  useEffect(() => {
    fetchMargin();
  }, [guideId, tourid]);

  if (!tour) {
    return <p>No tour data available</p>;
  }
  return (
    <GuideDashboard title={"Custom Tour List"}>
      <div className="min-h-screen bg-gray-800 shadow-md rounded-lg border border-gray-600 p-6 max-w-4xl mx-auto space-y-4">
        <div className="sticky top-0 right-0 z-10 flex justify-end">
          {" "}
          {/* Sticky + aligned to the right */}
          <Link to="/guide/booking-management">
            <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring focus:ring-blue-300 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> {/* Back icon */}
              Back
            </button>
          </Link>
        </div>
        <div className="flex items-center space-x-8 justify-center text-center">
  {/* Amount You Gain */}
  <p className="flex flex-col items-center">
    <span className="text-lg font-semibold text-gray-200">
      Amount You Gain From This Tour
    </span>
    <span className="text-3xl font-extrabold text-green-500 p-2 rounded-md shadow-lg hover:shadow-2xl inline-block">
      ${tour.cost - 1000}
    </span>
  </p>

  {/* Divider Line */}
  <div className="w-px bg-gray-500 h-16"></div> {/* Vertical Line */}

  {/* Show Billing Button */}
  <Link
    to={{ pathname: `/guide/booking-management/bill` }}
    state={{ tour }} // Pass tour data
  >
    <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-300">
      <span className="mr-2">Show Billing</span>
      <FaArrowRight className="w-5 h-5" />
    </button>
  </Link>
</div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-300">
          <p>
            <span className="font-semibold text-gray-200">Start Date:</span>{" "}
            {tour.startDate}
          </p>
          <p>
            <span className="font-semibold text-gray-200">End Date:</span>{" "}
            {tour.endDate}
          </p>
          <p>
            <span className="font-semibold text-gray-200">Travelers:</span>{" "}
            {tour.travelers}
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Pickup Location:
            </span>{" "}
            {tour.pickupLocation}
          </p>
          <p>
            <span className="font-semibold text-gray-200">Languages:</span>{" "}
            {tour.language?.join(", ")}
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Places to Visit:
            </span>{" "}
            {tour.placesToVisit?.join(", ")}
          </p>
          <p>
            <span className="font-semibold text-gray-200">Activities:</span>{" "}
            {tour.activities?.join(", ")}
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Special Attractions:
            </span>{" "}
            {tour.specialAttractions?.join(", ")}
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Accommodation Type:
            </span>{" "}
            {tour.accommodationType}
          </p>
          <p>
            <span className="font-semibold text-gray-200">Transport:</span>{" "}
            {tour.transport}
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Accommodation Needed:
            </span>
            <span
              className={tour.accommodation ? "text-green-500" : "text-red-500"}
            >
              {tour.accommodation ? "Yes" : "No"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Guide with Vehicle:
            </span>
            <span
              className={
                tour.guideWithVehicle ? "text-green-500" : "text-red-500"
              }
            >
              {tour.guideWithVehicle ? "Yes" : "No"}
            </span>
          </p>

          <p>
            <span className="font-semibold text-gray-200">
              Experience Level:
            </span>{" "}
            {tour.experienceLevel}
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Gender Preference:
            </span>{" "}
            {tour.genderPreference}
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Specialized Guide:
            </span>{" "}
            {tour.specializedGuide}
          </p>
          <p>
            <span className="font-semibold text-gray-200">Upon Arrival:</span>{" "}
            {tour.upon_arrival ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold text-gray-200">Accessibility:</span>{" "}
            {tour.accessibility}
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Custom Requests:
            </span>{" "}
            {tour.customRequests}
          </p>
          <p>
            <span className="font-semibold text-gray-200">Tourist ID:</span>{" "}
            {tour.touristId}
          </p>
          <p>
            <span className="font-semibold text-gray-200">
              Guide Needs to Book Ticket:
            </span>
            <span
              className={
                tour.guideNeedToBookTicket ? "text-green-500" : "text-red-500"
              }
            >
              {tour.guideNeedToBookTicket ? "Yes" : "No"}
            </span>
          </p>
        </div>

        <div className="mt-4 flex justify-center items-center">
          {loading ? (
            <Loader />
          ) : !isMarginThere ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg shadow-lg">
              <input
                type="number"
                placeholder="Your Additional Margin"
                value={inputMargin}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputMargin(value !== "" ? parseFloat(value) : ""); // Handle empty input case
                }}
                className=" text-gray-800 border border-gray-400 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />

              <input
                type="number"
                placeholder="Vehicle Cost"
                value={vehicleCost}
                onChange={(e) => setVehicleCost(e.target.value)}
                className=" text-gray-800 border border-gray-400 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <input
                type="number"
                placeholder="Hotel Cost"
                value={hotelCost}
                onChange={(e) => setHotelCost(e.target.value)}
                className="text-gray-800 border border-gray-400 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <input
                type="number"
                placeholder="Ticket Cost"
                value={visitTicketCost}
                onChange={(e) => setVisitTicketCost(e.target.value)}
                className=" text-gray-800 border border-gray-400 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <div className="md:col-span-2 flex justify-center">
                <button
                  onClick={click}
                  className=" bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full md:w-auto"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center mt-4 text-gray-300">
              <span className="block text-lg font-semibold text-gray-200">
                <span className="text-xl font-bold text-green-500">
                  Your Margin :
                </span>
              </span>
              <span className="block text-3xl font-extrabold text-white mt-2">
                ${margin}
              </span>
            </p>
          )}
        </div>
      </div>
    </GuideDashboard>
  );
}

export default ViewOneTour;

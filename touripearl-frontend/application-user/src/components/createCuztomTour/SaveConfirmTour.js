import axios from "axios";
import _ from "lodash";
import _get from 'lodash/get';



export const SaveConfirmTour = async (guideData, tour) => {
  //console.log("Tour Saved ✅");


  const selectedData = {
    ..._.pick(tour,["accessibility","accommaodationService","accommodation","accommodationType"]),
    activities:_.get(tour,"activities",[]),
    ..._.pick(tour,["basicCost","bookingTicketService","cost","endDate","genderPreference","guideNeedToBookTicket","guideService","guideWithVehicle"]),
    language:_get(tour,"language",[]),
    ..._.pick(tour,"pickupLocation","startDate","tourId","touristId","transport","travelers","upon_arrival","vehicleService"),
    placesToVisit:_get(tour,"placesToVisit",[]),
    specialAttractions:_get(tour,"specialAttractions",[]),
    ..._.pick(guideData,["guideId","hotelCost","margin","profilePictureUrl","starMean","vehicleCost","visitTicketCost"])
  }
  console.log(selectedData)

  try {
    const response = await axios.post(`http://localhost:8085/api/v1/tourists/customTourConfirm/${tour.tourId}`, {
      selectedData
    }, 
    );

    console.log("Response:", response.data);
  } catch (err) {
    console.error("Error:", err);
  }
};
import { CloudCog } from "lucide-react";
import React from "react";

function FullBill({ guideData, tour }) {
  const currentDate = new Date().toLocaleString();


  return (
    <div className="p-6 w-full flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-700">Tour Invoice</h2>
        </div>

        <div className="space-y-3 text-base text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Basic Cost:</span>
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

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Accommodation Service:</span>
            <span>${tour.accommaodationService}</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-green-600 border-t pt-4">
            <span>Total Tour Cost You Created:</span>
            <span>${tour.cost}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Guide Margin:</span>
            <span>${guideData.margin}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Hotel Accommodation Cost:</span>
            <span>${guideData.hotelCost}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Vehicle Cost:</span>
            <span>${guideData.vehicleCost}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Visit Ticketing Cost:</span>
            <span>${guideData.visitTicketCost}</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-green-600 border-t pt-4">
            <span>Total Amount You Need to Pay:</span>
            <span>
              ${tour.cost + guideData.margin + guideData.hotelCost + guideData.vehicleCost + guideData.visitTicketCost}
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Thank you for choosing TouriPearl</p>
          <p className="text-sm text-gray-500">Generated on: {currentDate}</p>
        </div>
      </div>
    </div>
  );
}

export default FullBill;

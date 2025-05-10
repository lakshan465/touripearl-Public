import React, { useState } from "react";
import TouristLayout from "../user-layouts/TouristLayout.jsx";

function PaymentGateway() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process payment logic here
    console.log("Payment Submitted", { cardNumber, expiryDate, cvv, nameOnCard });
  };

  return (
    
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">Payment Details</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Card Details */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="cardNumber" className="text-sm text-gray-600">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                placeholder="**** **** **** ****"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-2 p-3 border rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                maxLength="19"
                required
              />
            </div>

            {/* Expiry Date & CVV */}
            <div className="flex space-x-4">
              <div className="flex flex-col w-1/2">
                <label htmlFor="expiryDate" className="text-sm text-gray-600">Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="mt-2 p-3 border rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  maxLength="5"
                  required
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label htmlFor="cvv" className="text-sm text-gray-600">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="***"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="mt-2 p-3 border rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            {/* Name on Card */}
            <div className="flex flex-col">
              <label htmlFor="nameOnCard" className="text-sm text-gray-600">Name on Card</label>
              <input
                type="text"
                id="nameOnCard"
                placeholder="John Doe"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                className="mt-2 p-3 border rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Payment Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Pay Now
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentGateway;

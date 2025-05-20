import React from "react";

const Step3AccommodationTransport = ({ formData, handleChecked, handleChange }) => {
  return (
    <>
      {/* Input for accommodation (user can type custom option) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium dark:text-gray-300">
          Accommodation
        </label>
        <input
          type="text"
          name="accommodationType"
          placeholder="E.g., Hotel, Homestay"
          value={formData.accommodationType || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <small className="text-gray-500 mt-1 block dark:text-gray-400">
          Enter the type of accommodation you prefer for your tour (e.g., Hotel, Homestay).
        </small>
      </div>

      {/* Input for transport options (user can type custom transport options) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium dark:text-gray-300">
          Transport
        </label>
        <input
          type="text"
          name="transport"
          placeholder="E.g., Car, Van"
          value={formData.transport || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <small className="text-gray-500 mt-1 block dark:text-gray-400">
          Enter the transport options you'd like to include (e.g., Car, Van).
        </small>
      </div>

      {/* Input for guide with vehicle */}
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="accommodation"
            checked={!!formData.accommodation}
            onChange={handleChecked}
            className="form-checkbox h-5 w-5 text-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <span className="ml-2 dark:text-gray-300">
            Select this option if you would like a guide to book accommodation for you
          </span>
        </label>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="guideWithVehicle"
            checked={!!formData.guideWithVehicle}
            onChange={handleChecked}
            className="form-checkbox h-5 w-5 text-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <span className="ml-2 dark:text-gray-300">
            Select this option if you want a guide with a vehicle included for your tour
          </span>
        </label>
      </div>
    </>
  );
};

export default Step3AccommodationTransport;

import React from "react";

const Step6AdditionalRequests = ({ formData, setFormData, handleChange }) => {
  return (
    <>
      <textarea
        name="accessibility"
        placeholder="Accessibility Requirements"
        value={formData.accessibility || ""}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <textarea
        name="customRequests"
        placeholder="Custom Requests"
        value={formData.customRequests || ""}
        onChange={handleChange}
        className="w-full p-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
    </>
  );
};

export default Step6AdditionalRequests;

import React from "react";

const Step1BasicDetails = ({
  formData,
  handleChange,
  setFormData,
  handleMultiSelectChange,
}) => {
  return (
    <>
    {/* Input for tour title */}
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 font-medium">Tour Title</label>
      <input
        name="title"
        placeholder="Enter tour title"
        value={formData.title || ""} 
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <small className="text-gray-500 dark:text-gray-400 mt-1 block">Enter the title of the tour, e.g., "Sri Lanka Adventure".</small>
    </div>
  
    {/* Input for tour description */}
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 font-medium">Tour Description</label>
      <textarea
        name="description"
        placeholder="Enter tour description"
        value={formData.description|| ""}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <small className="text-gray-500 dark:text-gray-400 mt-1 block">Provide a brief description of the tour and what it offers.</small>
    </div>
  
    {/* Input for start date & end date */}
    <div className="mb-4 grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-medium">Start Date</label>
        <input
          type="datetime-local"
          name="startDate"
          value={formData.startDate|| ""} 
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <small className="text-gray-500 dark:text-gray-400 mt-1 block">Select the starting date and time of the tour.</small>
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-medium">End Date</label>
        <input
          type="datetime-local"
          name="endDate"
          value={formData.endDate|| ""} 
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <small className="text-gray-500 dark:text-gray-400 mt-1 block">Select the ending date and time of the tour.</small>
      </div>
    </div>
  
    {/* Input for number of travelers */}
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 font-medium">Number of Travelers</label>
      <input
        type="number"
        name="travelers"
        placeholder="Enter number of travelers"
        value={formData.travelers|| ""} 
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <small className="text-gray-500 dark:text-gray-400 mt-1 block">Specify the number of people in the group.</small>
    </div>
  
    {/* Input for pickup location */}
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 font-medium">Pickup Location</label>
      <input
        name="pickupLocation"
        placeholder="Enter pickup location (e.g., Bandaranayake International Airport)"
        value={formData.pickupLocation|| ""} 
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <small className="text-gray-500 dark:text-gray-400 mt-1 block">Enter the location where the travelers will be picked up.</small>
    </div>
  
    {/* Input for preferred languages */}
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 font-medium">Preferred Languages</label>
      <input
        name="language"
        placeholder="Enter languages (comma-separated) e.g., English, German, Spanish"
        value={formData.language ? formData.language.join(", ") : ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            language: e.target.value.split(",").map((lang) => lang.trim()),
          })
        }
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <small className="text-gray-500 dark:text-gray-400 mt-1 block">Enter the languages preferred by the travelers, separated by commas.</small>
    </div>
  </>
  

  );
};

export default Step1BasicDetails;

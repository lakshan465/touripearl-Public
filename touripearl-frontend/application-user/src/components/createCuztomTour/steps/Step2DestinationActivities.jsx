import React from "react";

const Step2DestinationActivities = ({
  formData,
  handleMultiSelectChange,
  setFormData,
  handleChange,
}) => {
  return (
    <>
      {/* Input for places to visit (user can type custom places) */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium">
          Places to Visit
        </label>
        <input
          name="placesToVisit"
          placeholder="E.g., Sigiriya, Ella, Yala"
          value={formData.placesToVisit || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              placesToVisit: e.target.value
                .split(",")
                .map((place) => place.trim()),
            })
          }
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <small className="text-gray-500 dark:text-gray-400 mt-1 block">
          Enter the places you want to visit, separated by commas.
        </small>
      </div>

      {/* Input for activities (user can type custom activities) */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium">Activities</label>
        <input
          name="activities"
          placeholder="E.g., Hiking, Cultural Tours"
          value={formData.activities || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              activities: e.target.value
                .split(",")
                .map((activity) => activity.trim()),
            })
          }
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <small className="text-gray-500 dark:text-gray-400 mt-1 block">
          Enter the activities you’d like to do, separated by commas.
        </small>
      </div>

      {/* Input for special attractions */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium">
          Special Attractions
        </label>
        <input
          name="specialAttractions"
          placeholder="E.g., Ancient Temples, Wildlife Safari"
          value={formData.specialAttractions || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              specialAttractions: e.target.value
                .split(",")
                .map((specialAttractions) => specialAttractions.trim()),
            })
          }
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <small className="text-gray-500 dark:text-gray-400 mt-1 block">
          Enter any special attractions you wish to include in your tour.
        </small>
      </div>

      {/* Input for tour type (user can type custom tour type) */}
      {/* <div className="mb-4">
        <label className="block text-gray-700 font-medium">Tour Type</label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tourType"
              value="Private"
              onChange={handleChange}
              className="form-radio h-5 w-5 text-blue-500"
            />
            <span className="ml-2">Private Tour</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tourType"
              value="Group"
              onChange={handleChange}
              className="form-radio h-5 w-5 text-blue-500"
            />
            <span className="ml-2">Group Tour</span>
          </label>
        </div>
        <small className="text-gray-500 mt-1 block">
          Select whether the tour is a private or group tour.
        </small>
      </div> */}
    </>
  );
};

export default Step2DestinationActivities;

import React from "react";

const Step4GuideRequirements = ({ formData, handleChecked, handleChange }) => {
  return (
    <>
      {/* Input for experience level (user can type custom level) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium dark:text-gray-300">
          Have you traveled to this place before?,If so how many times
        </label>
        <input
          type="text"
          name="experienceLevel"
          placeholder="E.g., Beginner, Intermediate, Expert"
          value={formData.experienceLevel || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <small className="text-gray-500 mt-1 block dark:text-gray-400">
          Enter your experience level (e.g., Beginner, Intermediate, Expert).
        </small>
      </div>

      {/* Input for gender preference (user can type custom preference) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium dark:text-gray-300">
          Gender Preference
        </label>
        <input
          type="text"
          name="genderPreference"
          placeholder="E.g., Any, Male, Female"
          value={formData.genderPreference || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <small className="text-gray-500 mt-1 block dark:text-gray-400">
          Enter your gender preference (e.g., Any, Male, Female).
        </small>
      </div>

      {/* Input for specialized guide preferences (user can type custom specialties) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium dark:text-gray-300">
          Specialized Guide
        </label>
        <input
          type="text"
          name="specializedGuide"
          placeholder="E.g., Wildlife Expert, Hiking Specialist"
          value={formData.specializedGuide || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <small className="text-gray-500 mt-1 block dark:text-gray-400">
          Enter any specialized guide preferences (e.g., Wildlife Expert, Hiking Specialist).
        </small>
      </div>

      {/* Input for local cuisine experience (checkbox to text) */}
      {/* guideNeedToBookTicket */}
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="upon_arrival"
            checked={!!formData.upon_arrival}
            onChange={handleChecked}
            className="form-checkbox h-5 w-5 text-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <span className="ml-2 dark:text-gray-300">
            Select this option if you prefer to buy the ticket upon arrival
          </span>
        </label>
        <small className="text-gray-500 mt-1 block dark:text-gray-400">
          The site recommends selecting this option.
        </small>
      </div>

      {/* guideNeedToBookTicket */}
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="guideNeedToBookTicket"
            checked={!!formData.guideNeedToBookTicket}
            onChange={handleChecked}
            className="form-checkbox h-5 w-5 text-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <span className="ml-2 dark:text-gray-300">
            Select this option if you prefer to book ticket buy guide for you
          </span>
        </label>
        {/* <small className="text-gray-500 mt-1 block">The site recommends selecting this option.</small> */}
      </div>
    </>
  );
};

export default Step4GuideRequirements;

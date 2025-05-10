import React from "react";

const Step5BudgetPayment = ({ formData, setFormData, handleChange }) => {
  return (
    <>
      <input
        type="number"
        name="budget"
        placeholder="Expected Budget"
        value={formData.budget}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <select
        name="paymentMethod"
        value={formData.paymentMethod || ""}
        onChange={handleChange}
        className="w-full p-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        <option value="Online">Online</option>
        <option value="Cash">Cash</option>
        <option value="Card">Card</option>
      </select>
    </>
  );
};

export default Step5BudgetPayment;

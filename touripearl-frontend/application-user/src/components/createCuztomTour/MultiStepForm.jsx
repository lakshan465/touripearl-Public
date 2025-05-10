import React, { useState } from "react";
import axios from "axios";
import Step1BasicDetails from "./steps/Step1BasicDetails";
import Step2DestinationActivities from "./steps/Step2DestinationActivities";
import Step3AccommodationTransport from "./steps/Step3AccommodationTransport";
import Step4GuideRequirements from "./steps/Step4GuideRequirements";
import Step5BudgetPayment from "./steps/Step5BudgetPayment";
import Step6AdditionalRequests from "./steps/Step6AdditionalRequests";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../pages/admin/pages/GuideManagementPage/guideComponents/Loding2";
import axiosFetch from "../../utils/axiosFetch.js";
import TouristLayout from "../user-layouts/TouristLayout.jsx";
const steps = [
  Step1BasicDetails,
  Step2DestinationActivities,
  Step3AccommodationTransport,
  Step4GuideRequirements,
  Step5BudgetPayment,
  Step6AdditionalRequests,
];

const MultiStepForm = () => {
  const Navi = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleChecked = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleMultiSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData({ ...formData, [e.target.name]: selectedValues });
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1), console.log(formData);
      console.log(JSON.stringify(formData, null, 2));
  };
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit =() => {

    toast.promise(
        async()=>{
          setLoading(true);
          await axiosFetch.post(
          "api/v1/tourists/cuzTour",
          { ...formData }
          
      );
      Navi(`/home`);
    },{
        loading: 'Creating Custom Tour...',
        success: 'Custom Tour Created Successfully',
        error: 'Failed to create Custom Tour'
        }
    );
    setLoading(false);
  };

  const StepComponent = steps[currentStep];

  return (
    <TouristLayout>
      <div className="relative max-w-full mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 shadow-md">
        <div>
          {loading && (
            <div className="flex justify-center items-center h-screen">
              <Loading />
            </div>
          )}
        </div>

        {!loading && (
          <div>
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center w-full">
                  {/* Step Circle */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-semibold
                      ${
                        index === currentStep
                          ? "bg-blue-500 text-white"
                          : index < currentStep
                          ? "bg-blue-400 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }
                    `}
                  >
                    {index < currentStep ? "✔" : index + 1}
                  </div>

                  {/* Connecting Line (Hide on Last Step) */}
                  {index < steps.length - 1 && (
                    <div
                      className="flex-grow h-1 mx-2 bg-gray-300 dark:bg-gray-600 transition-all duration-300"
                      style={{
                        backgroundColor:
                          index < currentStep ? "#3B82F6" : "#D1D5DB",
                      }} // Tailwind colors for smooth effect
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step Component */}
            <StepComponent
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
              handleMultiSelectChange={handleMultiSelectChange}
              handleChecked={handleChecked}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-500 dark:hover:bg-gray-700 transition"
                >
                  Previous
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </TouristLayout>
  );
};

export default MultiStepForm;

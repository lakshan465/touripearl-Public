import React from "react";
import { useLocation } from "react-router-dom";
import TouristLayout from "../user-layouts/TouristLayout.jsx";<TouristLayout></TouristLayout>
import { useParams, useNavigate, Link } from "react-router-dom";

function GuideFullDetail() {
  const location = useLocation();
  const guideData = location.state?.tour;
  const tour = location.state?.tour2;
  if (!guideData) {
    return <div>No Guide Data Available</div>;
  }

  return (
    <TouristLayout>
      <div className="relative max-w-full mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Link   to={{ pathname: `/customTourView/ViewBill` }} state={{ guideData,tour }}  className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 font-semibold text-lg">
            View Bill
          </Link>

          <div className="text-center">
            <img
              src={guideData.profilePictureUrl}
              alt={`${guideData.firstname} ${guideData.lastname}`}
              className="w-40 h-40 rounded-full mx-auto border-4 border-blue-500 shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-2xl"
            />
            <h2 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white tracking-wide">
              {guideData.firstname} {guideData.lastname}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
              {guideData.nationality}
            </p>
            <p className="text-blue-500 font-medium text-lg uppercase">
              {guideData.gender}
            </p>
          </div>

          <Link to={{ pathname: `/customTourView/ViewBill` }} state={{ guideData,tour }}  className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 font-semibold text-lg">
            Confirm This Tour
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              Star Rating
            </h3>
            {guideData.starMean === 0 ? (
              <p className="text-gray-500">No review yet</p>
            ) : (
              Array.from(
                { length: Math.round(guideData.starMean) },
                (_, index) => (
                  <span key={index} className="text-yellow-500 text-xl">
                    ★
                  </span>
                )
              )
            )}
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-blue-600">Languages</h3>
            {guideData.languages.map((lang, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                {lang.languageName} - {lang.languageLevel}
              </p>
            ))}
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              Working Areas
            </h3>
            {guideData.workingAreas.map((area, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                {area}
              </p>
            ))}
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              Working Days
            </h3>
            {guideData.workingDays.map((day, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                {day}
              </p>
            ))}
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-lg col-span-2">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              License Status
            </h3>
            <p
              className={`text-lg ${
                guideData.hasLicense ? "text-green-500" : "text-red-500"
              }`}
            >
              {guideData.hasLicense ? "Has License" : "No License"}
            </p>
          </div>
        </div>
      </div>
    </TouristLayout>
  );
}

export default GuideFullDetail;

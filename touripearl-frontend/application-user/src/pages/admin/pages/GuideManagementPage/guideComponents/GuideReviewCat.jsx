import React from "react";

function GuideReviewCat({ application }) {
  return (
    <div className="bg-gray-800 shadow-md rounded-lg border border-gray-600 p-6 max-w-4xl mx-auto space-y-4">
      <p className="text-2xl font-bold text-white mb-4">
        Guide Application Id:{" "}
        <span className="text-blue-600">{application.guideApplicationId}</span>
      </p>
      <p className="text-lg font-medium text-gray-300">
        <span className="font-semibold text-gray-200">Name:</span>{" "}
        {application.firstname} {application.lastname}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Email:</span>{" "}
        {application.email}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Phone:</span>{" "}
        {application.phone}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Have License:</span>{" "}
        <span
          className={application.hasLicense ? "text-green-500" : "text-red-500"}
        >
          {application.hasLicense ? "YES" : "NO"}
        </span>
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Need License:</span>{" "}
        <span
          className={
            application.needLicense ? "text-green-500" : "text-red-500"
          }
        >
          {application.needLicense ? "YES" : "NO"}
        </span>
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Address:</span>{" "}
        {application.address}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Postal Code:</span>{" "}
        {application.postal_code}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Country:</span>{" "}
        {application.country}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Area:</span>{" "}
        {application.area}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Nationality:</span>{" "}
        {application.nationality}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Birthday:</span>{" "}
        {new Date(application.birthday).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Languages:</span>{" "}
        {application.applicationLanguages &&
        application.applicationLanguages.length > 0
          ? application.applicationLanguages.map((lang, index) => (
              <span key={index}>
                {lang.languageName} ({lang.languageLevel})
                {index < application.applicationLanguages.length - 1 && ", "}
              </span>
            ))
          : "No languages specified"}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Working Areas:</span>{" "}
        {application.workingAreas && application.workingAreas.length > 0
          ? application.workingAreas.join(", ")
          : "No Working Areas specified"}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Working Days:</span>{" "}
        {application.workingDays && application.workingDays.length > 0
          ? application.workingDays.join(", ")
          : "No Working Days specified"}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Gender:</span>{" "}
        {application.gender}
      </p>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Extra Info:</span>{" "}
        {application.extra_info}
      </p>{" "}
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Biography:</span>{" "}
        {application.biography}
      </p>
      <div className="text-lg text-gray-300">
  <span className="font-semibold text-gray-200">Application Images:</span>{" "}<br/><br/>
  {application.applicationImages && application.applicationImages.length > 0
    ? (
        <div className="flex space-x-4">
          {application.applicationImages.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={image.resourceUrl}
                alt={`Image ${index + 1}`}
                className="w-54 h-34 object-cover rounded-lg shadow-lg"
              />
              <span className="text-sm text-gray-400">{image.purpose}</span>
            </div>
          ))}
        </div>
      )
    : "No images available"}
</div>

      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Status:</span>{" "}
        <span
          className={`font-semibold ${
            application.applicationStatus === "PENDING"
              ? "text-yellow-500"
              : application.applicationStatus === "APPROVED"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {application.applicationStatus}
        </span>
      </p>
    </div>
  );
}

export default GuideReviewCat;

import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const FilterBtn = ({ handleState, handleAllState }) => (
  <div>
    <div className="flex justify-center space-x-4 mb-4">
      <button
        onClick={handleAllState}
        className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
      >
        All
      </button>
      <button
        onClick={() => handleState("PENDING")}
        className="px-6 py-2 bg-yellow-500 text-gray-800 font-medium rounded-md hover:bg-yellow-600"
      >
        Pending
      </button>
      <button
        onClick={() => handleState("APPROVED")}
        className="px-6 py-2 bg-green-500 text-white-800 font-medium rounded-md hover:bg-green-600"
      >
        Approve
      </button>
      <button
        onClick={() => handleState("REJECTED")}
        className="px-6 py-2 bg-red-500 text-white-800 font-medium rounded-md hover:bg-red-600"
      >
        Rejected
      </button>
    </div>
  </div>
);

export const StateChangeBtn = ({
  handleState
}) => {
  return (
    <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-md flex justify-between items-center mt-4">
      {/* Div for "Change State to:" text */}
      <div>
        <p className="text-lg font-semibold text-gray-200">Change State to:</p>
      </div>

      {/* Div for buttons */}
      <div className="flex space-x-4">
        <button
          value="APPROVED"
          onClick={handleState}
          className="px-6 py-2 bg-green-500 text-white font-medium rounded-md shadow hover:bg-green-600 transition duration-300 focus:outline-none focus:ring focus:ring-green-300"
        >
          APPROVED
        </button>
        <button
          value="REJECTED"
          onClick={handleState}
          className="px-6 py-2 bg-red-500 text-white font-medium rounded-md shadow hover:bg-red-600 transition duration-300 focus:outline-none focus:ring focus:ring-red-300"
        >
          REJECTED
        </button>
        <button
          value="DELETE"
          onClick={handleState}
          className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md shadow hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring focus:ring-gray-300"
        >
          DELETE
        </button>
      </div>
    </div>
  );
};

export const BottomDelete = ({ handleDelete }) => (
  <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-md flex justify-between items-center">
    <button
      onClick={handleDelete}
      className="px-6 py-2 bg-red-500 text-white font-medium rounded-md shadow hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring focus:ring-gray-300"
    >
      DELETE
    </button>
  </div>
);

export const BackBtn = ({ application }) => {
  const status = application.applicationStatus;

  return (
    <div className="sticky top-4 right-0 z-10 flex justify-end"> {/* Sticky + aligned to the right */}
      <Link to="/admin/guide-management">
        <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring focus:ring-blue-300 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> {/* Back icon */}
          Back
        </button>
      </Link>
    </div>
  );
};





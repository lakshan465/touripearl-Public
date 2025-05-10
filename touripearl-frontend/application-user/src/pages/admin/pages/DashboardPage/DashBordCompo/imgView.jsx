import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../../GuideManagementPage/guideComponents/Loding2";
import Form from "./upload";
import toast from "react-hot-toast";
import Dashboard from '../../../../../pages/admin/dashboard/Dashboard'

function ImgView() {
  const [files, setFiles] = useState([]); // State to store files
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch files from the backend
  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8085/api/v1/slideShow/getAll"
      );
      setFiles(response.data); // Set the fetched files in state
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files. Please try again.");
    } finally {
      setTimeout(() => {
        setLoading(false); // Set loading to false
      }, 200);
    }
  };

  const handleDelete = async (fileName) => {
    setLoading(true);

    try {
      const response = await axios.delete(
        "http://localhost:8085/api/v1/slideShow/delete",
        {
          params: {
            fileS3Name: fileName,
          },
        }
      );
      toast.error("Image Deleted!", { icon: "❌" });
      console.log(response.data);
      fetchFiles();
      setTimeout(() => {
        setLoading(false); // Set loading to false
      }, 200);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Use useEffect to fetch files when the component loads
  useEffect(() => {
    fetchFiles();
  }, []);
  return (
    <Dashboard title="Dashboard">
    <div>
      <Form fetchFiles={fetchFiles} />
      {loading && (
        <div className="text-center text-lg text-gray-500">
          <Loading /> {/* Assuming you have a Loading component */}
        </div>
      )}
      {error && <div className="text-center text-lg text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <div
              key={file.id}
              className="card bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(file.name)} // Assuming you handle the delete function here
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none transition-colors duration-300"
              >
                {/* SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 012-2h8a2 2 0 012 2v1h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6H2a1 1 0 01-1-1V3a1 1 0 011-1h4V2zm1 1V3h10v1H7zM3 6h18v14a1 1 0 001 1h-1v-1H4v1H3a1 1 0 001-1V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {files.length === 0 && (
        <div className="text-center text-white-500 p-4 bg-black-100 border border-gray-300 rounded-lg">
          Upload images to display in a slideshow
        </div>
      )}
    </div>
     </Dashboard >
  );
}

export default ImgView;

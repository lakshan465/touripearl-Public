import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../GuideManagementPage/guideComponents/Loding2";

function upload({ fetchFiles }) {
  const [file, setFile] = useState(null);
  const [loading, setLoding] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Append the file to formData
setFile(null)
    try {
      setLoding(true);
      const response = await axios.post(
        "http://localhost:8085/api/v1/slideShow/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        }
      );
      toast.success("New Image Uploaded!!");
      fetchFiles();
      setLoding(false);
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      uploadFile(file); // Call the upload function
    } else {
      alert("Please select a file and provide a name");
    }
  };
  useEffect(() => {}, [file]);

  return (
<>
  {!loading ? (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-4 bg-gray-800 shadow-lg rounded-lg"
    >
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="w-3/4 border border-gray-600 rounded-md px-2 py-1 text-gray-300 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={!file} // Disable the button when no file is selected
          className={`w-1/4 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 ${
            file
              ? 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Upload
        </button>
      </div>
    </form>
  ) : (
    <Loading /> // Render Loading component if loading is true
  )}
</>


  );
}

export default upload;

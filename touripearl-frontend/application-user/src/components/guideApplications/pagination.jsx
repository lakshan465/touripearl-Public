import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [statusSend, setStatusSend] = useState("");
  const itemsPerPage = 5;
  const [url, setUrl] = useState(
    "http://localhost:8085/api/v1/guideApplications/pending-applications"
  );

  const handleAll = (e) => {
    console.log("all");
    e.preventDefault();

    setUrl(`http://localhost:8085/api/v1/guideApplications/page`);
  };
  const handlePending = (e) => {
    console.log("pending");
    e.preventDefault();
    setStatusSend("PENDING");
    setUrl(
      `http://localhost:8085/api/v1/guideApplications/pending-applications`
    );
  };
  const handleOk = (e) => {
    console.log("ok");
    e.preventDefault();
    setStatusSend("APPROVED");
    setUrl(
      `http://localhost:8085/api/v1/guideApplications/pending-applications`
    );
  };
  const handleNo = (e) => {
    console.log("no");
    e.preventDefault();
    setStatusSend("REJECTED");
    setUrl(
      `http://localhost:8085/api/v1/guideApplications/pending-applications`
    );
  };

  // Fetch All data from backend

  // Fetch All data from backend
  const fetchPending = async (page, url) => {
    try {
      setLoading(true);

      //const passPage = page-1;
      // Replace with your backend API URL
      const response = await axios.get(url, {
        params: {
          page: page - 1,
          limit: itemsPerPage,
          status: statusSend,
        },
      });
      const { guideApplications, total } = response.data;

      setData(guideApplications);
      setTotalItems(total);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.log("error");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 10); //server simulation
    }
  };

  // Fetch data when page changes
  useEffect(() => {
    fetchPending(currentPage, url);
  }, [currentPage, url, statusSend]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];

    if (currentPage <= 4) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(i);
      }
      if (totalPages > 5) {
        pages.push("...", totalPages);
      }
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, "...");
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
      pages.push("...", totalPages);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={handleAll}
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
        >
          All
        </button>
        <button
          onClick={handlePending}
          className="px-6 py-2 bg-yellow-500 text-gray-800 font-medium rounded-md hover:bg-yellow-600"
        >
          Pending
        </button>
        <button
          onClick={handleOk}
          className="px-6 py-2 bg-green-500 text-white-800 font-medium rounded-md hover:bg-green-600"
        >
          Approve
        </button>
        <button
          onClick={handleNo}
          className="px-6 py-2 bg-red-500 text-white-800 font-medium rounded-md hover:bg-red-600"
        >
          Rejected
        </button>
      </div>
      <div className="bg-gray-800 text-gray-100 shadow-md rounded-lg overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.guideApplicationId} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {item.guideApplicationId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {item.firstname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {item.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.applicationStatus === "APPROVED"
                          ? "bg-green-500 text-white"
                          : item.applicationStatus === "PENDING"
                          ? "bg-yellow-500 text-gray-800"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      <Link
                        to={`/admin/guide-management/${item.guideApplicationId}`}
                      >
                        <button>{item.applicationStatus}</button>
                      </Link>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between bg-gray-700 px-4 py-3 rounded-lg shadow-md">
        <div className="flex-1 text-sm text-gray-300">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          entries
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-3 py-1 rounded-md bg-gray-600 border border-gray-500 text-sm font-medium text-gray-300 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => page !== "..." && handlePageChange(page)}
              disabled={page === "..." || loading}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                page === currentPage
                  ? "bg-blue-600 text-white border border-blue-600"
                  : page === "..."
                  ? "cursor-default bg-gray-600 text-gray-400"
                  : "bg-gray-600 border border-gray-500 text-gray-300 hover:bg-gray-500"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-3 py-1 rounded-md bg-gray-600 border border-gray-500 text-sm font-medium text-gray-300 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

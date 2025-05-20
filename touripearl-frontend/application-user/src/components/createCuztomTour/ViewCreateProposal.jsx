import React from "react"; //find which guide choose tourist application and their bid
import { useParams, useNavigate, Link } from "react-router-dom";
import TouristLayout from "../user-layouts/TouristLayout.jsx";
import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "../table/Table.jsx";
import { Eye } from "lucide-react"; // Import the Eye icon
import Loader from "../../pages/admin/pages/GuideManagementPage/guideComponents/Loding2.jsx";
import axiosFetch from "../../utils/axiosFetch.js";

import Cookies from "js-cookie";

function ViewCreateProposal() {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const guideId = Cookies.get("UUID");

  const fetchTour = async (page) => {
    try {
      setLoading(true);
      const response = await axiosFetch.get(
        `api/v1/tourists/getCustomTour/${guideId}`,
        {
          params: { page },
        }
      );
      setApplications(response.data.content || []);
      setCurrentPage(response.data.page.number);
      setTotalPages(response.data.page.totalPages || 0);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  useEffect(() => {
    fetchTour(currentPage);
  }, [currentPage]);

  return (
    <TouristLayout>
      <div className="relative max-w-full mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex gap-4 justify-center my-4 items-center mx-4">
          <div>
            <Link to="/customTour">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md hover:opacity-90 hover:text-gray-200 transition duration-300 transform hover:scale-105">
                Create New Custom Tour
              </button>
            </Link>
          </div>

          <div>
            <Link to="/confirmCustomTour">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md hover:opacity-90 hover:text-gray-200 transition duration-300 transform hover:scale-105">
                Your Confirm Tours
              </button>
            </Link>
          </div>
        </div>



        <div className="border rounded-lg overflow-hidden shadow-sm">
          {loading ? (
            <Loader />
          ) : applications.length === 0 ? (
            <div className="text-center py-4 text-gray-600">
              No applications found.
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>Base Price</TableCell>
                  <TableCell header>Need Hotel Booking</TableCell>
                  <TableCell header>Need Vehicle Booking</TableCell>
                  <TableCell header>Need Tickets Booking</TableCell>
                  <TableCell header>Tour details</TableCell>
                  <TableCell header>Accepted Guide List</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((tour) => (
                  <TableRow key={tour.tourId}>
                    <TableCell>{tour.cost}</TableCell>
                    {/* <TableCell>{tour.accommodation}</TableCell> */}
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${tour.accommodation === true
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-gray-800"
                          }`}
                      >
                        {tour.accommodation ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${tour.guideWithVehicle === true
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-gray-800"
                          }`}
                      >
                        {tour.guideWithVehicle ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${tour.guideNeedToBookTicket === true
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-gray-800"
                          }`}
                      >
                        {tour.guideNeedToBookTicket ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell className="flex justify-center items-center">
                      <Link
                        to={{ pathname: `/customTourView/oneTour` }}
                        state={{ tour }} // Pass tour data
                      >
                        <button className="text-blue-500 underline hover:text-blue-700 group w-8 h-8 bg-blue-500 rounded-full flex justify-center items-center transition duration-300">
                          <Eye className="w-5 h-5 text-white group-hover:scale-110 group-hover:text-white transition-transform duration-300" />
                        </button>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        to={{ pathname: `/customTourView/GuideList` }}
                        state={{ tour }} // Pass tour data
                        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 transition duration-300"
                      >
                        <div className="relative flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full hover:bg-blue-700 transition duration-300">
                          <FaUser className="text-white w-4 h-4" />
                          {tour.numberOfGuides > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                              {tour.numberOfGuides}
                            </span>
                          )}
                        </div>
                        {tour.numberOfGuides === 0 ? (
                          <span className="text-gray-500 text-sm">
                            No Guides
                          </span>
                        ) : (
                          <span></span>
                        )}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </TouristLayout>
  );
}

export default ViewCreateProposal;

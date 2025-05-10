import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "../../../components/table/Table";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react"; // Import the Eye icon
import Loader from "../../admin/pages/GuideManagementPage/guideComponents/Loding2";
import axiosFetch from "../../../utils/axiosFetch.js";
import GuideDashboard from "../Dashboard/GuideDashboard.jsx";
import Cookies from "js-cookie";

function CustomTourList() {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const guideId = Cookies.get("UUID");

  const fetchTour = async (page) => {
    try {
      setLoading(true);
      const response = await axiosFetch.get("api/v1/guide/tours", {
        params: { page, guideId: guideId },
      });
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
    <GuideDashboard title={"Custom Tour List"}>
      <div>
        <div className="w-full max-w-7xl mx-auto p-4">
          <div className="flex gap-4 p-4 justify-center">
            <Link >
            <button className="px-4 py-2 rounded-lg bg-black border-2 border-blue-500 text-white">
                New Tour
              </button>
            </Link>

            <Link to="/guide/booking-management/selectedTour">
              <button className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition duration-300">
                Selected Tour
              </button>
            </Link>
            <Link to="/guide/booking-management/confirmTour">
              <button className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition duration-300">
                Confirmed Tour
              </button>
            </Link>
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
                    <TableCell header>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((tour) => (
                    <TableRow key={tour.tourId}>
                      <TableCell>{tour.cost}</TableCell>
                      {/* <TableCell>{tour.accommodation}</TableCell> */}
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            tour.accommodation === true
                              ? "bg-green-500 text-white"
                              : "bg-yellow-500 text-gray-800"
                          }`}
                        >
                          {tour.accommodation ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            tour.guideWithVehicle === true
                              ? "bg-green-500 text-white"
                              : "bg-yellow-500 text-gray-800"
                          }`}
                        >
                          {tour.guideWithVehicle ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            tour.guideNeedToBookTicket === true
                              ? "bg-green-500 text-white"
                              : "bg-yellow-500 text-gray-800"
                          }`}
                        >
                          {tour.guideNeedToBookTicket ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={{ pathname: `/guide/booking-management/oneTour` }}
                          state={{ tour }} // Pass tour data
                        >
                          <button className="text-blue-500 underline hover:text-blue-700 group flex items-center gap-1">
                            <span className="group-hover:hidden">View</span>
                            <Eye className="hidden group-hover:inline-block w-5 h-5 text-white" />
                          </button>
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
      </div>
    </GuideDashboard>
  );
}

export default CustomTourList;

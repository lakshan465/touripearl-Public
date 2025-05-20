import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "../../../../components/table/Table";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import Loader from "../../../admin/pages/GuideManagementPage/guideComponents/Loding2";
import axiosFetch from "../../../../utils/axiosFetch.js";
import GuideDashboard from "../../Dashboard/GuideDashboard.jsx";
import Cookies from "js-cookie";


function ConfirmTourList() {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const guideId = Cookies.get("UUID");

  const fetchTour = async (page) => {
    try {
      setLoading(true);
      const response = await axiosFetch.get(`/api/v1/guide/guideIdc`, {
        params: { guideUUID: guideId, page: page, size: 6 },
      });
      setApplications(response.data.content || []);
      console.log(applications[0]);
      setCurrentPage(response.data.page.number);
      setTotalPages(response.data.page.totalPages || 0);
      setLoading(false);
      
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  useEffect(() => {
   
    fetchTour(currentPage);
    
  }, [currentPage]);





  return (
    <GuideDashboard title={"Selected Tour List"}>
      
        <div className="w-full max-w-7xl mx-auto p-4">
          <div className="flex gap-4 p-4 justify-center ">
            <Link to="/guide/booking-management">
              <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition duration-300">
                New Tour
              </button>
            </Link>

            
            <Link to="/guide/booking-management/selectedTour">
              <button className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition duration-300">
                Selected Tour
              </button>
            </Link>
            <Link to="/guide/booking-management/confirmTour">
              <button className="px-4 py-2 rounded-lg bg-black border-2 border-green-500 text-white">
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
                    <TableCell header>Margin</TableCell>
                    <TableCell header>Vehicle Cost</TableCell>
                    <TableCell header>Hotel Cost</TableCell>
                    <TableCell header>Visit Ticket Cost</TableCell>
                    <TableCell header>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((tour) => (
                    <TableRow key={tour.tourIdc}>
                      <TableCell>{tour.marginc}</TableCell>
                      <TableCell>{tour.vehicleCostc}</TableCell>
                      <TableCell>{tour.hotelCostc}</TableCell>
                      <TableCell>{tour.visitTicketCostc}</TableCell>
                      <TableCell>
                        <Link
                          to={{ pathname: `/guide/booking-management/oneConfirmTour` }}
                          state={{ tour }}
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
    </GuideDashboard>
  )
}

export default ConfirmTourList

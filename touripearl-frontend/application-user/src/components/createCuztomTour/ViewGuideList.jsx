import React from "react"; //find which guide choose tourist application and their bid
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import TouristLayout from "../user-layouts/TouristLayout.jsx";
import { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "../table/Table.jsx";
import Loader from "../../pages/admin/pages/GuideManagementPage/guideComponents/Loding2.jsx";
import axiosFetch from "../../utils/axiosFetch.js";

function ViewGuideList() {
  const location = useLocation();
  const tour2 = location.state?.tour;
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const tourId = tour2.tourId;

  const fetchTour = async (page) => {
    try {
      setLoading(true);
      const response = await axiosFetch.get(
        `api/v1/tourists/getCustomTourGuideList`,
        {
          params: { tourId, page },
        }
      );
      setApplications(response.data.content || []);
      setCurrentPage(response.data.page.number);
      setTotalPages(response.data.page.totalPages || 0);
      setLoading(false);
      //console.log(tour2)
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
                  <TableCell header>Guide Name</TableCell>
                  <TableCell header>Rating</TableCell>
                  <TableCell header>Margin</TableCell>
                  <TableCell header>Hotel Cost</TableCell>
                  <TableCell header>Vechicle Cost</TableCell>
                  <TableCell header>Ticket Cost</TableCell>
                  <TableCell header>Has License</TableCell>
                  <TableCell header>Guide Detail</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((tour) => (
                  <TableRow key={tour.tourId}>
                    <TableCell>{tour.firstname}</TableCell>
                    {console.log(tour)}
                    <TableCell>
                      {tour.starMean === 0 ? (
                        "No Rating yet" // Show this if starMean is 0
                      ) : (
                        <>
                          {Array.from(
                            { length: Math.round(tour.starMean) },
                            (_, index) => (
                              <span key={index}>★</span> // Full stars
                            )
                          )}
                          {tour.starMean % 1 !== 0 && <span>☆</span>}{" "}
                          {/* Half star for decimals */}
                        </>
                      )}
                    </TableCell>

                    <TableCell>{tour.margin}</TableCell>
                    <TableCell>{tour.hotelCost}</TableCell>
                    <TableCell>{tour.vehicleCost}</TableCell>
                    <TableCell>{tour.visitTicketCost}</TableCell>

                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          tour.guideWithVehicle === true
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-gray-800"
                        }`}
                      >
                        {tour.hasLicense ? "Yes" : "No"}
                      </span>
                    </TableCell>

                    <TableCell className="flex justify-center items-center">
                      <Link
                        to={{ pathname: `/customTourView/GuideFullDetail` }}
                        state={{ tour, tour2 }} // Pass tour data
                      >
                        <button className="text-blue-500 underline hover:text-blue-700 group flex justify-center items-center gap-1 w-full h-full">
                          <img
                            src={tour.profilePictureUrl}
                            alt="Profile"
                            className="w-8 h-8 rounded-full" // Small and round image
                          />
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
    </TouristLayout>
  );
}

export default ViewGuideList;

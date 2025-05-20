import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "../../../../../components/table/Table";
import Loader from "./Loding2";
import { Link } from "react-router-dom";
import { FilterBtn } from "./FilterBtn";
import { Eye } from "lucide-react"; // Import the Eye icon
import { useLocation } from "react-router-dom";

function GuideList() {
  const location = useLocation();
  const { backState } = location.state || {};
  const [currentPage, setCurrentPage] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [statusSend, setStatusSend] = useState("");
  const [url, setUrl] = useState(
    "http://localhost:8085/api/v1/guideApplications/filteredApplications"
  );

  const fetchPending = async (page, url) => {
    try {
      setLoading(true);
      const response = await axios.get(url, {
        params: { page, status: statusSend },
      });
      console.log(response);
      
      setApplications(response.data.content || []);
      setCurrentPage(response.data.page.number);
      setTotalPages(response.data.page.totalPages || 0);

      //console.log("total element " + response.data.page.totalElements);

    } catch (error) {
      console.error("Error fetching data:", error);
      //alert("Failed to fetch applications.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 100); //server lodaing simulation
    }
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) setCurrentPage(page);
  };
  const handleState = (state) => {
    setUrl(
      "http://localhost:8085/api/v1/guideApplications/filteredApplications"
    );
    //console.log("change state to "+state);
    setStatusSend(state);
  };
  const handleAllState = () => {
    console.log("change state to all");
    setUrl("http://localhost:8085/api/v1/guideApplications/getAllApplication");
  };

  useEffect(() => {
    fetchPending(currentPage, url);
  }, [currentPage, url, statusSend]);

  return (
    <div className="w-full p-4 mx-auto max-w-7xl">
      <div className="overflow-hidden border rounded-lg shadow-sm">
        {loading ? (
          <Loader />
        ) : applications.length === 0 ? (
          <div className="py-4 text-center text-gray-600">
            <div className="mt-4">
              <FilterBtn
                handleState={handleState}
                handleAllState={handleAllState}
              />
            </div>
            No applications found.
          </div>
        ) : (
          <>
            <div className="mt-4">
              <FilterBtn
                handleState={handleState}
                handleAllState={handleAllState}
              />
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>Id</TableCell>
                  <TableCell header>Name</TableCell>
                  <TableCell header>Email</TableCell>
                  <TableCell header>Status</TableCell>
                  {<TableCell header>Action</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((user) => (
                  <TableRow
                    key={user.guideApplicationId}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{user.guideApplicationId}</TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.applicationStatus === "APPROVED"
                            ? "bg-green-500 text-white"
                            : user.applicationStatus === "PENDING"
                            ? "bg-yellow-500 text-gray-800"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {user.applicationStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={{pathname:`/admin/guide-management/${user.guideApplicationId}`,
                        sate:{callback:handleState}
                      }}
                      >
                        <button className="flex items-center gap-1 text-blue-500 underline hover:text-blue-700 group">
                          <span className="group-hover:hidden">View</span>
                          <Eye className="hidden w-5 h-5 text-white group-hover:inline-block" />
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
      {/* {console.log("pagination total pages " + totalPages)} */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default GuideList;

import React, { useEffect, useState } from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Pagination
} from '@components/table/Table';
import { Search } from 'lucide-react';
import axiosFetch from '@utils/axiosFetch';
import {Link, useNavigate} from 'react-router-dom';
import Loader from '@components/loader/Loader';
import GuideDashboard from "../../Dashboard/GuideDashboard.jsx";
import toast from "react-hot-toast";

const TourDBList = () => {
    const [data, setData] = useState({
        content: [],
        page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
    });
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [includesMealsFilter, setIncludeMealsFilter] = useState(null);
    const [statusFilter, setAvailableFilter] = useState(null);
    const navigate =useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setPage(0);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleDelete =  (id) => {
        if (window.confirm("Are you sure you want to delete this tour?")) {
            toast.promise(
                async ()=>{
                    await axiosFetch.delete(`/api/tours/${id}`);
                    navigate("/guide/tour-management")
                },{
                    success: 'Tour deleted successfully',
                    loading: 'Deleting tour...',
                    error: 'Failed to delete tour'
            }
            );
        }
    };
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axiosFetch.get('/api/tours/search-by-keyword', {
                params: {
                    page: page,
                    size: 10,
                    keyword: debouncedQuery,
                    includesMeals: includesMealsFilter,
                    status: statusFilter
                }
            });
            console.log(response.data.object)
            setData(response.data.object);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page, includesMealsFilter, statusFilter]);


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleIncludeMealsChange = (e) => {
        const value = e.target.value;
        setIncludeMealsFilter(value === "true" ? true : value === "false" ? false : null);
    };

    const handleAvailableChange = (e) => {
        const value = e.target.value;
        setAvailableFilter(value === "true" ? true : value === "false" ? false : null);
    };

    return (
        <GuideDashboard title="Tour Management">
            <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search tours..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="h-11 w-full pl-10 pr-4 rounded-xl border
                        bg-white/50  dark:bg-gray-900/50
                        text-gray-900 dark:text-gray-100
                        placeholder:text-gray-500 dark:placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50
                        border-gray-200/50 dark:border-gray-700/50
                        shadow-sm hover:border-gray-300 dark:hover:border-gray-600
                        transition-all duration-200"
                            title="Search by tour name, email, or other details"
                        />
                    </div>
                    <select
                        value={includesMealsFilter}
                        onChange={handleIncludeMealsChange}
                        className="h-11 px-4 rounded-xl border bg-white/50 dark:bg-gray-900/50
                       text-gray-900 dark:text-gray-100 border-gray-200/50 dark:border-gray-700/50
                       shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                        title="Filter by email verification status"
                    >
                        <option>All</option>
                        <option value={true}>Verified</option>
                        <option value={false}>Not Verified</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={handleAvailableChange}
                        className="h-11 px-4 rounded-xl border bg-white/50 dark:bg-gray-900/50
                       text-gray-900 dark:text-gray-100 border-gray-200/50 dark:border-gray-700/50
                       shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                        title="Filter by tour status"
                    >
                        <option>All</option>
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>
                    <button
                        onClick={fetchData}
                        className="h-11 px-6 rounded-xl bg-blue-500 text-white
                     hover:bg-blue-600 active:bg-blue-700
                     shadow-lg shadow-blue-500/20
                     transition-all duration-200 ease-in-out
                     font-medium"
                        title="Search tours"
                    >
                        Search
                    </button>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50
                      bg-white/50 dark:bg-gray-900/50
                      shadow-xl shadow-gray-200/20 dark:shadow-gray-900/30">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                                    <TableCell header>Name</TableCell>
                                    <TableCell header>Price PP</TableCell>
                                    <TableCell header>Difficulty Level</TableCell>
                                    <TableCell header>Available Slots</TableCell>
                                    <TableCell header>IncludeMeals</TableCell>
                                    <TableCell header>Available</TableCell>
                                    <TableCell header>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.content.map((tour, index) => (
                                    <TableRow
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                                        key={index}
                                    >
                                        <TableCell className="font-medium">{tour.name}</TableCell>
                                        <TableCell>{tour.price}</TableCell>
                                        <TableCell>{tour.difficultyLevel}</TableCell>
                                        <TableCell>{tour.availableSlots}</TableCell>
                                        <TableCell>
                      <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${tour.includesMeals
                              ? 'bg-green-100/50 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                              : 'bg-red-100/50 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                          }`}
                          title={tour.includesMeals ? 'Email is verified' : 'Email is not verified'}
                      >
                        {tour.includesMeals ? 'includesMeals' : 'Not includesMeals'}
                      </span>
                                        </TableCell>
                                        <TableCell>
                      <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${tour.available
                              ? 'bg-green-100/50 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                              : 'bg-red-100/50 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                          }`}
                          title={tour.available ? 'Tour is Available' : 'Tour is Available'}
                      >
                        {tour.available ? 'Available' : 'Not Available'}
                      </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/guide/tour-management/${tour.id}`}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700
                                   dark:hover:text-blue-300 font-medium transition-colors"
                                                    title="View tour details"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`/guide/tour-management/edit/${tour.id}`}
                                                    className="text-orange-600 dark:text-orange-400 hover:text-orange-700
                                   dark:hover:text-orange-300 font-medium transition-colors"
                                                    title="Edit tour details"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(tour.id)}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-700
                                   dark:hover:text-orange-300 font-medium transition-colors"
                                                    title="Edit tour details"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {data.page.totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={data.page.number}
                            totalPages={data.page.totalPages}
                            onPageChange={handlePageChange}
                            title="Navigate through pages"
                        />
                    </div>
                )}
            </div>
        </GuideDashboard>
    );
};

export default TourDBList;

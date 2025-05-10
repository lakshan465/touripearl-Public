import React, { useEffect, useState } from 'react';
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
import Dashboard from '../../dashboard/Dashboard';
import { Link } from 'react-router-dom';
import Loader from '@components/loader/Loader';
import Button from '@components/ui/button/RUButton';

const EventTable = () => {
  const [data, setData] = useState({
    content: [],
    page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
  });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosFetch.get('/api/v1/events/search-by-keyword', {
        params: { 
          page: page, 
          size: 10, 
          keyword: debouncedQuery,
          startDate: startDateFilter,
          endDate: endDateFilter
        }
      });
      console.log(response.data.object);
      setData(response.data.object);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, startDateFilter, endDateFilter]);


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  return (
    <Dashboard title="Event Management">
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search events..."
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
              title="Search by event name, email, or other details"
            />
          </div>
                <input
                    type="datetime-local"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="h-11 px-4 rounded-xl border bg-white/50 dark:bg-gray-900/50
                                         text-gray-900 dark:text-gray-100 border-gray-200/50 dark:border-gray-700/50
                                         shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                    title="Filter by start date"
                />
                <input
                    type="datetime-local"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="h-11 px-4 rounded-xl border bg-white/50 dark:bg-gray-900/50
                                         text-gray-900 dark:text-gray-100 border-gray-200/50 dark:border-gray-700/50
                                         shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                    title="Filter by end date"
                />
          <Button
            onClick={() => fetchData()}
            className="h-11 px-6"
          >
            Search
          </Button>
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
                  <TableCell header>Title</TableCell>
                  <TableCell header>StartDateTime</TableCell>
                  <TableCell header>EndDateTime</TableCell>
                  <TableCell header>Venue</TableCell>
                  <TableCell header>UpdatedAt</TableCell>
                  <TableCell header>UpdateBy</TableCell>
                  <TableCell header>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.content.map((event, index) => (
                  <TableRow 
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-150" 
                    key={index}
                  >
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{new Date(event.startDateTime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(event.endDateTime).toLocaleString()}</TableCell>
                    <TableCell>{event.venue}</TableCell>
                    <TableCell>{new Date(event.updateAt).toLocaleString()}</TableCell>
                    <TableCell>{event.updatedBy}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/event-management/${event.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 
                                   dark:hover:text-blue-300 font-medium transition-colors"
                          title="View event details"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/event-management/update/${event.id}`}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 
                                   dark:hover:text-orange-300 font-medium transition-colors"
                          title="Edit event details"
                        >
                          Edit
                        </Link>
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
    </Dashboard>
  );
};

export default EventTable;
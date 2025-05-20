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
import Dashboard from '../../dashboard/Dashboard';
import { Link } from 'react-router-dom';
import Loader from '@components/loader/Loader';

const UserTable = () => {
  const [data, setData] = useState({
    content: [],
    page: { number: 0, size: 10, totalElements: 0, totalPages: 0 },
  });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

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
      const response = await axiosFetch.get('/api/v1/users/search-by-keyword', {
        params: { 
          page: page, 
          size: 10, 
          keyword: debouncedQuery,
          emailVerified: emailVerifiedFilter,
          status: statusFilter
        }
      });
      setData(response.data.object);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, emailVerifiedFilter, statusFilter]);

  const formatRoles = (roles) => roles.join(', ');

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEmailVerifiedChange = (e) => {
    const value = e.target.value;
    setEmailVerifiedFilter(value === "true" ? true : value === "false" ? false : null);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value === "true" ? true : value === "false" ? false : null);
  };

  return (
      <Dashboard title="User Management">
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent"
              />
              <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="h-11 w-full pl-10 pr-4 rounded-xl border
                        bg-light/50 dark:bg-gray-900/50
                        text-secondary dark:text-gray-100
                        placeholder:text-secondary/50 dark:placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-highlight/50 dark:focus:ring-blue-400/50
                        border-secondary/50 dark:border-gray-700/50
                        shadow-sm hover:border-secondary dark:hover:border-gray-600
                        transition-all duration-200"
                  title="Search by user name, email, or other details"
              />
            </div>
            <select
                value={emailVerifiedFilter}
                onChange={handleEmailVerifiedChange}
                className="h-11 px-4 rounded-xl border bg-light/50 dark:bg-gray-900/50
                       text-secondary dark:text-gray-100 border-secondary/50 dark:border-gray-700/50
                       shadow-sm hover:border-secondary dark:hover:border-gray-600 transition-all duration-200"
                title="Filter by email verification status"
            >
              <option>All</option>
              <option value={true}>Verified</option>
              <option value={false}>Not Verified</option>
            </select>
            <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="h-11 px-4 rounded-xl border bg-light/50 dark:bg-gray-900/50
                       text-secondary dark:text-gray-100 border-secondary/50 dark:border-gray-700/50
                       shadow-sm hover:border-secondary dark:hover:border-gray-600 transition-all duration-200"
                title="Filter by user status"
            >
              <option>All</option>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
            <button
                onClick={fetchData}
                className="h-11 px-6 rounded-xl bg-highlight text-white
                     hover:bg-highlight/90 active:bg-highlight/80
                     shadow-lg shadow-highlight/20
                     transition-all duration-200 ease-in-out
                     font-medium"
                title="Search users"
            >
              Search
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-secondary/50 dark:border-gray-800/50
                      bg-light/50 dark:bg-gray-900/50
                      shadow-xl shadow-secondary/20 dark:shadow-gray-900/30">
            {isLoading ? (
                <Loader />
            ) : (
                <Table>
                  <TableHead>
                    <TableRow className="bg-light/50 dark:bg-gray-800/50">
                      <TableCell header>User Name</TableCell>
                      <TableCell header>Email</TableCell>
                      <TableCell header>Address</TableCell>
                      <TableCell header>Phone</TableCell>
                      <TableCell header>Roles</TableCell>
                      <TableCell header>EmailVerified</TableCell>
                      <TableCell header>Status</TableCell>
                      <TableCell header>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.content.map((user, index) => (
                        <TableRow
                            className="hover:bg-light/50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                            key={index}
                        >
                          <TableCell className="font-medium">{user.userName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.address}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>{formatRoles(user.userRoles)}</TableCell>
                          <TableCell>
                      <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${user.emailVerified
                              ? 'bg-accent/10 text-accent dark:bg-green-900/50 dark:text-green-300'
                              : 'bg-red-100/50 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                          }`}
                          title={user.emailVerified ? 'Email is verified' : 'Email is not verified'}
                      >
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                          </TableCell>
                          <TableCell>
                      <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${user.enabled
                              ? 'bg-accent/10 text-accent dark:bg-green-900/50 dark:text-green-300'
                              : 'bg-red-100/50 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                          }`}
                          title={user.enabled ? 'User is active' : 'User is inactive'}
                      >
                        {user.enabled ? 'Active' : 'Inactive'}
                      </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Link
                                  to={`/admin/user-management/${user.userId}`}
                                  className="text-primary dark:text-blue-400 hover:text-primary/90
                                   dark:hover:text-blue-300 font-medium transition-colors"
                                  title="View user details"
                              >
                                View
                              </Link>
                              <Link
                                  to={`/admin/user-management/${user.userId}/edit`}
                                  className="text-accent dark:text-orange-400 hover:text-accent/90
                                   dark:hover:text-orange-300 font-medium transition-colors"
                                  title="Edit user details"
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

export default UserTable;

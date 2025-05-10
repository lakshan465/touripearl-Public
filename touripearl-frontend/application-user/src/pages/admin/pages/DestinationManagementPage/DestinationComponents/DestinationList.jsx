import React, { useEffect, useState } from 'react'
import axiosFetch from '../../../../../utils/axiosFetch';
import { Loader2 , Search} from 'lucide-react';
import { Table, TableHead, TableRow, TableBody, TableCell } from '../../../../../components/table/Table';
import { Link } from 'react-router-dom';

const DestinationList = () => {
  const [destinations, setDestinations]= useState([]);
  const [page, setPage]=useState(0);
  const [size, setSize]=useState(10);
  const [totalPages, setTotalPages]=useState(0);
  const [loading, setLoading]=useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
    const fetchDestinations = async () => {
      try{
        setLoading(true);
        const response = await axiosFetch.get('/api/v1/destinations',{
          params:{
            page: page,
            size: size, 
            search: searchTerm,
            active: activeFilter !== 'all' ? activeFilter == 'active' : undefined
          }
        });
        console.log(response.data.object);
        setDestinations(response.data.object.content);
        setTotalPages(response.data.object.page.totalPages);
        setSize(response.data.object.page.size);
        setError(null);
      }catch(error){
        setError('Failed to fetch destinations. Please try again later.');
      }finally{
        setLoading(false);
      }
  }
  
  useEffect(() => {
    fetchDestinations();
  },[page, size, searchTerm, activeFilter]);

  const handleSearchChange = (e) =>{
    setSearchTerm(e.target.value);
    setPage(0);
  }

  const handleFilterChange = (e) => {
    setActiveFilter(e.target.value);
    setPage(0); // Reset to first page when filtering
  };

  return (
      <div className="w-full p-4 mx-auto max-w-7xl">
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute text-accent transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full py-2 pl-10 pr-4 border border-secondary rounded-lg bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
            />
          </div>
          <select
              value={activeFilter}
              onChange={handleFilterChange}
              className="w-full md:w-auto px-4 py-2 border border-secondary rounded-lg bg-light/50 dark:bg-gray-900/50 text-secondary dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-highlight"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Link to='/add-destination-form'>
            <button className="w-full md:w-auto flex items-center justify-center px-4 py-2 space-x-1 font-medium text-white transition-colors duration-200 bg-highlight rounded-md shadow-sm hover:bg-highlight/90">
              Add New Destination
            </button>
          </Link>
        </div>

        <div className="overflow-hidden border border-secondary rounded-lg shadow-sm bg-white dark:bg-gray-800">
          {loading ? (
              <Loader2 />
          ) : destinations.length === 0 ? (
              <div className="py-4 text-center text-secondary dark:text-gray-400">
                No applications found.
              </div>
          ) : (
              <div>
                <div className="mt-4">
                  <Table>
                    <TableHead>
                      <TableRow className="bg-secondary dark:bg-gray-700 text-white">
                        <TableCell header>Destination Id</TableCell>
                        <TableCell header>Destination Name</TableCell>
                        <TableCell header>Destination Location</TableCell>
                        <TableCell header>Status</TableCell>
                        <TableCell header>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {destinations.map((item) => (
                          <TableRow key={item.destinationId} className="hover:bg-light/50 dark:hover:bg-gray-700/50">
                            <TableCell className="text-secondary dark:text-gray-300">{item.destinationId}</TableCell>
                            <TableCell className="text-secondary dark:text-gray-300">{item.destinationName}</TableCell>
                            <TableCell className="text-secondary dark:text-gray-300">{item.location}</TableCell>
                            <TableCell>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                item.active
                                    ? "bg-accent text-white dark:bg-accent dark:text-white"
                                    : "bg-red-500 text-white dark:bg-red-600 dark:text-white"
                            }`}>
                            {item.active ? 'Active' : 'Inactive'}
                        </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Link
                                    to={`/admin/destination-management/${item.destinationId}`}
                                    className="font-medium text-primary dark:text-accent hover:text-primary/90 dark:hover:text-accent/80 transition-colors"
                                    title="View destination details"
                                >
                                  View
                                </Link>
                                <Link
                                    to={`/admin/destination-management/${item.destinationId}/edit`}
                                    className="font-medium text-accent dark:text-orange-400 hover:text-accent/90 dark:hover:text-orange-300 transition-colors"
                                    title="Edit destination details"
                                >
                                  Edit
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

export default DestinationList;
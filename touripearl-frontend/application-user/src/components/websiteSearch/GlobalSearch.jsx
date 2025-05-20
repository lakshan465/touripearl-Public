import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, HardHat, Calendar } from 'lucide-react';
import axiosFetch from '../../utils/axiosFetch';
import { Link } from 'react-router-dom';

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (!searchTerm) {
        setResults([]);
        setIsDropdownOpen(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosFetch.get('/api/v1/search', {
          params: { keyword: searchTerm }
        });
        console.log(response)

        const combinedResults = [
          ...(response.data.object.guides[0]?.content || []).map(item => ({
            ...item,
            type: 'guide'
          })),
          ...(response.data.object.events[0]?.content || []).map(item => ({
            ...item,
            type: 'event'
          }))
        ];

        setResults(combinedResults);
        setIsDropdownOpen(true);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const categorizedResults = results.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center border border-gray-300 rounded-lg dark:border-gray-700 shadow-sm">
        <Search className="ml-3 text-gray-500 dark:text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search anything..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 pl-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
        />
        {searchTerm && (
          <button 
            onClick={clearSearch} 
            className="mr-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-colors"
          >
            <X className="text-gray-500 dark:text-gray-400" size={20} />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border rounded-lg shadow-lg p-4 flex justify-center">
          <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={24} />
        </div>
      )}

      {error && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border rounded-lg shadow-lg p-4 text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {isDropdownOpen && !isLoading && !error && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border rounded-lg shadow-lg ">
          {Object.keys(categorizedResults).length > 0 ? (
            <>
              {categorizedResults['guide'] && (
                <div>
                  <div className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                    Guides
                  </div>
                  {categorizedResults['guide'].map((item) => (
                    <Link to={`/guides/${item.propertyId}`} key={item.propertyId}>
                      <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group">
                        <img
                          src={item.propertyImageUrl}
                          alt={item.propertyName}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <span className="text-gray-800 dark:text-gray-200 font-semibold group-hover:text-blue-600 transition-colors">
                              {item.propertyName}
                            </span>
                            <HardHat className="ml-2 text-blue-500" size={16} strokeWidth={2} />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Guide
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {categorizedResults['event'] && (
                <div>
                  <div className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                    Events
                  </div>
                  {categorizedResults['event'].map((item) => (
                    <Link to={`/events/${item.propertyId}`} key={item.propertyId}>
                      <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group">
                        <img
                          src={item.propertyImageUrl}
                          alt={item.propertyName}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <span className="text-gray-800 dark:text-gray-200 font-semibold group-hover:text-blue-600 transition-colors">
                              {item.propertyName}
                            </span>
                            <Calendar className="ml-2 text-purple-500" size={16} strokeWidth={2} />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Event
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
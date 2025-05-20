import React, {useState, useEffect} from 'react';
import {Search, MapPin, Star, Filter, Award, ChevronDown, ChevronUp, ChevronLeft, ChevronRight} from 'lucide-react';
import axiosFetch from "../../utils/axiosFetch.js";
import {Link} from "react-router-dom";

const GuideListingPage = () => {
    const [filteredGuides, setFilteredGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('recommended');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        languages: [],
        interests: [],
        rating: 0
    });
    const [pagination, setPagination] = useState({
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 10
    });
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    // Filter options
    const filterOptions = {
        languages: ['AFRIKAANS', 'ALBANIAN', 'AMHARIC', 'ARABIC', 'ARMENIAN',
            'ASSAMESE', 'AZERBAIJANI', 'BASQUE', 'BELARUSIAN', 'BENGALI', 'BOSNIAN',
            'BULGARIAN', 'CATALAN', 'CEBUANO', 'CHICHEWA', 'CHINESE', 'CORSICAN',
            'CROATIAN', 'CZECH', 'DANISH', 'DUTCH', 'ENGLISH', 'ESPERANTO',
            'ESTONIAN', 'FILIPINO', 'FINNISH', 'FRENCH', 'FRISIAN', 'GALICIAN',
            'GEORGIAN', 'GERMAN', 'GREEK', 'GUJARATI', 'HAUSA', 'HAWAIIAN',
            'HEBREW', 'HINDI', 'HMONG', 'HUNGARIAN', 'ICELANDIC', 'IGBO', 'INDONESIAN',
            'IRISH', 'ITALIAN', 'JAPANESE', 'JAVANESE', 'KANNADA', 'KAZAKH', 'KHMER',
            'KINYARWANDA', 'KOREAN', 'KURDISH', 'KYRGYZ', 'LAO', 'LATIN', 'LATVIAN',
            'LITHUANIAN', 'LUXEMBOURGISH', 'MACEDONIAN', 'MALAGASY', 'MALAY', 'MALAYALAM',
            'MALTESE', 'MAORI', 'MARATHI', 'MONGOLIAN', 'NEPALI', 'NORWEGIAN', 'ODIA',
            'PASHTO', 'PERSIAN', 'POLISH', 'PORTUGUESE', 'PUNJABI', 'ROMANIAN', 'RUSSIAN',
            'SAMOA', 'SERBIAN', 'SESOTHO', 'SHONA', 'SINDHI', 'SINHALA', 'SLOVAK', 'SLOVENIAN',
            'SOMALI', 'SPANISH', 'SUNDANESE', 'SWAHILI', 'SWEDISH', 'TAJIK', 'TAMIL', 'TATAR',
            'TELUGU', 'THAI', 'TURKISH', 'TURKMEN', 'UKRAINIAN', 'URDU', 'UYGHUR', 'UZBEK',
            'VIETNAMESE', 'WELSH', 'XHOSA', 'YIDDISH', 'YORUBA', 'ZULU'],
        interests: ['ADVENTURE_TRAVEL', 'CULTURAL_EXPERIENCES', 'BEACH_GETAWAYS', 'CITY_TOURS',
            'HISTORICAL_SITES', 'NATURE_WILDLIFE', 'LUXURY_TRAVEL', 'PHOTOGRAPHY', 'HIKING',
            'LOCAL_CUISINE', 'CULTURAL_SITES']
    };

    // API call to fetch guides
    useEffect(() => {
        const fetchGuides = async () => {
            setLoading(true);
            const params = new URLSearchParams({
                searchQuery,
                sort: activeFilter,
                page,
                size,
            });

            selectedFilters.interests.forEach((interest) => {
                params.append("interests", interest);
            });
            selectedFilters.languages.forEach((language) => {
                params.append("languages", language);
            });

            try {
                const response = await axiosFetch.get('/api/v1/guide/getGuidesByFiltering', {params: params});

                if (response.data && response.data.object.content) {
                    setFilteredGuides(response.data.object.content);
                    setPagination({
                        totalElements: response.data.object.page.totalElements,
                        totalPages: response.data.object.page.totalPages,
                        number: response.data.object.page.number,
                        size: response.data.object.page.size
                    });
                }
            } catch (error) {
                console.error('Error fetching guides:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, [activeFilter, selectedFilters, searchQuery, page, size]);

    const handleFilterChange = (type, value) => {
        if (type === 'languages' || type === 'interests') {
            setSelectedFilters(prev => {
                if (prev[type].includes(value)) {
                    return {
                        ...prev,
                        [type]: prev[type].filter(item => item !== value)
                    };
                } else {
                    return {
                        ...prev,
                        [type]: [...prev[type], value]
                    };
                }
            });
            // Reset to first page when filters change
            setPage(0);
        } else {
            setSelectedFilters(prev => ({
                ...prev,
                [type]: value
            }));
            setPage(0);
        }
    };

    // Handle search with debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(0); // Reset to first page when search changes
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            setPage(newPage);
            // Scroll back to top when changing pages
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const handleSizeChange = (e) => {
        setSize(parseInt(e.target.value));
        setPage(0); // Reset to first page when size changes
    };

    const sortOptions = [
        {id: 'recommended', label: 'Recommended'},
        {id: 'rating', label: 'Highest Rated'},
    ];

    // Calculate pagination range
    const getPaginationRange = () => {
        const totalPages = pagination.totalPages;
        const currentPage = pagination.number;

        if (totalPages <= 7) {
            return Array.from({length: totalPages}, (_, i) => i);
        }

        if (currentPage < 3) {
            return [0, 1, 2, 3, null, totalPages - 1];
        }

        if (currentPage > totalPages - 4) {
            return [0, null, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
        }

        return [0, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages - 1];
    };

    // Generate formatted result count text
    const getResultsText = () => {
        if (loading) return "Loading guides...";

        const start = pagination.number * pagination.size + 1;
        const end = Math.min((pagination.number + 1) * pagination.size, pagination.totalElements);

        if (pagination.totalElements === 0) return "No guides found";

        return `Showing ${start}-${end} of ${pagination.totalElements} guides`;
    };

    return (
        <div className="max-w-full mx-auto px-10
         py-20 dark:bg-gray-900 dark:text-gray-100">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Find Your Perfect Guide</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Connect with experienced local guides for an unforgettable experience
                </p>
            </div>

            {/* Search and filter bar */}
            <div className="mb-6 flex flex-col lg:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search guides, locations, or specialties..."
                        className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-gray-100"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        aria-expanded={filtersOpen}
                        aria-controls="filter-panel"
                    >
                        <Filter size={18} />
                        <span>Filters</span>
                        {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    <div className="relative">
                        <select
                            className="appearance-none px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pr-8 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            aria-label="Sort guides by"
                        >
                            {sortOptions.map(option => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                            <ChevronDown size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter panel */}
            {filtersOpen && (
                <div id="filter-panel" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Languages filter */}
                        <div>
                            <h3 className="font-medium mb-3 dark:text-gray-100">Languages</h3>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                                {filterOptions.languages.map(language => (
                                    <button
                                        key={language}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedFilters.languages.includes(language)
                                                ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300'
                                                : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                        } border`}
                                        onClick={() => handleFilterChange('languages', language)}
                                        aria-pressed={selectedFilters.languages.includes(language)}
                                    >
                                        {language.toLowerCase().replace(/_/g, ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interests filter */}
                        <div>
                            <h3 className="font-medium mb-3 dark:text-gray-100">Interests</h3>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                                {filterOptions.interests.map(interest => (
                                    <button
                                        key={interest}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedFilters.interests.includes(interest)
                                                ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300'
                                                : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                        } border`}
                                        onClick={() => handleFilterChange('interests', interest)}
                                        aria-pressed={selectedFilters.interests.includes(interest)}
                                    >
                                        {interest.toLowerCase().replace(/_/g, ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Filter summary */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Selected:</span>
                        {selectedFilters.languages.length > 0 && (
                            <div className="text-sm bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                {selectedFilters.languages.length} languages
                            </div>
                        )}
                        {selectedFilters.interests.length > 0 && (
                            <div className="text-sm bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                {selectedFilters.interests.length} interests
                            </div>
                        )}

                        {/* Clear filters */}
                        {(selectedFilters.languages.length > 0 || selectedFilters.interests.length > 0) && (
                            <button
                                className="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                                onClick={() => setSelectedFilters({
                                    languages: [],
                                    interests: [],
                                    rating: 0,
                                })}
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Results count and display options */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
                    {getResultsText()}
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="guides-per-page" className="text-sm text-gray-600 dark:text-gray-400">
                        Show:
                    </label>
                    <select
                        id="guides-per-page"
                        className="text-sm border border-gray-300 dark:border-gray-700 rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100"
                        value={size}
                        onChange={handleSizeChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                </div>
            </div>

            {/* Guide list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    // Loading skeleton
                    Array(6).fill(0).map((_, index) => (
                        <div key={index}
                             className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                            </div>
                        </div>
                    ))
                ) : filteredGuides.length === 0 ? (
                    <div className="col-span-3 text-center py-12">
                        <div className="text-gray-400 dark:text-gray-500 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No guides found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters to find guides.</p>
                    </div>
                ) : (
                    filteredGuides.map(guide => (
                        <div key={guide.id}
                             className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
                                 guide.featured
                                     ? 'border-blue-300 ring-1 ring-blue-300 dark:border-blue-700 dark:ring-blue-700'
                                     : 'border-gray-200 dark:border-gray-700'
                             } p-4 flex flex-col transition hover:shadow-md`}>
                            {guide.featured && (
                                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm mb-2">
                                    <Award size={16} />
                                    <span>Featured Guide</span>
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={guide?.profileImageUrl?.resourceUrl || '/api/placeholder/80/80'}
                                    alt={`${guide.firstname} ${guide.lastname}`}
                                    className="w-16 h-16 rounded-full object-cover object-center"
                                    loading="lazy"
                                />
                                <div>
                                    <h3 className="font-medium text-lg dark:text-gray-100">{guide.firstname} {guide.lastname}</h3>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        <MapPin size={14} className="mr-1" />
                                        <span>{guide.city || 'Location not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <div
                                    className="flex items-center bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded text-sm">
                                    <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                                    <span>{guide.starMean || '0.0'}</span>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">({guide.reviewList?.count || 0} reviews)</span>
                            </div>

                            <div className="mb-3">
                                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                                    <span className="font-medium">Interests:</span> {guide.interests && guide.interests.length > 0
                                    ? guide.interests.map(interest => interest.toLowerCase().replace(/_/g, ' ')).join(', ')
                                    : 'Not specified'}
                                </p>
                            </div>

                            <div className="mb-3">
                                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                                    <span className="font-medium">Languages:</span> {guide.guideLanguages && guide.guideLanguages.length > 0
                                    ? guide.guideLanguages.map(language => language.languageName).join(', ')
                                    : 'Not specified'}
                                </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-3">
                                <Link
                                    to={`/guides/${guide.id}`}
                                    className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination controls */}
            {!loading && pagination.totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                        Page {pagination.number + 1} of {pagination.totalPages}
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className={`flex items-center justify-center w-10 h-10 rounded-l border ${
                                page === 0
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            } border-gray-300 dark:border-gray-700`}
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {getPaginationRange().map((pageNumber, idx) =>
                            pageNumber === null ? (
                                <span key={`ellipsis-${idx}`}
                                      className="flex items-center justify-center w-10 h-10 border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={`page-${pageNumber}`}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`flex items-center justify-center w-10 h-10 border-t border-b border-gray-300 dark:border-gray-700 ${
                                        pageNumber === page
                                            ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                    aria-label={`Page ${pageNumber + 1}`}
                                    aria-current={pageNumber === page ? 'page' : undefined}
                                >
                                    {pageNumber + 1}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= pagination.totalPages - 1}
                            className={`flex items-center justify-center w-10 h-10 rounded-r border ${
                                page >= pagination.totalPages - 1
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            } border-gray-300 dark:border-gray-700`}
                            aria-label="Next page"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuideListingPage;
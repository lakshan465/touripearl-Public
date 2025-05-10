export const Table = ({ children }) => (
  <div className="w-full overflow-x-auto">
    <table className="min-w-full border-collapse bg-white text-left text-sm dark:bg-gray-800 dark:text-gray-200">
      {children}
    </table>
  </div>
);

export const TableHead = ({ children }) => (
  <thead className="border-b font-medium bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
    {children}
  </tbody>
);

export const TableRow = ({ children, to }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
    {children}
  </tr>
);

export const TableCell = ({ children, header = false }) => {
  const Component = header ? 'th' : 'td';
  return (
    <Component className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-200">
      {children}
    </Component>
  );
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(0);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 0 && i < totalPages - 1) {
        range.push(i);
      }
    }

    // Always show last page
    if (totalPages > 1) {
      range.push(totalPages - 1);
    }

    // Sort and remove duplicates
    const sorted = [...new Set(range)].sort((a, b) => a - b);

    // Add dots where needed
    let prev = null;
    for (const i of sorted) {
      if (prev !== null) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4 py-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
      >
        Previous
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`dots-${index}`} className="px-3 py-1 dark:text-gray-200">
              {pageNum}
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 rounded border border-gray-300 dark:border-gray-600 ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {pageNum + 1}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
      >
        Next
      </button>
    </div>
  );
};
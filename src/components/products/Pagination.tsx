import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { PaginationProps } from "../../types/products.types";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  hasMore = false,
  hasPrevious = false,
  totalItems = 0,
  startItem = 0,
  endItem = 0,
  showInfo = true,
  maxVisiblePages = 7,
}) => {
  // Don't render if there's only one page or no items
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic for showing pages with ellipsis
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (currentPage <= halfVisible + 1) {
        // Show pages from start
        for (let i = 1; i <= maxVisiblePages - 2; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        // Show pages from end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - (maxVisiblePages - 3); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current page
        pages.push(1);
        pages.push("...");
        for (
          let i = currentPage - halfVisible + 2;
          i <= currentPage + halfVisible - 2;
          i++
        ) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (page === currentPage || loading) return;
    onPageChange(page);
  };

  const handlePrevious = () => {
    if (hasPrevious && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasMore && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Pagination Info */}
      {showInfo && totalItems > 0 && (
        <div className="text-sm text-gray-700">
          <span className="font-medium">
            Showing {startItem.toLocaleString()}-{endItem.toLocaleString()} of{" "}
            {totalItems.toLocaleString()} results
          </span>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious || loading}
          className={`
            inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 
            bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 
            focus:z-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500
            ${
              !hasPrevious || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-gray-700"
            }
            ${loading ? "pointer-events-none" : ""}
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="hidden md:flex">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <button
                  onClick={() => handlePageClick(page as number)}
                  disabled={loading}
                  className={`
                    inline-flex items-center px-4 py-2 text-sm font-medium border
                    focus:z-10 focus:outline-none focus:ring-1 focus:ring-emerald-500
                    ${loading ? "pointer-events-none opacity-50" : ""}
                    ${
                      currentPage === page
                        ? "z-10 bg-emerald-50 border-emerald-500 text-emerald-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }
                  `}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile: Current Page Indicator */}
        <div className="md:hidden inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
          {currentPage} of {totalPages}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!hasMore || loading}
          className={`
            inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 
            bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 
            focus:z-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500
            ${
              !hasMore || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-gray-700"
            }
            ${loading ? "pointer-events-none" : ""}
          `}
          aria-label="Next page"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
          <span>Loading...</span>
        </div>
      )}

      {/* Quick Navigation for Large Page Sets */}
      {totalPages > 10 && (
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-500">Quick jump:</span>
          <select
            value={currentPage}
            onChange={(e) => handlePageClick(Number(e.target.value))}
            disabled={loading}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <option key={pageNum} value={pageNum}>
                  Page {pageNum}
                </option>
              )
            )}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;

import { FC } from 'react';
import usePagination from '@/hooks/usePagination';
import classNameBuilder from '@/utils/classNameBuilder';

interface PaginationProps {
  className?: string;
  totalPages: number;
}

const Pagination: FC<PaginationProps> = ({ className, totalPages }) => {
  const { page, setPage } = usePagination();

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    // If total pages fit within max, show all
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={classNameBuilder(
              'px-3 py-1 rounded',
              i === page
                ? 'bg-blue text-white'
                : 'hover:bg-gray-200 text-darkGrey'
            )}
          >
            {i}
          </button>
        );
      }
      return pages;
    }

    // Strategy: show first, last, and a window around current page
    
    // Calculate middle window
    let startPage = Math.max(2, page - 1);
    let endPage = Math.min(totalPages - 1, page + 1);

    // Adjust to show at least 3 middle pages when possible
    if (page <= 2) {
      endPage = Math.min(totalPages - 1, 3);
    } else if (page >= totalPages - 1) {
      startPage = Math.max(2, totalPages - 2);
    }

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => handlePageClick(1)}
        className={classNameBuilder(
          'px-3 py-1 rounded',
          1 === page
            ? 'bg-blue text-white'
            : 'hover:bg-gray-200 text-darkGrey'
        )}
      >
        1
      </button>
    );
    
    // Show ellipsis after first page if needed
    if (startPage > 2) {
      pages.push(
        <span key="ellipsis-start" className="text-darkGrey">
          ...
        </span>
      );
    }

    // Show middle range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={classNameBuilder(
            'px-3 py-1 rounded',
            i === page
              ? 'bg-blue text-white'
              : 'hover:bg-gray-200 text-darkGrey'
          )}
        >
          {i}
        </button>
      );
    }

    // Show ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis-end" className="text-darkGrey">
          ...
        </span>
      );
    }
    
    // Always show last page
    pages.push(
      <button
        key={totalPages}
        onClick={() => handlePageClick(totalPages)}
        className={classNameBuilder(
          'px-3 py-1 rounded',
          totalPages === page
            ? 'bg-blue text-white'
            : 'hover:bg-gray-200 text-darkGrey'
        )}
      >
        {totalPages}
      </button>
    );

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={classNameBuilder(
        className,
        'flex items-center justify-center gap-1 mt-4'
      )}
    >
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className={classNameBuilder(
          'px-4 py-2 rounded',
          page === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-darkGrey hover:bg-gray-200'
        )}
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={classNameBuilder(
          'px-4 py-2 rounded',
          page === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-darkGrey hover:bg-gray-200'
        )}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

import React, { useState, useMemo, useEffect } from 'react';

import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from '@/components/ui/Pagination';

interface PaginationProps<T> {
  totalPages: number;
  onChange: (currentPage: number) => void;
}

export function Pagination<T>({
  totalPages,
  onChange,
}: PaginationProps<T>): JSX.Element | null {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    onChange(currentPage);
  }, [currentPage, onChange]);

  const handleFirstPage = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePreviousPage = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleLastPage = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    setCurrentPage(totalPages);
  };

  const handlePageClick =
    (page: number) =>
      (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        setCurrentPage(page);
      };

  return totalPages > 1 ? (
    <ShadcnPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst href="#" onClick={handleFirstPage} />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handlePreviousPage} />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={currentPage === page}
              onClick={handlePageClick(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="#" onClick={handleNextPage} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast href="#" onClick={handleLastPage} />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  ) : null;
}

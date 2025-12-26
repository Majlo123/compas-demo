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
    data: T[];
    itemsPerPage?: number;
    onChange: (paginatedData: T[]) => void;
}

export function Pagination<T>({ data, itemsPerPage = 5, onChange }: PaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, itemsPerPage]);

    useEffect(() => {
        onChange(paginatedData);
    }, [paginatedData, onChange]);

    const handleFirstPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handlePreviousPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNextPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    const handleLastPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCurrentPage(totalPages);
    };

    const handlePageClick = (page: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCurrentPage(page);
    };

    return (
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
    );
}

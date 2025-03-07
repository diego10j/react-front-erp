import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

// Hook personalizado para manejar la paginación
export const usePagination = (items: any[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    const handleNextPage = useCallback(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const handlePrevPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }, []);

    return {
        currentPage,
        totalPages,
        currentItems,
        handleNextPage,
        handlePrevPage,
    };
};

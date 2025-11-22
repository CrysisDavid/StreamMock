import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  totalRecords?: number;
  limit?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
  totalRecords,
  limit,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1);

      // Calcular rango visible
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Agregar ellipsis al inicio si es necesario
      if (start > 2) {
        pages.push('...');
      }

      // Agregar páginas del rango
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Agregar ellipsis al final si es necesario
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Siempre mostrar última página
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Info */}
      {totalRecords && limit && (
        <p className="text-sm text-zinc-400">
          Mostrando {Math.min((currentPage - 1) * limit + 1, totalRecords)} -{' '}
          {Math.min(currentPage * limit, totalRecords)} de {totalRecords} películas
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {pages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-1 text-zinc-500">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={
                    currentPage === page
                      ? 'bg-red-600 hover:bg-red-700 text-white border-0'
                      : 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700'
                  }
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

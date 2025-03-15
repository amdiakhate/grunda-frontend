import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, disabled = false }: PaginationProps) {
  const handlePageChange = (page: number) => {
    // Prevent default scroll behavior
    const currentScroll = window.scrollY;
    onPageChange(page);
    // Restore scroll position after a short delay to ensure the new content is rendered
    setTimeout(() => window.scrollTo(0, currentScroll), 0);
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Si le nombre total de pages est inférieur ou égal au nombre maximum de pages à afficher,
      // afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours inclure la première page
      pages.push(1);
      
      // Calculer la plage de pages à afficher autour de la page actuelle
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Ajuster si nous sommes près du début
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }
      
      // Ajuster si nous sommes près de la fin
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Ajouter des ellipses si nécessaire
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Ajouter les pages de la plage
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Ajouter des ellipses si nécessaire
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Toujours inclure la dernière page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
            ) : (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(page as number)}
                disabled={disabled}
              >
                {page}
              </Button>
            )
          ))}
        </div>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
} 
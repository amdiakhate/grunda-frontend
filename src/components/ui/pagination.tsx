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
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
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
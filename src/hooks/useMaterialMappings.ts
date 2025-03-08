import { useState, useEffect } from 'react';
import { materialMappingsService } from '@/services/materialMappings';
import type { MaterialMapping } from '@/interfaces/materialMapping';

interface UseMaterialMappingsResult {
  mappings: MaterialMapping[];
  loading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  refresh: () => void;
}

export function useMaterialMappings(initialPageSize = 10): UseMaterialMappingsResult {
  const [mappings, setMappings] = useState<MaterialMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        setLoading(true);
        const response = await materialMappingsService.getAll({
          page: currentPage,
          limit: pageSize,
          search: searchQuery,
        });
        
        setMappings(response.items);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalItems);
      } catch (err) {
        console.error('Error fetching material mappings:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch material mappings'));
      } finally {
        setLoading(false);
      }
    };

    fetchMappings();
  }, [currentPage, pageSize, searchQuery, refreshTrigger]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    mappings,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize,
    setPageSize,
    refresh,
  };
} 
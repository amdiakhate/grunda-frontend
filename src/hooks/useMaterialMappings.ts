import { useState, useCallback, useEffect } from 'react';
import { MaterialMapping, MaterialMappingSearchParams } from '@/interfaces/materialMapping';
import { adminService } from '@/services/admin';

export function useMaterialMappings() {
  const [mappings, setMappings] = useState<MaterialMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [params, setParams] = useState<Required<MaterialMappingSearchParams>>({
    page: 1,
    pageSize: 10,
    query: '',
  });

  const fetchMappings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getMaterialMappings(params);
      setMappings(response.items);
      setTotalPages(Math.ceil(response.total / params.pageSize));
      setCurrentPage(params.page);
    } catch (error) {
      console.error('Failed to fetch mappings:', error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setParams(prev => ({ ...prev, query, page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    return fetchMappings();
  }, [fetchMappings]);

  // Fetch mappings when params change
  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  return {
    mappings,
    loading,
    searchQuery,
    currentPage,
    totalPages,
    setSearchQuery: search,
    setCurrentPage: (page: number) => setParams(prev => ({ ...prev, page })),
    refetch,
  };
} 
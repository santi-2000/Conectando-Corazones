import { useState, useEffect, useCallback } from 'react';
import { supportDirectoriesService } from '../proxy/services';

/**
 * Hook para manejar directorio de apoyos
 */
export const useSupportDirectories = (initialFilters = {}) => {
  const [directories, setDirectories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Cargar directorios cuando cambien los filtros
  useEffect(() => {
    loadDirectories();
  }, [filters]);

  const loadDirectories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await supportDirectoriesService.getDirectories(filters);
      
      setDirectories(result.directories || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setDirectories([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const searchDirectories = useCallback(async (searchTerm, searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await supportDirectoriesService.searchDirectories(searchTerm, {
        ...filters,
        ...searchFilters
      });
      
      setDirectories(result.directories || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setDirectories([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getDirectoryById = useCallback(async (directoryId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await supportDirectoriesService.getDirectoryById(directoryId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDirectoriesByCategory = useCallback(async (category, categoryFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await supportDirectoriesService.getDirectoriesByCategory(category, {
        ...filters,
        ...categoryFilters
      });
      
      setDirectories(result.directories || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setDirectories([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getCategories = useCallback(async () => {
    try {
      const result = await supportDirectoriesService.getCategories();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    directories,
    loading,
    error,
    filters,
    pagination,
    loadDirectories,
    searchDirectories,
    getDirectoryById,
    getDirectoriesByCategory,
    getCategories,
    updateFilters,
    resetFilters
  };
};

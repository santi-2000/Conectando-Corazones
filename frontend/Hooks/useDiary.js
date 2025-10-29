import { useState, useEffect, useCallback } from 'react';
import { diaryService } from '../proxy/services';

/**
 * Hook para manejar diario
 */
export const useDiary = (userId) => {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Cargar entradas cuando cambien los filtros o userId
  useEffect(() => {
    if (userId) {
      loadEntries();
    }
  }, [userId, filters]);

  const loadEntries = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await diaryService.getEntries(userId, filters);
      
      setEntries(result.entries || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  const createEntry = useCallback(async (entryData) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await diaryService.createEntry(userId, entryData);
      
      // Recargar entradas después de crear
      await loadEntries();
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, loadEntries]);

  const updateEntry = useCallback(async (entryId, entryData) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await diaryService.updateEntry(userId, entryId, entryData);
      
      // Recargar entradas después de actualizar
      await loadEntries();
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, loadEntries]);

  const deleteEntry = useCallback(async (entryId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await diaryService.deleteEntry(userId, entryId);
      
      // Recargar entradas después de eliminar
      await loadEntries();
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, loadEntries]);

  const getEntryById = useCallback(async (entryId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await diaryService.getEntryById(userId, entryId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadStats = useCallback(async (statsFilters = {}) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await diaryService.getDiaryStats(userId, statsFilters);
      setStats(result);
      
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const generatePDF = useCallback(async (pdfFilters = {}) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await diaryService.generateDiaryPDF(userId, pdfFilters);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    entries,
    stats,
    loading,
    error,
    filters,
    pagination,
    loadEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    loadStats,
    generatePDF,
    updateFilters,
    resetFilters
  };
};

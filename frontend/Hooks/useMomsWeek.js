import { useState, useEffect, useCallback } from 'react';
import { momsWeekService } from '../proxy/services';

/**
 * Hook para manejar Moms Week
 */
export const useMomsWeek = (userId) => {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [weekHistory, setWeekHistory] = useState([]);
  const [weekStats, setWeekStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar semana actual cuando cambie el userId
  useEffect(() => {
    if (userId) {
      loadCurrentWeek();
    }
  }, [userId]);

  const loadCurrentWeek = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await momsWeekService.getCurrentWeek(userId);
      setCurrentWeek(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const generateWeeklyBook = useCallback(async (bookData) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await momsWeekService.generateWeeklyBook(userId, bookData);
      
      // Recargar semana actual después de generar libro
      await loadCurrentWeek();
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, loadCurrentWeek]);

  const loadWeekHistory = useCallback(async (filters = {}) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await momsWeekService.getWeekHistory(userId, filters);
      setWeekHistory(result.weeks || []);
      
      return result;
    } catch (err) {
      setError(err.message);
      setWeekHistory([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadWeekStats = useCallback(async (filters = {}) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await momsWeekService.getWeekStats(userId, filters);
      setWeekStats(result);
      
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getWeekById = useCallback(async (weekId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await momsWeekService.getWeekById(userId, weekId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    currentWeek,
    weekHistory,
    weekStats,
    loading,
    error,
    loadCurrentWeek,
    generateWeeklyBook,
    loadWeekHistory,
    loadWeekStats,
    getWeekById
  };
};

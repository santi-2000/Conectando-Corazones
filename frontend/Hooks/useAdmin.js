import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../proxy/services';

/**
 * Hook para manejar funcionalidades de administración
 */
export const useAdmin = () => {
  const [stats, setStats] = useState({
    users: null,
    events: null,
    pdfs: null,
    weekly: null,
    monthly: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAllStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminService.getAllStats();
      setStats(result);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminService.getUserStats();
      setStats(prev => ({ ...prev, users: result }));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEventStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminService.getEventStats();
      setStats(prev => ({ ...prev, events: result }));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPdfStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminService.getPdfStats();
      setStats(prev => ({ ...prev, pdfs: result }));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWeeklyStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminService.getWeeklyStats();
      setStats(prev => ({ ...prev, weekly: result }));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMonthlyStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminService.getMonthlyStats();
      setStats(prev => ({ ...prev, monthly: result }));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    loadAllStats,
    loadUserStats,
    loadEventStats,
    loadPdfStats,
    loadWeeklyStats,
    loadMonthlyStats
  };
};

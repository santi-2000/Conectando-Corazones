import { useState, useEffect, useCallback } from 'react';
import { calendarService } from '../proxy/services';

/**
 * Hook para manejar calendario
 */
export const useCalendar = (initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Cargar eventos cuando cambien los filtros
  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await calendarService.getEvents(filters);
      
      setEvents(result.events || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await calendarService.createEvent(eventData);
      
      // Recargar eventos después de crear
      await loadEvents();
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadEvents]);

  const updateEvent = useCallback(async (eventId, eventData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await calendarService.updateEvent(eventId, eventData);
      
      // Recargar eventos después de actualizar
      await loadEvents();
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadEvents]);

  const deleteEvent = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await calendarService.deleteEvent(eventId);
      
      // Recargar eventos después de eliminar
      await loadEvents();
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadEvents]);

  const getEventById = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await calendarService.getEventById(eventId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventsByDate = useCallback(async (date) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await calendarService.getEventsByDate(date);
      setEvents(result.events || []);
      
      return result;
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventsByType = useCallback(async (type, typeFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await calendarService.getEventsByType(type, {
        ...filters,
        ...typeFilters
      });
      
      setEvents(result.events || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    events,
    loading,
    error,
    filters,
    pagination,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByDate,
    getEventsByType,
    updateFilters,
    resetFilters
  };
};

import { useState, useEffect } from 'react';
import { calendarService } from '../proxy/services/calendarService';

export const useCalendar = (userId = 'test_review') => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async (filters = {}) => {
    try {
      console.log('🔄 useCalendar: Iniciando fetchEvents...');
      setLoading(true);
      setError(null);
      const response = await calendarService.getEvents(userId, filters);
      console.log('✅ useCalendar: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useCalendar: Datos a guardar:', data);
      setEvents(Array.isArray(data) ? data : []);
      console.log('✅ useCalendar: events actualizado');
    } catch (err) {
      console.error('❌ useCalendar: Error:', err);
      setError(err.message || 'Error al cargar eventos del calendario');
    } finally {
      setLoading(false);
      console.log('🔄 useCalendar: Loading terminado');
    }
  };

  const createEvent = async (eventData) => {
    try {
      console.log('🔄 useCalendar: Iniciando createEvent...');
      setLoading(true);
      setError(null);
      const response = await calendarService.createEvent(userId, eventData);
      console.log('✅ useCalendar: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useCalendar: Datos a guardar:', data);
      // Actualizar la lista de eventos después de crear
      await fetchEvents();
      console.log('✅ useCalendar: createEvent completado');
      return data;
    } catch (err) {
      console.error('❌ useCalendar: Error:', err);
      setError(err.message || 'Error al crear evento');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useCalendar: Loading terminado');
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      console.log('🔄 useCalendar: Iniciando updateEvent...');
      setLoading(true);
      setError(null);
      const response = await calendarService.updateEvent(userId, eventId, eventData);
      console.log('✅ useCalendar: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useCalendar: Datos a guardar:', data);
      // Actualizar la lista de eventos después de actualizar
      await fetchEvents();
      console.log('✅ useCalendar: updateEvent completado');
      return data;
    } catch (err) {
      console.error('❌ useCalendar: Error:', err);
      setError(err.message || 'Error al actualizar evento');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useCalendar: Loading terminado');
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      console.log('🔄 useCalendar: Iniciando deleteEvent...');
      setLoading(true);
      setError(null);
      const response = await calendarService.deleteEvent(userId, eventId);
      console.log('✅ useCalendar: Respuesta recibida:', response);
      // Actualizar la lista de eventos después de eliminar
      await fetchEvents();
      console.log('✅ useCalendar: deleteEvent completado');
      return response;
    } catch (err) {
      console.error('❌ useCalendar: Error:', err);
      setError(err.message || 'Error al eliminar evento');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useCalendar: Loading terminado');
    }
  };

  const getEventsByDate = async (date) => {
    try {
      console.log('🔄 useCalendar: Iniciando getEventsByDate...');
      setLoading(true);
      setError(null);
      const response = await calendarService.getEventsByDate(userId, date);
      console.log('✅ useCalendar: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useCalendar: Datos a guardar:', data);
      console.log('✅ useCalendar: getEventsByDate completado');
      return data;
    } catch (err) {
      console.error('❌ useCalendar: Error:', err);
      setError(err.message || 'Error al obtener eventos por fecha');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useCalendar: Loading terminado');
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
  };
};
import { useState, useRef } from 'react';
import { momsWeekService } from '../proxy/services/momsWeekService';

export const useMomsWeek = (userId = 'test_review') => {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [weekStats, setWeekStats] = useState(null);
  const [weekHistory, setWeekHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inFlightRef = useRef(false);
  const debounceRef = useRef(null);

  const fetchCurrentWeek = async () => {
    if (inFlightRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchCurrentWeek(), 300);
      return;
    }
    try {
      inFlightRef.current = true;
      setLoading(true);
      setError(null);
      const response = await momsWeekService.getCurrentWeek(userId);
      const data = response.data || response;
      setCurrentWeek(data);
    } catch (err) {
      setError(err.message || 'Error al cargar semana actual');
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  };

  const fetchWeekStats = async (weekId) => {
    try {
      console.log('🔄 useMomsWeek: Iniciando fetchWeekStats...');
      setLoading(true);
      setError(null);
      const response = await momsWeekService.getWeekStats(userId, weekId);
      console.log('✅ useMomsWeek: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useMomsWeek: Datos a guardar:', data);
      setWeekStats(data);
      console.log('✅ useMomsWeek: weekStats actualizado');
    } catch (err) {
      console.error('❌ useMomsWeek: Error:', err);
      setError(err.message || 'Error al cargar estadísticas de la semana');
    } finally {
      setLoading(false);
      console.log('🔄 useMomsWeek: Loading terminado');
    }
  };

  const fetchWeekHistory = async (filters = {}) => {
    try {
      console.log('🔄 useMomsWeek: Iniciando fetchWeekHistory...');
      setLoading(true);
      setError(null);
      const response = await momsWeekService.getWeekHistory(userId, filters);
      console.log('✅ useMomsWeek: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useMomsWeek: Datos a guardar:', data);
      setWeekHistory(Array.isArray(data) ? data : []);
      console.log('✅ useMomsWeek: weekHistory actualizado');
    } catch (err) {
      console.error('❌ useMomsWeek: Error:', err);
      setError(err.message || 'Error al cargar historial de semanas');
    } finally {
      setLoading(false);
      console.log('🔄 useMomsWeek: Loading terminado');
    }
  };

  const createWeek = async (weekData) => {
    try {
      console.log('🔄 useMomsWeek: Iniciando createWeek...');
      setLoading(true);
      setError(null);
      const response = await momsWeekService.createWeek(userId, weekData);
      console.log('✅ useMomsWeek: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useMomsWeek: Datos a guardar:', data);
      // Actualizar la semana actual después de crear
      // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
      // await fetchCurrentWeek();
      console.log('✅ useMomsWeek: createWeek completado');
      return data;
    } catch (err) {
      console.error('❌ useMomsWeek: Error:', err);
      setError(err.message || 'Error al crear nueva semana');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useMomsWeek: Loading terminado');
    }
  };

  const generateWeeklyBook = async (weekId) => {
    try {
      console.log('🔄 useMomsWeek: Iniciando generateWeeklyBook...');
      setLoading(true);
      setError(null);
      const response = await momsWeekService.generateWeeklyBook(userId, weekId);
      console.log('✅ useMomsWeek: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useMomsWeek: Datos a guardar:', data);
      console.log('✅ useMomsWeek: generateWeeklyBook completado');
      return data;
    } catch (err) {
      console.error('❌ useMomsWeek: Error:', err);
      setError(err.message || 'Error al generar libro semanal');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useMomsWeek: Loading terminado');
    }
  };

  return {
    currentWeek,
    weekStats,
    weekHistory,
    loading,
    error,
    fetchCurrentWeek,
    fetchWeekStats,
    fetchWeekHistory,
    createWeek,
    generateWeeklyBook,
  };
};
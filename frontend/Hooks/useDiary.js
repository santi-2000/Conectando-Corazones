import { useState, useRef } from 'react';
import { diaryService } from '../proxy/services/diaryService';

export const useDiary = (userId = 'test_review') => {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inFlightRef = useRef(false);
  const debounceRef = useRef(null);

  const fetchEntries = async (filters = {}) => {
    if (inFlightRef.current) {
      console.log('🔄 useDiary: petición en curso, debounce...');
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchEntries(filters), 300);
      return;
    }
    try {
      inFlightRef.current = true;
      setLoading(true);
      setError(null);
      const response = await diaryService.getEntries(userId, filters);
      const data = response.data || response;
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar entradas del diario');
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('🔄 useDiary: Iniciando fetchStats...');
      setLoading(true);
      setError(null);
      const response = await diaryService.getStats(userId);
      console.log('✅ useDiary: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useDiary: Datos a guardar:', data);
      setStats(data);
      console.log('✅ useDiary: stats actualizado');
    } catch (err) {
      console.error('❌ useDiary: Error:', err);
      setError(err.message || 'Error al cargar estadísticas del diario');
    } finally {
      setLoading(false);
      console.log('🔄 useDiary: Loading terminado');
    }
  };

  const createEntry = async (entryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await diaryService.createEntry(userId, entryData);
      const data = response.data || response;
      return data;
    } catch (err) {
      setError(err.message || 'Error al crear entrada del diario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (entryId, entryData) => {
    try {
      console.log('🔄 useDiary: Iniciando updateEntry...');
      setLoading(true);
      setError(null);
      const response = await diaryService.updateEntry(userId, entryId, entryData);
      console.log('✅ useDiary: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useDiary: Datos a guardar:', data);
      // Actualizar la lista de entradas después de actualizar
      // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
      // await fetchEntries();
      console.log('✅ useDiary: updateEntry completado');
      return data;
    } catch (err) {
      console.error('❌ useDiary: Error:', err);
      setError(err.message || 'Error al actualizar entrada del diario');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useDiary: Loading terminado');
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      console.log('🔄 useDiary: Iniciando deleteEntry...');
      setLoading(true);
      setError(null);
      const response = await diaryService.deleteEntry(userId, entryId);
      console.log('✅ useDiary: Respuesta recibida:', response);
      // Actualizar la lista de entradas después de eliminar
      // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
      // await fetchEntries();
      console.log('✅ useDiary: deleteEntry completado');
      return response;
    } catch (err) {
      console.error('❌ useDiary: Error:', err);
      setError(err.message || 'Error al eliminar entrada del diario');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useDiary: Loading terminado');
    }
  };

  const generatePDF = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await diaryService.generatePDF(userId, filters);
      return response;
    } catch (err) {
      setError(err.message || 'Error al generar PDF del diario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    entries,
    stats,
    loading,
    error,
    fetchEntries,
    fetchStats,
    createEntry,
    updateEntry,
    deleteEntry,
    generatePDF,
  };
};
import { useState, useEffect } from 'react';
import { diaryService } from '../proxy/services/diaryService';

export const useDiary = (userId = 'test_review') => {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEntries = async (filters = {}) => {
    // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
    console.log('🔄 useDiary: fetchEntries DESHABILITADO temporalmente');
    return;
    
    // Evitar múltiples llamadas simultáneas
    if (loading) {
      console.log('🔄 useDiary: Ya hay una petición en curso, saltando...');
      return;
    }
    
    try {
      console.log('🔄 useDiary: Iniciando fetchEntries...');
      setLoading(true);
      setError(null);
      const response = await diaryService.getEntries(userId, filters);
      console.log('✅ useDiary: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useDiary: Datos a guardar:', data);
      setEntries(Array.isArray(data) ? data : []);
      console.log('✅ useDiary: entries actualizado');
    } catch (err) {
      console.error('❌ useDiary: Error:', err);
      setError(err.message || 'Error al cargar entradas del diario');
    } finally {
      setLoading(false);
      console.log('🔄 useDiary: Loading terminado');
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
    // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
    console.log('🔄 useDiary: createEntry DESHABILITADO temporalmente');
    return { success: true, message: 'Función deshabilitada temporalmente' };
    
    try {
      console.log('🔄 useDiary: Iniciando createEntry...');
      setLoading(true);
      setError(null);
      const response = await diaryService.createEntry(userId, entryData);
      console.log('✅ useDiary: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useDiary: Datos a guardar:', data);
      // Actualizar la lista de entradas después de crear
      // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
      // await fetchEntries();
      console.log('✅ useDiary: createEntry completado');
      return data;
    } catch (err) {
      console.error('❌ useDiary: Error:', err);
      setError(err.message || 'Error al crear entrada del diario');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useDiary: Loading terminado');
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
    // TEMPORALMENTE DESHABILITADO PARA EVITAR BUCLE INFINITO
    console.log('🔄 useDiary: generatePDF DESHABILITADO temporalmente');
    return { success: true, message: 'Función deshabilitada temporalmente' };
    
    try {
      console.log('🔄 useDiary: Iniciando generatePDF...');
      setLoading(true);
      setError(null);
      const response = await diaryService.generatePDF(userId, filters);
      console.log('✅ useDiary: Respuesta recibida:', response);
      console.log('✅ useDiary: generatePDF completado');
      return response; // Devolver la respuesta completa, no solo data
    } catch (err) {
      console.error('❌ useDiary: Error:', err);
      setError(err.message || 'Error al generar PDF del diario');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useDiary: Loading terminado');
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
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
      // Forzar actualización sin caché
      const response = await diaryService.getEntries(userId, { ...filters, noCache: true });
      const payload = response?.data || response;
      const dataEntries = Array.isArray(payload?.entries) ? payload.entries : [];
      console.log('✅ useDiary: Entradas actualizadas:', dataEntries.length);
      setEntries(dataEntries);
      // opcional: si vienen estadísticas en el mismo payload
      if (payload?.estadisticas) {
        setStats(payload.estadisticas);
      }
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
      
      // Verificar si es un error 409 (duplicado) - diaryService lo retorna sin lanzar
      if (response?.httpStatus === 409 || response?.code === 'DUPLICATE_ENTRY') {
        console.log('⚠️ useDiary: createEntry retornó error 409, lanzando...');
        throw response; // Lanzar para que screen15 lo maneje correctamente
      }
      
      // Si la respuesta tiene success: false, es un error
      if (response?.success === false) {
        console.log('⚠️ useDiary: createEntry retornó success: false, lanzando...');
        throw response;
      }
      
      // Extraer los datos - puede venir como response.data o directamente como objeto de entrada
      let data;
      if (response?.data) {
        // Si viene envuelto en { success: true, data: {...} }
        data = response.data;
      } else if (response?.id && response?.fecha) {
        // Si viene directamente como objeto de entrada (id, fecha, contenido, etc.)
        data = response;
      } else {
        // Fallback: usar response tal cual
        data = response;
      }
      
      // Actualizar la lista de entradas después de crear
      setTimeout(() => {
        fetchEntries();
      }, 100);
      
      return data;
    } catch (err) {
      // Si es un 409, re-lanzarlo tal cual para que screen15 lo maneje
      if (err?.httpStatus === 409 || err?.code === 'DUPLICATE_ENTRY') {
        throw err;
      }
      setError(err.message || 'Error al crear entrada del diario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (entryId, entryData) => {
    try {
      console.log('🔄 useDiary.updateEntry: Iniciando...', { entryId, entryData });
      setLoading(true);
      setError(null);
      const response = await diaryService.updateEntry(userId, entryId, entryData);
      console.log('✅ useDiary.updateEntry: Respuesta recibida:', response);
      const data = response.data || response;
      console.log('📊 useDiary.updateEntry: Datos actualizados:', data);
      
      // Actualizar la lista de entradas después de actualizar
      // Esperar un momento para asegurar que el backend terminó de procesar
      setTimeout(() => {
        console.log('🔄 useDiary.updateEntry: Refrescando entradas...');
        fetchEntries();
      }, 200);
      
      console.log('✅ useDiary.updateEntry: Completado, refresh programado');
      return data;
    } catch (err) {
      console.error('❌ useDiary.updateEntry: Error:', err);
      setError(err.message || 'Error al actualizar entrada del diario');
      throw err;
    } finally {
      setLoading(false);
      console.log('🔄 useDiary.updateEntry: Loading terminado');
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
import { useState, useEffect } from 'react';
import { faforeService } from '../proxy/services/faforeService';

export const useFafore = () => {
  const [faforeInfo, setFaforeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFaforeInfo = async () => {
    try {
      console.log('🔄 useFafore: Iniciando fetchFaforeInfo...');
      setLoading(true);
      setError(null);
      console.log('🔄 useFafore: Llamando a faforeService.getInfo()...');
      const response = await faforeService.getInfo();
      console.log('✅ useFafore: Respuesta recibida:', response);
      console.log('📊 useFafore: response.data:', response.data);
      // Usar response.data si existe, sino usar response directamente
      const data = response.data || response;
      console.log('📊 useFafore: Datos a guardar:', data);
      setFaforeInfo(data);
      console.log('✅ useFafore: faforeInfo actualizado');
    } catch (err) {
      console.error('❌ useFafore: Error:', err);
      setError(err.message || 'Error al cargar información de FAFORE');
    } finally {
      setLoading(false);
      console.log('🔄 useFafore: Loading terminado');
    }
  };

  const updateFaforeInfo = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await faforeService.updateInfo(data);
      setFaforeInfo(response.data);
      return response;
    } catch (err) {
      setError(err.message || 'Error al actualizar información de FAFORE');
      console.error('Error en updateFaforeInfo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    faforeInfo,
    loading,
    error,
    fetchFaforeInfo,
    updateFaforeInfo,
  };
};

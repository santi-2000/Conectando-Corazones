import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Hook para detectar automáticamente la IP de la red
 * y configurar la URL del backend dinámicamente
 */
export const useNetworkConfig = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:3000/api/v1');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    detectNetworkIP();
  }, []);

  const detectNetworkIP = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // En desarrollo, intentar detectar la IP automáticamente
      if (__DEV__) {
        const networkIP = await getNetworkIP();
        if (networkIP && networkIP !== 'localhost') {
          setApiBaseUrl(`http://${networkIP}:3000/api/v1`);
          console.log(`🌐 IP de red detectada: ${networkIP}`);
        } else {
          console.log('🌐 Usando localhost como fallback');
        }
      }
    } catch (err) {
      console.warn('Error al detectar IP de red:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getNetworkIP = async () => {
    try {
      // En React Native, usar una librería como react-native-network-info
      // o hacer una petición a un servicio externo
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      
      // Esto te dará tu IP pública, pero necesitamos la IP local
      // Por ahora, usaremos un método alternativo
      return await getLocalIP();
    } catch (error) {
      console.warn('Error al obtener IP externa:', error);
      return await getLocalIP();
    }
  };

  const getLocalIP = async () => {
    try {
      // Método alternativo: hacer una petición a un endpoint del backend
      // que devuelva la IP del servidor
      const response = await fetch('http://localhost:3000/api/v1/network-info');
      const data = await response.json();
      
      if (data.success && data.data.ip) {
        return data.data.ip;
      }
      
      return 'localhost';
    } catch (error) {
      console.warn('Error al obtener IP local:', error);
      return 'localhost';
    }
  };

  const setCustomIP = (ip) => {
    if (ip && ip.trim()) {
      setApiBaseUrl(`http://${ip.trim()}:3000/api/v1`);
      console.log(`🌐 IP personalizada configurada: ${ip}`);
    }
  };

  const resetToLocalhost = () => {
    setApiBaseUrl('http://localhost:3000/api/v1');
    console.log('🌐 Reseteado a localhost');
  };

  return {
    apiBaseUrl,
    isLoading,
    error,
    setCustomIP,
    resetToLocalhost,
    detectNetworkIP
  };
};

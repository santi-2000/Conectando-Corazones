import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Resolver dinámicamente la URL base del backend según el entorno (web/simulador/dispositivo)
const resolveApiBaseUrl = () => {
  // Detectar si estamos en producción (GitHub Pages u otro hosting)
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname.includes('github.io') || 
     window.location.hostname.includes('github.com') ||
     window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ||
     process.env.NODE_ENV === 'production');
  
  // Si hay una variable de entorno para la URL del backend, usarla
  if (typeof window !== 'undefined' && window.ENV?.API_BASE_URL) {
    console.log('🌐 Usando API_BASE_URL de window.ENV:', window.ENV.API_BASE_URL);
    return window.ENV.API_BASE_URL;
  }
  
  // En producción, usar la URL de tu backend desplegado
  if (isProduction) {
    const prodUrl = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'https://conectando-corazones-8ias.onrender.com/api/v1';
    console.log('🌐 Producción detectada. Backend URL:', prodUrl);
    return prodUrl;
  }
  
  // Desarrollo local
  if (Platform.OS === 'web') {
    const devUrl = 'http://localhost:3000/api/v1';
    console.log('🌐 Desarrollo web. Backend URL:', devUrl);
    return devUrl;
  }
  
  // Expo: extraer IP del host (dispositivo físico/simulador)
  const expoConfig = Constants.expoConfig || Constants.manifest;
  const hostUri = expoConfig?.hostUri || expoConfig?.debuggerHost; // p.ej. 192.168.x.x:19000
  if (hostUri) {
    const host = hostUri.split(':')[0];
    const expoUrl = `http://${host}:3000/api/v1`;
    console.log('🌐 Expo. Backend URL:', expoUrl);
    return expoUrl;
  }
  // Fallback manual (ajustar si tu IP LAN es distinta)
  const fallbackUrl = 'http://192.168.0.22:3000/api/v1';
  console.log('🌐 Fallback. Backend URL:', fallbackUrl);
  return fallbackUrl;
};

// Configuración de la aplicación
export const CONFIG = {
  // URL base del backend - detección automática compatible con dispositivo
  API_BASE_URL: resolveApiBaseUrl(),
  
  // Configuración de la aplicación
  APP_NAME: 'Conectando Corazones',
  APP_VERSION: '1.0.0',
  
  // Configuración de desarrollo
  DEBUG: true,
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 segundos
  
  // Configuración de autenticación
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
  
  // Configuración de paginación
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

// URLs específicas de endpoints
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh'
  },
  
  // Libros Educativos
  EDUCATIONAL_BOOKS: {
    LIST: '/educational-books',
    DETAIL: '/educational-books',
    SEARCH: '/educational-books/search',
    CATEGORIES: '/educational-books/categories'
  },
  
  // Directorio de Apoyos
  SUPPORT_DIRECTORIES: {
    LIST: '/support-directories',
    DETAIL: '/support-directories',
    BY_CATEGORY: '/support-directories/category'
  },
  
  // FAFORE
  FAFORE: {
    INFO: '/fafore/info',
    SERVICES: '/fafore/services'
  },
  
  // Moms Week
  MOMS_WEEK: {
    CURRENT_WEEK: '/moms-week',
    GENERATE_BOOK: '/moms-week',
    HISTORY: '/moms-week',
    STATS: '/moms-week'
  },
  
  // Diario
  DIARY: {
    ENTRIES: '/diary',
    CREATE: '/diary',
    UPDATE: '/diary',
    DELETE: '/diary',
    STATS: '/diary'
  },
  
  // Calendario
  CALENDAR: {
    EVENTS: '/calendar/events',
    CREATE: '/calendar/events',
    UPDATE: '/calendar/events',
    DELETE: '/calendar/events'
  },
  
  // Lecturas Infantiles
  CHILDREN_READINGS: {
    LIST: '/children-readings',
    RECOMMENDED: '/children-readings/recommended'
  },
  
  // Administración
  ADMIN: {
    STATS_USERS: '/admin/statistics/users',
    STATS_EVENTS: '/admin/statistics/events',
    STATS_PDFS: '/admin/statistics/pdfs',
    STATS_WEEKLY: '/admin/statistics/weekly',
    STATS_MONTHLY: '/admin/statistics/monthly'
  }
};

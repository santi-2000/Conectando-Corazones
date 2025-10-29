// Configuración de la aplicación
export const CONFIG = {
  // URL base del backend - Se detecta automáticamente
  API_BASE_URL: process.env.REACT_NATIVE_API_URL || 'http://localhost:3000/api/v1',
  
  // Configuración de la aplicación
  APP_NAME: 'Conectando Corazones',
  APP_VERSION: '1.0.0',
  
  // Configuración de desarrollo
  DEBUG: true,
  
  // Timeouts
  REQUEST_TIMEOUT: 10000, // 10 segundos
  
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

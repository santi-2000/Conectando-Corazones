import { CONFIG, API_ENDPOINTS } from '../constants/config';

/**
 * Cliente HTTP para comunicarse con el backend
 * Maneja autenticación, errores y configuración centralizada
 */
class ApiClient {
  constructor() {
    this.baseURL = CONFIG.API_BASE_URL;
    this.timeout = CONFIG.REQUEST_TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Obtiene el token de autenticación del almacenamiento local
   */
  getAuthToken() {
    try {
      return localStorage.getItem(CONFIG.TOKEN_KEY);
    } catch (error) {
      console.warn('No se pudo obtener el token de autenticación:', error);
      return null;
    }
  }

  /**
   * Obtiene los headers de autenticación
   */
  getAuthHeaders() {
    const token = this.getAuthToken();
    if (token) {
      return {
        ...this.defaultHeaders,
        'Authorization': `Bearer ${token}`
      };
    }
    return this.defaultHeaders;
  }

  /**
   * Maneja errores de respuesta HTTP
   */
  handleError(error) {
    console.error('Error en API Client:', error);
    
    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Solicitud inválida');
        case 401:
          // Token expirado o inválido
          this.clearAuth();
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        case 403:
          throw new Error('No tienes permisos para realizar esta acción');
        case 404:
          throw new Error('Recurso no encontrado');
        case 500:
          throw new Error('Error interno del servidor');
        default:
          throw new Error(data.message || 'Error desconocido');
      }
    } else if (error.request) {
      // Error de red
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Otro tipo de error
      throw new Error(error.message || 'Error inesperado');
    }
  }

  /**
   * Limpia los datos de autenticación
   */
  clearAuth() {
    try {
      localStorage.removeItem(CONFIG.TOKEN_KEY);
      localStorage.removeItem(CONFIG.USER_KEY);
    } catch (error) {
      console.warn('No se pudieron limpiar los datos de autenticación:', error);
    }
  }

  /**
   * Realiza una petición HTTP
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      headers = {},
      requireAuth = true,
      ...otherOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = requireAuth ? this.getAuthHeaders() : this.defaultHeaders;

    const config = {
      method,
      headers: {
        ...requestHeaders,
        ...headers
      },
      ...otherOptions
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          response: {
            status: response.status,
            data: errorData
          }
        };
      }

      const result = await response.json();
      
      // Log para debugging en desarrollo
      if (CONFIG.DEBUG) {
        console.log(`API ${method} ${endpoint}:`, result);
      }

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Métodos HTTP específicos
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', data });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Instancia singleton del cliente API
const apiClient = new ApiClient();

export default apiClient;
export { API_ENDPOINTS };

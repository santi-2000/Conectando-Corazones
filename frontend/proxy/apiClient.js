import { CONFIG, API_ENDPOINTS } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  async getAuthToken() {
    try {
      return await AsyncStorage.getItem(CONFIG.TOKEN_KEY);
    } catch (error) {
      console.warn('No se pudo obtener el token de autenticación:', error);
      return null;
    }
  }

  /**
   * Obtiene los headers de autenticación
   */
  async getAuthHeaders() {
    const token = await this.getAuthToken();
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
    // Evitar spamear consola para errores esperados (p.ej. 409)
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
        case 409:
          // Conflicto (e.g., DUPLICATE_ENTRY): devolvemos el payload para que el caller decida
          return { ...data, httpStatus: 409 };
        case 500:
          throw new Error(data.message || 'Error interno del servidor');
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
  async clearAuth() {
    try {
      await AsyncStorage.removeItem(CONFIG.TOKEN_KEY);
      await AsyncStorage.removeItem(CONFIG.USER_KEY);
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
    const requestHeaders = requireAuth ? await this.getAuthHeaders() : this.defaultHeaders;

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
      console.log(`🌐 API ${method} ${url}`);
      console.log('📤 Request config:', { method, headers: config.headers, body: config.body ? 'present' : 'none' });
      
      const response = await fetch(url, config);
      
      console.log(`📥 Response status: ${response.status} ${response.statusText}`);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', { status: response.status, data: errorData });
        throw {
          response: {
            status: response.status,
            data: errorData
          }
        };
      }

      const result = await response.json();
      
      // Log para debugging
      console.log(`✅ API ${method} ${endpoint} success:`, result);

      return result;
    } catch (error) {
      console.error(`❌ API ${method} ${endpoint} error:`, error);
      const handled = this.handleError(error);
      if (handled !== undefined) {
        return handled;
      }
    }
  }

  // Métodos HTTP específicos
  async get(endpoint, options = {}) {
    // Construir URL con parámetros de query
    let finalEndpoint = endpoint;
    if (options.params) {
      const params = new URLSearchParams();
      Object.keys(options.params).forEach(key => {
        if (options.params[key] !== undefined && options.params[key] !== null) {
          params.append(key, options.params[key]);
        }
      });
      const queryString = params.toString();
      if (queryString) {
        finalEndpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}${queryString}`;
      }
    }
    return this.request(finalEndpoint, { ...options, method: 'GET' });
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

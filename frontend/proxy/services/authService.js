import apiClient, { API_ENDPOINTS } from '../apiClient';

/**
 * Servicio para manejar autenticación
 */
class AuthService {
  /**
   * Iniciar sesión
   */
  async login(identifier, password) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        { identifier, password },
        { requireAuth: false }
      );

      if (response.success && response.data.token) {
        // Guardar token y datos del usuario
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        };
      }

      throw new Error(response.message || 'Error al iniciar sesión');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(userData) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        userData,
        { requireAuth: false }
      );

      if (response.success && response.data.token) {
        // Guardar token y datos del usuario
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        };
      }

      throw new Error(response.message || 'Error al registrar usuario');
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  logout() {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      return !!(token && userData);
    } catch (error) {
      console.warn('Error al verificar autenticación:', error);
      return false;
    }
  }

  /**
   * Obtener datos del usuario actual
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Error al obtener usuario actual:', error);
      return null;
    }
  }

  /**
   * Verificar si el usuario es administrador
   */
  isAdmin() {
    try {
      const user = this.getCurrentUser();
      return user && user.isAdmin === true;
    } catch (error) {
      console.warn('Error al verificar rol de administrador:', error);
      return false;
    }
  }
}

export default new AuthService();

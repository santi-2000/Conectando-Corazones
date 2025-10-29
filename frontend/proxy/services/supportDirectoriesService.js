import apiClient, { API_ENDPOINTS } from '../apiClient';

/**
 * Servicio para manejar directorio de apoyos
 */
class SupportDirectoriesService {
  /**
   * Obtener lista de directorios de apoyo
   */
  async getDirectories(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.search) queryParams.append('search', filters.search);

      const endpoint = `${API_ENDPOINTS.SUPPORT_DIRECTORIES.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener directorios de apoyo:', error);
      throw error;
    }
  }

  /**
   * Obtener directorio por ID
   */
  async getDirectoryById(directoryId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SUPPORT_DIRECTORIES.DETAIL}/${directoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener directorio:', error);
      throw error;
    }
  }

  /**
   * Obtener directorios por categoría
   */
  async getDirectoriesByCategory(category, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('category', category);
      
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const endpoint = `${API_ENDPOINTS.SUPPORT_DIRECTORIES.BY_CATEGORY}/${category}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener directorios por categoría:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías disponibles
   */
  async getCategories() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SUPPORT_DIRECTORIES.LIST}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  /**
   * Buscar directorios
   */
  async searchDirectories(searchTerm, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', searchTerm);
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const endpoint = `${API_ENDPOINTS.SUPPORT_DIRECTORIES.LIST}/search?${queryParams.toString()}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al buscar directorios:', error);
      throw error;
    }
  }
}

const supportDirectoriesService = new SupportDirectoriesService();
export { supportDirectoriesService };
export default supportDirectoriesService;

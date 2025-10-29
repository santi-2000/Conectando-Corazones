import apiClient, { API_ENDPOINTS } from '../apiClient';

/**
 * Servicio para manejar libros educativos
 */
class EducationalBooksService {
  /**
   * Obtener lista de libros educativos
   */
  async getBooks(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar filtros como parámetros de consulta
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.language) queryParams.append('language', filters.language);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.search) queryParams.append('search', filters.search);

      const endpoint = `${API_ENDPOINTS.EDUCATIONAL_BOOKS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener libros educativos:', error);
      throw error;
    }
  }

  /**
   * Obtener libro por ID
   */
  async getBookById(bookId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.EDUCATIONAL_BOOKS.DETAIL}/${bookId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener libro:', error);
      throw error;
    }
  }

  /**
   * Buscar libros
   */
  async searchBooks(searchTerm, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', searchTerm);
      
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.language) queryParams.append('language', filters.language);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const endpoint = `${API_ENDPOINTS.EDUCATIONAL_BOOKS.SEARCH}?${queryParams.toString()}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al buscar libros:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías disponibles
   */
  async getCategories() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EDUCATIONAL_BOOKS.CATEGORIES);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  /**
   * Obtener libros por categoría
   */
  async getBooksByCategory(category, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('category', category);
      
      if (filters.language) queryParams.append('language', filters.language);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const endpoint = `${API_ENDPOINTS.EDUCATIONAL_BOOKS.LIST}?${queryParams.toString()}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener libros por categoría:', error);
      throw error;
    }
  }

  /**
   * Obtener libros por materia
   */
  async getBooksBySubject(subject, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('subject', subject);
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.language) queryParams.append('language', filters.language);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const endpoint = `${API_ENDPOINTS.EDUCATIONAL_BOOKS.LIST}?${queryParams.toString()}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener libros por materia:', error);
      throw error;
    }
  }
}

export default new EducationalBooksService();

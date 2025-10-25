/**
 * Service para Libros Educativos
 * Contiene la lógica de negocio
 */

const educationalBookRepository = require('../repositories/EducationalBookRepository');

class EducationalBookService {
  /**
   * Obtener todos los libros con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>}
   */
  async getBooks(filters = {}) {
    try {
      const books = await educationalBookRepository.findAll(filters);
      
      return {
        success: true,
        data: books.map(book => book.toApiResponse()),
        total: books.length,
        filters: filters
      };
    } catch (error) {
      throw new Error(`Error al obtener libros educativos: ${error.message}`);
    }
  }

  /**
   * Obtener libro por ID
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getBookById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID de libro inválido');
      }

      const book = await educationalBookRepository.findById(id);
      
      if (!book) {
        return {
          success: false,
          message: 'Libro no encontrado'
        };
      }

      return {
        success: true,
        data: book.toApiResponse()
      };
    } catch (error) {
      throw new Error(`Error al obtener libro por ID: ${error.message}`);
    }
  }

  /**
   * Obtener libros por nivel educativo
   * @param {string} nivel 
   * @returns {Promise<Object>}
   */
  async getBooksByLevel(nivel) {
    try {
      if (!nivel) {
        throw new Error('Nivel educativo es requerido');
      }

      const validLevels = ['primaria', 'secundaria'];
      if (!validLevels.includes(nivel.toLowerCase())) {
        throw new Error('Nivel educativo inválido. Debe ser "primaria" o "secundaria"');
      }

      const books = await educationalBookRepository.findByLevel(nivel.toLowerCase());
      
      return {
        success: true,
        data: books.map(book => book.toApiResponse()),
        total: books.length,
        nivel: nivel.toLowerCase()
      };
    } catch (error) {
      throw new Error(`Error al obtener libros por nivel: ${error.message}`);
    }
  }

  /**
   * Obtener materias disponibles por nivel
   * @param {string} nivel 
   * @returns {Promise<Object>}
   */
  async getSubjectsByLevel(nivel) {
    try {
      if (!nivel) {
        throw new Error('Nivel educativo es requerido');
      }

      const validLevels = ['primaria', 'secundaria'];
      if (!validLevels.includes(nivel.toLowerCase())) {
        throw new Error('Nivel educativo inválido. Debe ser "primaria" o "secundaria"');
      }

      const subjects = await educationalBookRepository.getSubjectsByLevel(nivel.toLowerCase());
      
      return {
        success: true,
        data: subjects,
        total: subjects.length,
        nivel: nivel.toLowerCase()
      };
    } catch (error) {
      throw new Error(`Error al obtener materias por nivel: ${error.message}`);
    }
  }

  /**
   * Registrar descarga de libro
   * @param {number} libroId 
   * @param {number} usuarioId 
   * @returns {Promise<Object>}
   */
  async logDownload(libroId, usuarioId) {
    try {
      if (!libroId || isNaN(libroId)) {
        throw new Error('ID de libro inválido');
      }

      if (!usuarioId || isNaN(usuarioId)) {
        throw new Error('ID de usuario inválido');
      }

      // Verificar que el libro existe
      const book = await educationalBookRepository.findById(libroId);
      if (!book) {
        throw new Error('Libro no encontrado');
      }

      const result = await educationalBookRepository.logDownload(libroId, usuarioId);
      
      return {
        success: true,
        message: 'Descarga registrada exitosamente',
        data: result
      };
    } catch (error) {
      throw new Error(`Error al registrar descarga: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de libros
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    try {
      const stats = await educationalBookRepository.getStatistics();
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = new EducationalBookService();

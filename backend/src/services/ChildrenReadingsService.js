/**
 * Service para Lecturas Infantiles
 * Contiene la lógica de negocio para libros infantiles
 */

const ChildrenReadingsRepository = require('../repositories/ChildrenReadingsRepository');

class ChildrenReadingsService {
  constructor() {
    this.repository = new ChildrenReadingsRepository();
  }

  /**
   * Obtener todas las lecturas infantiles
   * @param {Object} filters 
   * @param {Object} pagination 
   * @returns {Promise<Object>}
   */
  async getBooks(filters = {}, pagination = {}) {
    try {
      const result = await this.repository.findAll(filters, pagination);
      
      return {
        success: true,
        data: result.data,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error en getBooks:', error);
      throw new Error(`Error al obtener lecturas infantiles: ${error.message}`);
    }
  }

  /**
   * Obtener información de la biblioteca virtual
   * @returns {Promise<Object>}
   */
  async getVirtualLibrary() {
    try {
      return {
        success: true,
        data: {
          nombre: 'Biblioteca Digital Mundial',
          descripcion: 'Colección de tesoros culturales y documentos históricos de todo el mundo',
          url: 'https://www.wdl.org/es/',
          idioma: 'es',
          organizacion: 'Library of Congress',
          colaboradores: ['UNESCO', 'Bibliotecas Nacionales', 'Museos', 'Archivos'],
          caracteristicas: [
            'Más de 19,000 artículos de 193 países',
            'Materiales en más de 100 idiomas',
            'Libros, manuscritos, mapas, fotografías',
            'Acceso gratuito y multilingüe',
            'Recursos educativos de alta calidad'
          ],
          icono: '🏛️',
          color: '#4A90E2'
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener información de biblioteca virtual: ${error.message}`);
    }
  }

  /**
   * Obtener libros infantiles recomendados
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>}
   */
  async getRecommendedBooks(filters = {}) {
    try {
      const books = await this.repository.findAll(filters);
      
      return {
        success: true,
        data: books,
        total: books.length,
        filters
      };
    } catch (error) {
      throw new Error(`Error al obtener libros recomendados: ${error.message}`);
    }
  }

  /**
   * Obtener categorías de libros infantiles
   * @returns {Promise<Object>}
   */
  async getCategories() {
    try {
      const categories = await this.repository.getCategories();
      
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }

  /**
   * Obtener libro infantil por ID
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getBookById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID de libro inválido');
      }

      const book = await this.repository.findById(id);
      
      if (!book) {
        return {
          success: false,
          message: 'Libro infantil no encontrado'
        };
      }

      return {
        success: true,
        data: book
      };
    } catch (error) {
      throw new Error(`Error al obtener libro: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de libros infantiles
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    try {
      const stats = await this.repository.getStatistics();
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = ChildrenReadingsService;

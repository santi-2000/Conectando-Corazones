/**
 * Controller para Lecturas Infantiles
 * Maneja las peticiones HTTP para libros infantiles
 */

const ChildrenReadingsService = require('../services/ChildrenReadingsService');

class ChildrenReadingsController {
  constructor() {
    this.service = new ChildrenReadingsService();
  }

  /**
   * GET /children-readings
   * Obtener todas las lecturas infantiles
   */
  async getBooks(req, res) {
    try {
      const { categoria, search, page = 1, limit = 10 } = req.query;
      
      const filters = {};
      if (categoria) filters.categoria = categoria;
      if (search) filters.search = search;
      
      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await this.service.getBooks(filters, pagination);
      
      res.json({
        success: true,
        message: 'Lecturas infantiles obtenidas exitosamente',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error en getBooks:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'Error al obtener lecturas infantiles'
      });
    }
  }

  /**
   * GET /children-readings/virtual-library
   * Obtener información de la biblioteca virtual
   */
  async getVirtualLibrary(req, res) {
    try {
      const result = await this.service.getVirtualLibrary();
      
      res.json({
        success: true,
        message: 'Información de biblioteca virtual obtenida exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getVirtualLibrary:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /children-readings/recommended
   * Obtener libros infantiles recomendados
   */
  async getRecommendedBooks(req, res) {
    try {
      const { categoria } = req.query;
      
      const filters = {
        categoria
      };

      const result = await this.service.getRecommendedBooks(filters);
      
      res.json({
        success: true,
        message: 'Libros infantiles recomendados obtenidos exitosamente',
        data: result.data,
        total: result.total,
        filters: result.filters
      });
    } catch (error) {
      console.error('Error en getRecommendedBooks:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /children-readings/categories
   * Obtener categorías de libros infantiles
   */
  async getCategories(req, res) {
    try {
      const result = await this.service.getCategories();
      
      res.json({
        success: true,
        message: 'Categorías de libros infantiles obtenidas exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getCategories:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /children-readings/:id
   * Obtener libro infantil específico por ID
   */
  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.service.getBookById(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json({
        success: true,
        message: 'Libro infantil obtenido exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getBookById:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /children-readings/stats
   * Obtener estadísticas de libros infantiles
   */
  async getStatistics(req, res) {
    try {
      const result = await this.service.getStatistics();
      
      res.json({
        success: true,
        message: 'Estadísticas de libros infantiles obtenidas exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getStatistics:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = ChildrenReadingsController;

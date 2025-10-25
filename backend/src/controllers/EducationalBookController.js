/**
 * Controller para Libros Educativos
 * Maneja las peticiones HTTP
 */

const educationalBookService = require('../services/EducationalBookService');

class EducationalBookController {
  /**
   * GET /educational-books
   * Obtener lista de libros educativos
   */
  async getBooks(req, res) {
    try {
      const { nivel_educativo, materia, search } = req.query;
      
      const filters = {
        nivel_educativo,
        materia,
        search
      };

      const result = await educationalBookService.getBooks(filters);
      
      res.json({
        success: true,
        message: 'Libros educativos obtenidos exitosamente',
        data: result.data,
        total: result.total,
        filters: result.filters
      });
    } catch (error) {
      console.error('Error en getBooks:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /educational-books/:id
   * Obtener libro específico por ID
   */
  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const result = await educationalBookService.getBookById(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json({
        success: true,
        message: 'Libro obtenido exitosamente',
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
   * GET /educational-books/level/:nivel
   * Obtener libros por nivel educativo
   */
  async getBooksByLevel(req, res) {
    try {
      const { nivel } = req.params;
      const result = await educationalBookService.getBooksByLevel(nivel);
      
      res.json({
        success: true,
        message: `Libros de ${nivel} obtenidos exitosamente`,
        data: result.data,
        total: result.total,
        nivel: result.nivel
      });
    } catch (error) {
      console.error('Error en getBooksByLevel:', error);
      res.status(400).json({
        success: false,
        error: 'Error en la petición',
        message: error.message
      });
    }
  }

  /**
   * GET /educational-books/level/:nivel/subjects
   * Obtener materias disponibles por nivel
   */
  async getSubjectsByLevel(req, res) {
    try {
      const { nivel } = req.params;
      const result = await educationalBookService.getSubjectsByLevel(nivel);
      
      res.json({
        success: true,
        message: `Materias de ${nivel} obtenidas exitosamente`,
        data: result.data,
        total: result.total,
        nivel: result.nivel
      });
    } catch (error) {
      console.error('Error en getSubjectsByLevel:', error);
      res.status(400).json({
        success: false,
        error: 'Error en la petición',
        message: error.message
      });
    }
  }

  /**
   * POST /educational-books/:id/download
   * Registrar descarga de libro
   */
  async logDownload(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null; // Obtener userId del token si está autenticado

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado',
          message: 'Se requiere autenticación para registrar descargas.'
        });
      }

      const result = await educationalBookService.logDownload(id, userId);
      
      res.status(201).json({
        success: true,
        message: 'Descarga registrada exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en logDownload:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /educational-books/stats
   * Obtener estadísticas de libros
   */
  async getStatistics(req, res) {
    try {
      const result = await educationalBookService.getStatistics();
      
      res.json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
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

module.exports = EducationalBookController;

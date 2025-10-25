/**
 * Controller para Directorio de Apoyos
 * Maneja las peticiones HTTP
 */

const SupportDirectoryService = require('../services/SupportDirectoryService');

class SupportDirectoryController {
  constructor() {
    this.service = new SupportDirectoryService();
  }

  /**
   * GET /support-directories
   * Obtener lista de directorios
   */
  async getDirectories(req, res) {
    try {
      const { categoria, municipio, search } = req.query;
      
      const filters = {
        categoria,
        municipio,
        search
      };

      const result = await this.service.getDirectories(filters);
      
      res.json({
        success: true,
        message: 'Directorios obtenidos exitosamente',
        data: result.data,
        total: result.total,
        filters
      });
    } catch (error) {
      console.error('Error en getDirectories:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /support-directories/:id
   * Obtener directorio específico
   */
  async getDirectoryById(req, res) {
    try {
      const { id } = req.params;
      
      const result = await this.service.getDirectoryById(id);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          error: 'Directorio no encontrado',
          message: result.message
        });
      }

      res.json({
        success: true,
        message: 'Directorio obtenido exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getDirectoryById:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /support-directories/nearby
   * Buscar directorios cercanos
   */
  async getNearbyDirectories(req, res) {
    try {
      const { lat, lng, radius = 10 } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          error: 'Coordenadas requeridas',
          message: 'Debes proporcionar latitud y longitud'
        });
      }

      const result = await this.service.getNearbyDirectories(
        parseFloat(lat), 
        parseFloat(lng), 
        parseInt(radius)
      );
      
      res.json({
        success: true,
        message: 'Directorios cercanos obtenidos exitosamente',
        data: result.data,
        center: result.center,
        radius: result.radius,
        total: result.total
      });
    } catch (error) {
      console.error('Error en getNearbyDirectories:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * POST /support-directories/:id/call
   * Registrar llamada a directorio
   */
  async logCall(req, res) {
    try {
      const { id } = req.params;
      const { notas = '' } = req.body;
      const usuarioId = req.user.id; // Del middleware de autenticación
      
      const result = await this.service.logCall(id, usuarioId, notas);
      
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      console.error('Error en logCall:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /support-directories/categories
   * Obtener categorías de directorios
   */
  async getCategories(req, res) {
    try {
      const result = await this.service.getCategories();
      
      res.json({
        success: true,
        message: 'Categorías obtenidas exitosamente',
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
   * GET /support-directories/stats
   * Obtener estadísticas
   */
  async getStatistics(req, res) {
    try {
      const result = await this.service.getStatistics();
      
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

module.exports = SupportDirectoryController;

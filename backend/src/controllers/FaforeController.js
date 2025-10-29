const FaforeService = require('../services/FaforeService');

class FaforeController {
  constructor() {
    this.service = new FaforeService();
  }

  /**
   * Obtener información completa de FAfore
   * @param {Object} req 
   * @param {Object} res 
   */
  async getInfo(req, res) {
    try {
      const result = await this.service.getInfo();
      res.json(result);
    } catch (error) {
      console.error('Error en getInfo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener información de contacto
   * @param {Object} req 
   * @param {Object} res 
   */
  async getContactInfo(req, res) {
    try {
      const result = await this.service.getContactInfo();
      res.json(result);
    } catch (error) {
      console.error('Error en getContactInfo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener servicios
   * @param {Object} req 
   * @param {Object} res 
   */
  async getServices(req, res) {
    try {
      const result = await this.service.getServices();
      res.json(result);
    } catch (error) {
      console.error('Error en getServices:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener horarios de atención
   * @param {Object} req 
   * @param {Object} res 
   */
  async getSchedule(req, res) {
    try {
      const result = await this.service.getSchedule();
      res.json(result);
    } catch (error) {
      console.error('Error en getSchedule:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener información legal
   * @param {Object} req 
   * @param {Object} res 
   */
  async getLegalInfo(req, res) {
    try {
      const result = await this.service.getLegalInfo();
      res.json(result);
    } catch (error) {
      console.error('Error en getLegalInfo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener valores de la organización
   * @param {Object} req 
   * @param {Object} res 
   */
  async getValues(req, res) {
    try {
      const result = await this.service.getValues();
      res.json(result);
    } catch (error) {
      console.error('Error en getValues:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener colores de la marca
   * @param {Object} req 
   * @param {Object} res 
   */
  async getBrandColors(req, res) {
    try {
      const result = await this.service.getBrandColors();
      res.json(result);
    } catch (error) {
      console.error('Error en getBrandColors:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener información básica
   * @param {Object} req 
   * @param {Object} res 
   */
  async getBasicInfo(req, res) {
    try {
      const result = await this.service.getBasicInfo();
      res.json(result);
    } catch (error) {
      console.error('Error en getBasicInfo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = FaforeController;

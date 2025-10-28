//pantalla de directorio de apoyos 

/**
 * Módulo de Directorio de Apoyos
 * Orquesta todos los componentes del módulo
 */

const express = require('express');
const supportDirectoryRoutes = require('../routes/supportDirectoryRoutes');

class SupportDirectoryModule {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Configurar rutas del módulo
   */
  setupRoutes() {
    this.router.use('/support-directories', supportDirectoryRoutes);
  }

  /**
   * Obtener el router del módulo
   * @returns {express.Router}
   */
  getRouter() {
    return this.router;
  }

  /**
   * Obtener información del módulo
   * @returns {Object}
   */
  getModuleInfo() {
    return {
      name: 'Support Directory Module',
      version: '1.0.0',
      description: 'Módulo para gestión de directorio de apoyos',
      endpoints: [
        'GET /support-directories - Lista de directorios',
        'GET /support-directories/:id - Directorio específico',
        'GET /support-directories/nearby - Directorios cercanos',
        'GET /support-directories/stats - Estadísticas',
        'POST /support-directories/:id/call - Registrar llamada'
      ]
    };
  }
}

module.exports = SupportDirectoryModule;

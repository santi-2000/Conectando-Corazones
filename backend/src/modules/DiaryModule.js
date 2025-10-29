const express = require('express');
const diaryRoutes = require('../routes/diaryRoutes');

/**
 * Módulo para manejar las rutas del diario
 * pantalla de diario diario con diseño colorido y emotivo
 */
class DiaryModule {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Configurar rutas del diario
   */
  setupRoutes() {
    console.log('🔍 DiaryModule: Configurando rutas...');
    this.router.use('/diary', diaryRoutes);
    console.log('✅ DiaryModule: Rutas configuradas');
  }

  /**
   * Obtener router del módulo
   * @returns {express.Router}
   */
  getRouter() {
    return this.router;
  }
}

module.exports = DiaryModule;

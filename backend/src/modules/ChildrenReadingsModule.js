/**
 * Módulo de Lecturas Infantiles
 * Orquesta todos los componentes del módulo
 */

const express = require('express');
const childrenReadingsRoutes = require('../routes/childrenReadingsRoutes');

class ChildrenReadingsModule {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Configurar rutas del módulo
   */
  setupRoutes() {
    this.router.use('/children-readings', childrenReadingsRoutes);
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
      name: 'Children Readings Module',
      version: '1.0.0',
      description: 'Módulo para gestión de lecturas infantiles',
      endpoints: [
        'GET /children-readings/virtual-library - Información de biblioteca virtual',
        'GET /children-readings/recommended - Libros infantiles recomendados',
        'GET /children-readings/categories - Categorías de libros infantiles',
        'GET /children-readings/stats - Estadísticas de libros infantiles',
        'GET /children-readings/:id - Libro infantil específico'
      ]
    };
  }
}

module.exports = ChildrenReadingsModule;

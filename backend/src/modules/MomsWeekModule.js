//pantalla de seguimiento semanal de mamás

/**
 * Módulo de Moms Week
 * Orquesta todos los componentes del módulo
 */

const express = require('express');
const momsWeekRoutes = require('../routes/momsWeekRoutes');

class MomsWeekModule {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Configurar rutas del módulo
   */
  setupRoutes() {
    this.router.use('/moms-week', momsWeekRoutes);
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
      name: 'Moms Week Module',
      version: '1.0.0',
      description: 'Módulo para seguimiento semanal de mamás',
      endpoints: [
        'GET /moms-week/:userId/current - Información de la semana actual',
        'GET /moms-week/:userId/progress - Progreso de días completados',
        'GET /moms-week/:userId/statistics - Estadísticas de la semana',
        'POST /moms-week/:userId/entry - Agregar entrada del día',
        'GET /moms-week/:userId/generate-book - Generar libro semanal',
        'GET /moms-week/:userId/history - Historial de semanas'
      ]
    };
  }
}

module.exports = MomsWeekModule;

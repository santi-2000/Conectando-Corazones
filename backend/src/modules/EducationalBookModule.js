//pantalla de libros educativos nivel primario y secundario

/**
 * @class EducationalBookModule
 * @description Encapsula la lógica y las rutas relacionadas con los libros educativos.
 */
class EducationalBookModule {
  constructor() {
    this.router = require('express').Router();
    this.setupRoutes();
  }

  /**
   * Configura todas las rutas para el módulo de libros educativos.
   */
  setupRoutes() {
    const educationalBookRoutes = require('../routes/educationalBookRoutes');
    this.router.use('/educational-books', educationalBookRoutes);
  }

  /**
   * Obtiene el router configurado para este módulo.
   * @returns {express.Router} El router de Express con las rutas del módulo.
   */
  getRouter() {
    return this.router;
  }
}

module.exports = EducationalBookModule;

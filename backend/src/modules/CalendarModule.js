const express = require('express');
const calendarRoutes = require('../routes/calendarRoutes');

class CalendarModule {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    // Configurar rutas del calendario
    this.router.use('/calendar', calendarRoutes);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CalendarModule;

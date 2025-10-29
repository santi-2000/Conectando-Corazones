const express = require('express');

class AdminStatisticsModule {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    const adminStatisticsRoutes = require('../routes/adminStatisticsRoutes');
    this.router.use('/', adminStatisticsRoutes);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AdminStatisticsModule;

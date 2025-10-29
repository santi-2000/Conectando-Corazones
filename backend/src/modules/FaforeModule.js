const express = require('express');

class FaforeModule {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    const faforeRoutes = require('../routes/faforeRoutes');
    this.router.use('/fafore', faforeRoutes);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = FaforeModule;

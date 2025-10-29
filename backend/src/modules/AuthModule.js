const express = require('express');

class AuthModule {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    const authRoutes = require('../routes/authRoutes');
    this.router.use('/', authRoutes);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AuthModule;

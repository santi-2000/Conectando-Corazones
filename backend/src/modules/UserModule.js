const express = require('express');

class UserModule {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    const userRoutes = require('../routes/userRoutes');
    this.router.use('/', userRoutes);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UserModule;

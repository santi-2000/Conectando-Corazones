const express = require('express');
const UserController = require('../controllers/UserController');
const { optionalAuth, requireAdmin } = require('../../middleware/auth');

const router = express.Router();
const controller = new UserController();

// Rutas para usuarios
router.get('/user/current', optionalAuth, async (req, res) => {
  await controller.getCurrentUser(req, res);
});

router.get('/user/:userId', optionalAuth, async (req, res) => {
  await controller.getUserById(req, res);
});

router.get('/user/check-admin', optionalAuth, async (req, res) => {
  await controller.checkAdminStatus(req, res);
});

module.exports = router;

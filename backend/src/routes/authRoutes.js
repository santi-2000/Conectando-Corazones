const express = require('express');
const AuthController = require('../controllers/AuthController');
const { optionalAuth, authenticateToken } = require('../../middleware/auth');

const router = express.Router();
const controller = new AuthController();

// Middleware de validación básica
const validateRegister = (req, res, next) => {
  const { username, nombre, apellido, email, password } = req.body;
  
  if (!username || !nombre || !apellido || !password) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos',
      message: 'Nombre de usuario, nombre, apellido y contraseña son requeridos'
    });
  }

  // Validar formato de username (solo letras, números y guiones)
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      success: false,
      error: 'Nombre de usuario inválido',
      message: 'El nombre de usuario debe tener entre 3-20 caracteres y solo puede contener letras, números, guiones y guiones bajos'
    });
  }

  // Validar formato de email si se proporciona
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido',
        message: 'El formato del email no es válido'
      });
    }
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Contraseña muy corta',
      message: 'La contraseña debe tener al menos 6 caracteres'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;
  
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos',
      message: 'Nombre de usuario/email y contraseña son requeridos'
    });
  }

  next();
};

// Rutas de autenticación
router.post('/auth/register', validateRegister, async (req, res) => {
  await controller.register(req, res);
});

router.post('/auth/login', validateLogin, async (req, res) => {
  await controller.login(req, res);
});

router.post('/auth/logout', optionalAuth, async (req, res) => {
  await controller.logout(req, res);
});

router.get('/auth/verify', optionalAuth, async (req, res) => {
  await controller.verifyToken(req, res);
});

router.put('/auth/change-password', authenticateToken, async (req, res) => {
  await controller.changePassword(req, res);
});

module.exports = router;

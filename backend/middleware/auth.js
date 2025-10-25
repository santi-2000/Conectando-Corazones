const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token de acceso requerido',
        message: 'Debes incluir un token de autorización en el header'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await query(
      'SELECT id, nombre, email, rol_id, estado FROM usuarios WHERE id = ? AND estado = "activo"',
      [decoded.userId]
    );

    if (!user.length) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'El usuario no existe o está inactivo'
      });
    }

    req.user = user[0];
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'El token proporcionado no es válido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'El token ha expirado, por favor inicia sesión nuevamente'
      });
    }

    console.error('Error en autenticación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al verificar la autenticación'
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.rol_id !== 1) {
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'Se requieren permisos de administrador para acceder a este recurso'
    });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await query(
        'SELECT id, nombre, email, rol_id, estado FROM usuarios WHERE id = ? AND estado = "activo"',
        [decoded.userId]
      );
      
      if (user.length) {
        req.user = user[0];
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};

const UserService = require('../services/UserService');

class UserController {
  constructor() {
    this.service = new UserService();
  }

  /**
   * Obtener información del usuario actual
   */
  async getCurrentUser(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado',
          message: 'Se requiere autenticación para acceder a esta información'
        });
      }

      const result = await this.service.getUserById(req.user.user_id);
      res.json({
        success: true,
        message: 'Información del usuario obtenida exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener información de un usuario específico (solo admin)
   */
  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getUserById(userId);
      
      res.json({
        success: true,
        message: 'Información del usuario obtenida exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error en getUserById:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Verificar si el usuario es administrador
   */
  async checkAdminStatus(req, res) {
    try {
      if (!req.user) {
        return res.json({
          success: true,
          data: {
            isAdmin: false,
            message: 'Usuario no autenticado'
          }
        });
      }

      const isAdmin = req.user.tipo_usuario === 'admin';
      res.json({
        success: true,
        data: {
          isAdmin,
          userType: req.user.tipo_usuario,
          userId: req.user.user_id
        }
      });
    } catch (error) {
      console.error('Error en checkAdminStatus:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = UserController;

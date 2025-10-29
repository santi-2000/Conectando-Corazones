const AuthService = require('../services/AuthService');
const jwt = require('jsonwebtoken');
const UserDTO = require('../dto/UserDTO');

class AuthController {
  constructor() {
    this.service = new AuthService();
  }

  /**
   * Registrar nuevo usuario
   */
  async register(req, res) {
    try {
      const { username, nombre, apellido, email, telefono, fecha_nacimiento, genero, password } = req.body;

      // Validar datos requeridos
      if (!username || !nombre || !apellido || !password) {
        return res.status(400).json({
          success: false,
          error: 'Datos incompletos',
          message: 'Nombre de usuario, nombre, apellido y contraseña son requeridos'
        });
      }

      // Generar user_id único
      const user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const userData = {
        user_id,
        username,
        nombre,
        apellido,
        email: email || null, // Email opcional
        telefono,
        fecha_nacimiento,
        genero: genero || 'otro',
        tipo_usuario: req.body.tipo_usuario || 'usuario' // Usar el valor del request o por defecto 'usuario'
      };

      const newUser = await this.service.register(userData, password);
      
      // Generar token JWT
      const token = jwt.sign(
        { userId: user_id, email: email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      // Usar DTO para respuesta consistente
      const userDTO = new UserDTO(newUser);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: userDTO.toLoginResponse(),
          token,
          expiresIn: '24h'
        }
      });
    } catch (error) {
      console.error('Error en register:', error);
      
      // Manejar errores de validación como 400
      if (error.message.includes('ya está registrado') || 
          error.message.includes('inválido') ||
          error.message.includes('incompletos')) {
        return res.status(400).json({
          success: false,
          error: 'Error de validación',
          message: error.message
        });
      }
      
      // Otros errores como 500
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'Error inesperado al registrar usuario'
      });
    }
  }

  /**
   * Iniciar sesión
   */
  async login(req, res) {
    try {
      const { identifier, password } = req.body; // identifier puede ser username o email

      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          error: 'Datos incompletos',
          message: 'Nombre de usuario/email y contraseña son requeridos'
        });
      }

      const user = await this.service.login(identifier, password);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Generar token JWT
      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      const userDTO = new UserDTO(user);
      
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: userDTO.toLoginResponse(),
          token,
          expiresIn: '24h'
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejar errores de validación como 400
      if (error.message.includes('incompletos') || 
          error.message.includes('inválido')) {
        return res.status(400).json({
          success: false,
          error: 'Error de validación',
          message: error.message
        });
      }
      
      // Otros errores como 500
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'Error inesperado al iniciar sesión'
      });
    }
  }

  /**
   * Cerrar sesión (opcional - principalmente del lado del cliente)
   */
  async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Verificar token (para validar sesión)
   */
  async verifyToken(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado',
          message: 'Token inválido o expirado'
        });
      }

      res.json({
        success: true,
        message: 'Token válido',
        data: {
          user: {
            user_id: req.user.user_id,
            nombre: req.user.nombre,
            apellido: req.user.apellido,
            email: req.user.email,
            tipo_usuario: req.user.tipo_usuario,
            isAdmin: req.user.tipo_usuario === 'admin'
          }
        }
      });
    } catch (error) {
      console.error('Error en verifyToken:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.user_id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Datos incompletos',
          message: 'Contraseña actual y nueva contraseña son requeridas'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Contraseña muy corta',
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      const result = await this.service.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error en changePassword:', error);
      res.status(400).json({
        success: false,
        error: 'Error al cambiar contraseña',
        message: error.message
      });
    }
  }
}

module.exports = AuthController;

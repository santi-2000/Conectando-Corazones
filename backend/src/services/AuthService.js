const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const { query } = require('../../config/database');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Registrar nuevo usuario
   */
  async register(userData, password) {
    try {
      // Verificar si el username ya existe
      const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
      if (existingUserByUsername) {
        throw new Error('El nombre de usuario ya está registrado');
      }

      // Verificar si el email ya existe (si se proporciona)
      if (userData.email) {
        const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
        if (existingUserByEmail) {
          throw new Error('El email ya está registrado');
        }
      }

      // Hash de la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const salt = bcrypt.genSaltSync(saltRounds);

      // Crear usuario
      const newUser = await this.userRepository.create(userData);

      // Guardar credenciales en tabla separada
      await query(
        'INSERT INTO user_credentials (user_id, password_hash, salt) VALUES (?, ?, ?)',
        [newUser.user_id, hashedPassword, salt]
      );

      return newUser;
    } catch (error) {
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  /**
   * Iniciar sesión
   */
  async login(identifier, password) {
    try {
      // Buscar usuario por username o email
      let user = await this.userRepository.findByUsername(identifier);
      if (!user) {
        user = await this.userRepository.findByEmail(identifier);
      }
      if (!user) {
        return null;
      }

      if (!user.activo) {
        return null;
      }

      // Buscar credenciales del usuario
      const credentials = await query(
        'SELECT password_hash FROM user_credentials WHERE user_id = ?',
        [user.user_id]
      );

      if (!credentials || credentials.length === 0) {
        return null;
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, credentials[0].password_hash);
      if (!isValidPassword) {
        return null;
      }

      return user;
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  }

  /**
   * Verificar si un usuario es administrador
   */
  async isAdmin(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      return user && user.tipo_usuario === 'admin';
    } catch (error) {
      return false;
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Verificar contraseña actual
      const credentials = await query(
        'SELECT password_hash FROM user_credentials WHERE user_id = ?',
        [userId]
      );

      if (!credentials || credentials.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const isValidCurrentPassword = await bcrypt.compare(currentPassword, credentials[0].password_hash);
      if (!isValidCurrentPassword) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Hash de la nueva contraseña
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      const salt = bcrypt.genSaltSync(saltRounds);

      // Actualizar contraseña
      await query(
        'UPDATE user_credentials SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [hashedNewPassword, salt, userId]
      );

      return { success: true, message: 'Contraseña actualizada exitosamente' };
    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }
}

module.exports = AuthService;

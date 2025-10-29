const UserRepository = require('../repositories/UserRepository');

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(userId) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Verificar si un usuario es administrador
   */
  async isAdmin(userId) {
    try {
      const user = await this.repository.findById(userId);
      return user && user.tipo_usuario === 'admin';
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener todos los usuarios (solo admin)
   */
  async getAllUsers() {
    try {
      const users = await this.repository.findAll();
      return users;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }
}

module.exports = UserService;

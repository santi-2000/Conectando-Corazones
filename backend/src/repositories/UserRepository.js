const { query } = require('../../config/database');

class UserRepository {
  constructor() {
    this.tableName = 'users';
  }

  /**
   * Buscar usuario por ID
   */
  async findById(userId) {
    try {
      const sql = `
        SELECT 
          id, user_id, nombre, apellido, email, telefono, 
          fecha_nacimiento, genero, tipo_usuario, activo, 
          created_at, updated_at
        FROM ${this.tableName} 
        WHERE user_id = ? AND activo = TRUE
      `;
      const [user] = await query(sql, [userId]);
      return user;
    } catch (error) {
      console.warn('Error obteniendo usuario:', error.message);
      return null;
    }
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    try {
      const sql = `
        SELECT 
          id, user_id, username, nombre, apellido, email, telefono, 
          fecha_nacimiento, genero, tipo_usuario, activo, 
          created_at, updated_at
        FROM ${this.tableName} 
        WHERE email = ? AND activo = TRUE
      `;
      const [user] = await query(sql, [email]);
      return user;
    } catch (error) {
      console.warn('Error obteniendo usuario por email:', error.message);
      return null;
    }
  }

  /**
   * Buscar usuario por username
   */
  async findByUsername(username) {
    try {
      const sql = `
        SELECT 
          id, user_id, username, nombre, apellido, email, telefono, 
          fecha_nacimiento, genero, tipo_usuario, activo, 
          created_at, updated_at
        FROM ${this.tableName} 
        WHERE username = ? AND activo = TRUE
      `;
      const [user] = await query(sql, [username]);
      return user;
    } catch (error) {
      console.warn('Error obteniendo usuario por username:', error.message);
      return null;
    }
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll() {
    try {
      const sql = `
        SELECT 
          id, user_id, nombre, apellido, email, telefono, 
          fecha_nacimiento, genero, tipo_usuario, activo, 
          created_at, updated_at
        FROM ${this.tableName} 
        WHERE activo = TRUE
        ORDER BY created_at DESC
      `;
      const users = await query(sql);
      return users;
    } catch (error) {
      console.warn('Error obteniendo usuarios:', error.message);
      return [];
    }
  }

  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    try {
      const {
        user_id,
        username,
        nombre,
        apellido,
        email,
        telefono,
        fecha_nacimiento,
        genero,
        tipo_usuario = 'usuario'
      } = userData;

      const sql = `
        INSERT INTO ${this.tableName} (
          user_id, username, nombre, apellido, email, telefono, 
          fecha_nacimiento, genero, tipo_usuario, activo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
      `;

      const result = await query(sql, [
        user_id, username, nombre, apellido, email || null, 
        telefono || null, fecha_nacimiento || null, 
        genero || 'otro', tipo_usuario
      ]);

      return { id: result.insertId, ...userData };
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Actualizar usuario
   */
  async update(userId, userData) {
    try {
      const {
        nombre,
        apellido,
        email,
        telefono,
        fecha_nacimiento,
        genero,
        tipo_usuario
      } = userData;

      const sql = `
        UPDATE ${this.tableName} 
        SET nombre = ?, apellido = ?, email = ?, telefono = ?, 
            fecha_nacimiento = ?, genero = ?, tipo_usuario = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND activo = TRUE
      `;

      await query(sql, [
        nombre, apellido, email, telefono,
        fecha_nacimiento, genero, tipo_usuario, userId
      ]);

      return { user_id: userId, ...userData };
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Desactivar usuario (soft delete)
   */
  async deactivate(userId) {
    try {
      const sql = `
        UPDATE ${this.tableName} 
        SET activo = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND activo = TRUE
      `;
      await query(sql, [userId]);
      return true;
    } catch (error) {
      throw new Error(`Error al desactivar usuario: ${error.message}`);
    }
  }
}

module.exports = UserRepository;

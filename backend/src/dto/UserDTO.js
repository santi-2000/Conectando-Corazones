/**
 * User Data Transfer Object
 * Define la estructura de datos del usuario para el frontend
 */
class UserDTO {
  constructor(userData) {
    this.id = userData.user_id || userData.id;
    this.username = userData.username;
    this.name = userData.nombre;
    this.lastName = userData.apellido || userData.apellidos;
    this.email = userData.email;
    this.phone = userData.telefono;
    this.birthDate = userData.fecha_nacimiento;
    this.gender = userData.genero || userData.sexo;
    this.userType = userData.tipo_usuario;
    this.isAdmin = userData.tipo_usuario === 'admin';
    this.isActive = userData.activo;
    this.avatar = userData.avatar_url;
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
  }

  // Método para respuesta pública (sin datos sensibles)
  toPublicResponse() {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      birthDate: this.birthDate,
      gender: this.gender,
      userType: this.userType,
      isAdmin: this.isAdmin,
      isActive: this.isActive,
      avatar: this.avatar
    };
  }

  // Método para respuesta de login
  toLoginResponse() {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      userType: this.userType,
      isAdmin: this.isAdmin
    };
  }
}

module.exports = UserDTO;

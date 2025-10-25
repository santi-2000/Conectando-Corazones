/**
 * Value Object para Directorio de Apoyos
 * Representa los datos de una asociación de apoyo
 */

class SupportDirectory {
  constructor({
    id,
    nombre,
    categoria,
    descripcion,
    contacto,
    horario,
    ubicacion,
    latitud,
    longitud,
    activo = true
  }) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.contacto = contacto;
    this.horario = horario;
    this.ubicacion = ubicacion;
    this.latitud = latitud;
    this.longitud = longitud;
    this.activo = activo;
  }

  /**
   * Validar datos del directorio
   */
  validate() {
    const errors = [];

    if (!this.nombre || this.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!this.categoria) {
      errors.push('La categoría es requerida');
    }

    if (!this.descripcion || this.descripcion.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!this.contacto) {
      errors.push('El contacto es requerido');
    }

    if (!this.horario) {
      errors.push('El horario es requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convertir a objeto plano
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      categoria: this.categoria,
      descripcion: this.descripcion,
      contacto: this.contacto,
      horario: this.horario,
      ubicacion: this.ubicacion,
      latitud: this.latitud,
      longitud: this.longitud,
      activo: this.activo
    };
  }
}

module.exports = SupportDirectory;

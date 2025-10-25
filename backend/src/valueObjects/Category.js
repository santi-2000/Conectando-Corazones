/**
 * Value Object para Categorías de Apoyo
 */

class Category {
  constructor({
    id,
    nombre,
    descripcion,
    icono,
    color,
    activo = true
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.icono = icono;
    this.color = color;
    this.activo = activo;
  }

  validate() {
    const errors = [];

    if (!this.nombre || this.nombre.trim().length < 2) {
      errors.push('El nombre de la categoría es requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      icono: this.icono,
      color: this.color,
      activo: this.activo
    };
  }
}

module.exports = Category;

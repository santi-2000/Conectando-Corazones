/**
 * Value Object para Libros Educativos
 * Representa un libro educativo con sus propiedades y validaciones
 */

class EducationalBook {
  constructor({
    id,
    titulo,
    descripcion,
    nivel_educativo,
    materia,
    archivo_url,
    autor,
    tipo,
    edad_recomendada,
    idioma,
    visualizaciones,
    activo,
    created_at,
    updated_at
  }) {
    if (!titulo) {
      throw new Error('El título del libro es requerido.');
    }
    if (!nivel_educativo) {
      throw new Error('El nivel educativo es requerido.');
    }
    if (!materia) {
      throw new Error('La materia es requerida.');
    }

    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.nivel_educativo = nivel_educativo;
    this.materia = materia;
    this.archivo_url = archivo_url;
    this.autor = autor;
    this.tipo = tipo;
    this.edad_recomendada = edad_recomendada;
    this.idioma = idioma;
    this.visualizaciones = visualizaciones;
    this.activo = activo !== undefined ? activo : true;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Método para validar si es un libro educativo válido
  isValid() {
    return this.titulo && this.nivel_educativo && this.materia;
  }

  // Método para obtener una representación limpia para la API
  toApiResponse() {
    return {
      id: this.id,
      titulo: this.titulo,
      descripcion: this.descripcion,
      nivelEducativo: this.nivel_educativo,
      materia: this.materia,
      archivoUrl: this.archivo_url,
      autor: this.autor,
      tipo: this.tipo,
      edadRecomendada: this.edad_recomendada,
      idioma: this.idioma,
      visualizaciones: this.visualizaciones,
      activo: this.activo,
      createdAt: this.created_at,
      updatedAt: this.updated_at
    };
  }

  // Método para obtener el tamaño formateado
  getFormattedSize() {
    if (!this.tamaño_bytes) return null;
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(this.tamaño_bytes) / Math.log(1024));
    return Math.round(this.tamaño_bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

module.exports = EducationalBook;

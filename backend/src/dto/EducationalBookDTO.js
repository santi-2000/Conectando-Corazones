/**
 * Educational Book Data Transfer Object
 * Define la estructura de datos de libros educativos para el frontend
 */
class EducationalBookDTO {
  constructor(bookData) {
    this.id = bookData.id;
    this.title = bookData.titulo;
    this.author = bookData.autor;
    this.publisher = bookData.editorial;
    this.isbn = bookData.isbn;
    this.categoryId = bookData.categoria_id;
    this.categoryName = bookData.categoria_nombre;
    this.educationalLevel = bookData.nivel_educativo;
    this.grade = bookData.grado;
    this.subject = bookData.materia;
    this.description = bookData.descripcion;
    this.coverUrl = bookData.portada_url;
    this.fileUrl = bookData.archivo_url || bookData.url_recurso || bookData.archivoUrl;
    this.pages = bookData.paginas;
    this.language = bookData.idioma;
    this.publicationDate = bookData.fecha_publicacion;
    this.tags = this.parseTags(bookData.tags);
    this.isActive = bookData.activo;
    this.createdAt = bookData.created_at;
    this.updatedAt = bookData.updated_at;
  }

  parseTags(tags) {
    if (!tags) return [];
    if (typeof tags === 'string') {
      try {
        return JSON.parse(tags);
      } catch {
        return tags.split(',').map(tag => tag.trim());
      }
    }
    return Array.isArray(tags) ? tags : [];
  }

  // Método para respuesta de lista
  toListResponse() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      publisher: this.publisher,
      educationalLevel: this.educationalLevel,
      grade: this.grade,
      subject: this.subject,
      description: this.description,
      coverUrl: this.coverUrl,
      fileUrl: this.fileUrl,
      archivoUrl: this.fileUrl, // Alias para compatibilidad con frontend
      pages: this.pages,
      language: this.language,
      publicationDate: this.publicationDate,
      tags: this.tags,
      category: {
        id: this.categoryId,
        name: this.categoryName
      }
    };
  }

  // Método para respuesta detallada
  toDetailResponse() {
    return {
      ...this.toListResponse(),
      isbn: this.isbn,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = EducationalBookDTO;

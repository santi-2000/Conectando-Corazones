/**
 * Diary Entry Data Transfer Object
 * Define la estructura de datos de entradas del diario para el frontend
 */
class DiaryEntryDTO {
  constructor(entryData) {
    this.id = entryData.id;
    this.userId = entryData.usuario_id;
    this.date = entryData.fecha;
    this.title = entryData.titulo;
    this.content = entryData.contenido;
    this.photos = this.parseJSON(entryData.fotos);
    this.emotions = this.parseJSON(entryData.emociones);
    this.tags = this.parseJSON(entryData.tags);
    this.mood = entryData.estado_animo;
    this.mainActivity = entryData.actividad_principal;
    this.privateNotes = entryData.notas_privadas;
    this.status = entryData.estado;
    this.createdAt = entryData.created_at;
    this.updatedAt = entryData.updated_at;
  }

  parseJSON(jsonData) {
    if (!jsonData) return [];
    if (typeof jsonData === 'string') {
      try {
        return JSON.parse(jsonData);
      } catch {
        return jsonData.split(',').map(item => item.trim());
      }
    }
    return Array.isArray(jsonData) ? jsonData : [];
  }

  // Método para respuesta de lista
  toListResponse() {
    return {
      id: this.id,
      date: this.date,
      title: this.title,
      content: this.content,
      photos: this.photos,
      emotions: this.emotions,
      tags: this.tags,
      mood: this.mood,
      mainActivity: this.mainActivity,
      status: this.status
    };
  }

  // Método para respuesta detallada
  toDetailResponse() {
    return {
      ...this.toListResponse(),
      privateNotes: this.privateNotes,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = DiaryEntryDTO;

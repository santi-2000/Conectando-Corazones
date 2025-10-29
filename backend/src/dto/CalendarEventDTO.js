/**
 * Calendar Event Data Transfer Object
 * Define la estructura de datos de eventos del calendario para el frontend
 */
class CalendarEventDTO {
  constructor(eventData) {
    this.id = eventData.id;
    this.title = eventData.titulo;
    this.description = eventData.descripcion;
    this.startDate = eventData.fecha_inicio;
    this.endDate = eventData.fecha_fin;
    this.allDay = eventData.todo_el_dia;
    this.eventType = eventData.tipo_evento;
    this.color = eventData.color;
    this.location = eventData.ubicacion;
    this.reminderMinutes = eventData.recordatorio_minutos;
    this.importance = eventData.importancia;
    this.status = eventData.estado;
    this.userId = eventData.usuario_id;
    this.createdAt = eventData.created_at;
    this.updatedAt = eventData.updated_at;
  }

  // Método para respuesta de lista
  toListResponse() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      allDay: this.allDay,
      eventType: this.eventType,
      color: this.color,
      location: this.location,
      importance: this.importance,
      status: this.status
    };
  }

  // Método para respuesta detallada
  toDetailResponse() {
    return {
      ...this.toListResponse(),
      reminderMinutes: this.reminderMinutes,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = CalendarEventDTO;

/**
 * Support Directory Data Transfer Object
 * Define la estructura de datos del directorio de apoyos para el frontend
 */
class SupportDirectoryDTO {
  constructor(supportData) {
    this.id = supportData.id;
    this.name = supportData.nombre;
    this.description = supportData.descripcion;
    this.phone = supportData.telefono;
    this.email = supportData.email;
    this.address = supportData.direccion;
    this.website = supportData.sitio_web;
    this.schedule = supportData.horarios;
    this.services = this.parseServices(supportData.servicios);
    this.requirements = supportData.requisitos;
    this.cost = supportData.costo;
    this.contactPerson = supportData.contacto_responsable;
    this.additionalNotes = supportData.notas_adicionales;
    this.categoryId = supportData.categoria_id;
    this.categoryName = supportData.categoria_nombre;
    this.isActive = supportData.activo;
    this.createdAt = supportData.created_at;
    this.updatedAt = supportData.updated_at;
  }

  parseServices(services) {
    if (!services) return [];
    if (typeof services === 'string') {
      try {
        return JSON.parse(services);
      } catch {
        return services.split(',').map(service => service.trim());
      }
    }
    return Array.isArray(services) ? services : [];
  }

  // Método para respuesta de lista
  toListResponse() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      phone: this.phone,
      email: this.email,
      address: this.address,
      website: this.website,
      schedule: this.schedule,
      services: this.services,
      cost: this.cost,
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
      requirements: this.requirements,
      contactPerson: this.contactPerson,
      additionalNotes: this.additionalNotes,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = SupportDirectoryDTO;

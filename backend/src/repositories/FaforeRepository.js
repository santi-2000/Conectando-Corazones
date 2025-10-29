const { query } = require('../../config/database');

class FaforeRepository {
  constructor() {
    this.tableName = 'fafore_info';
  }

  /**
   * Obtener información completa de FAfore
   * @returns {Promise<Object>}
   */
  async getInfo() {
    const sql = `
      SELECT 
        id, nombre, subtitulo, logo_url, mision, vision,
        valores, contacto, servicios, horarios, informacion_legal,
        redes_sociales, colores, activo, created_at, updated_at
      FROM ${this.tableName}
      WHERE activo = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const results = await query(sql);
    return results.length > 0 ? this.formatInfo(results[0]) : null;
  }

  /**
   * Obtener información de contacto
   * @returns {Promise<Object>}
   */
  async getContactInfo() {
    const sql = `
      SELECT contacto, redes_sociales
      FROM ${this.tableName}
      WHERE activo = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const results = await query(sql);
    if (results.length === 0) return null;
    
    const row = results[0];
    return {
      contacto: this.parseJson(row.contacto),
      redes_sociales: this.parseJson(row.redes_sociales)
    };
  }

  /**
   * Obtener servicios
   * @returns {Promise<Array>}
   */
  async getServices() {
    const sql = `
      SELECT servicios
      FROM ${this.tableName}
      WHERE activo = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const results = await query(sql);
    if (results.length === 0) return [];
    
    return this.parseJson(results[0].servicios);
  }

  /**
   * Obtener horarios
   * @returns {Promise<Object>}
   */
  async getSchedule() {
    const sql = `
      SELECT horarios
      FROM ${this.tableName}
      WHERE activo = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const results = await query(sql);
    if (results.length === 0) return null;
    
    return this.parseJson(results[0].horarios);
  }

  /**
   * Obtener información legal
   * @returns {Promise<Object>}
   */
  async getLegalInfo() {
    const sql = `
      SELECT informacion_legal
      FROM ${this.tableName}
      WHERE activo = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const results = await query(sql);
    if (results.length === 0) return null;
    
    return this.parseJson(results[0].informacion_legal);
  }

  /**
   * Obtener valores
   * @returns {Promise<Array>}
   */
  async getValues() {
    const sql = `
      SELECT valores
      FROM ${this.tableName}
      WHERE activo = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const results = await query(sql);
    if (results.length === 0) return [];
    
    return this.parseJson(results[0].valores);
  }

  /**
   * Obtener colores de la marca
   * @returns {Promise<Object>}
   */
  async getBrandColors() {
    const sql = `
      SELECT colores
      FROM ${this.tableName}
      WHERE activo = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const results = await query(sql);
    if (results.length === 0) return null;
    
    return this.parseJson(results[0].colores);
  }

  /**
   * Formatear información completa
   * @param {Object} row 
   * @returns {Object}
   */
  formatInfo(row) {
    return {
      id: row.id,
      nombre: row.nombre,
      subtitulo: row.subtitulo,
      logoUrl: row.logo_url,
      mision: row.mision,
      vision: row.vision,
      valores: this.parseJson(row.valores),
      contacto: this.parseJson(row.contacto),
      servicios: this.parseJson(row.servicios),
      horarios: this.parseJson(row.horarios),
      informacionLegal: this.parseJson(row.informacion_legal),
      redesSociales: this.parseJson(row.redes_sociales),
      colores: this.parseJson(row.colores),
      activo: row.activo,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Parsear JSON de forma segura
   * @param {string} jsonString 
   * @returns {Object|Array}
   */
  parseJson(jsonString) {
    try {
      if (!jsonString) return null;
      
      if (typeof jsonString === 'object') {
        return jsonString;
      }
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Error parsing JSON:', error.message);
      return null;
    }
  }
}

module.exports = FaforeRepository;

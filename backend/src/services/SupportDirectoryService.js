/**
 * Service para Directorio de Apoyos
 * Contiene la lógica de negocio
 */

const SupportDirectoryRepository = require('../repositories/SupportDirectoryRepository');
const SupportDirectory = require('../valueObjects/SupportDirectory');

class SupportDirectoryService {
  constructor() {
    this.repository = new SupportDirectoryRepository();
  }

  /**
   * Obtener todos los directorios con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>}
   */
  async getDirectories(filters = {}) {
    try {
      const directories = await this.repository.findAll(filters);
      
      return {
        success: true,
        data: directories,
        total: directories.length
      };
    } catch (error) {
      throw new Error(`Error al obtener directorios: ${error.message}`);
    }
  }

  /**
   * Obtener directorio por ID
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getDirectoryById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID de directorio inválido');
      }

      const directory = await this.repository.findById(id);
      
      if (!directory) {
        return {
          success: false,
          message: 'Directorio no encontrado'
        };
      }

      return {
        success: true,
        data: directory
      };
    } catch (error) {
      throw new Error(`Error al obtener directorio: ${error.message}`);
    }
  }

  /**
   * Buscar directorios cercanos
   * @param {number} lat 
   * @param {number} lng 
   * @param {number} radius 
   * @returns {Promise<Object>}
   */
  async getNearbyDirectories(lat, lng, radius = 10) {
    try {
      if (!lat || !lng) {
        throw new Error('Coordenadas requeridas');
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('Coordenadas inválidas');
      }

      const directories = await this.repository.findNearby(lat, lng, radius);
      
      return {
        success: true,
        data: directories,
        center: { lat, lng },
        radius,
        total: directories.length
      };
    } catch (error) {
      throw new Error(`Error al buscar directorios cercanos: ${error.message}`);
    }
  }

  /**
   * Registrar llamada a directorio
   * @param {number} directorioId 
   * @param {number} usuarioId 
   * @param {string} notas 
   * @returns {Promise<Object>}
   */
  async logCall(directorioId, usuarioId, notas = '') {
    try {
      if (!directorioId || !usuarioId) {
        throw new Error('ID de directorio y usuario requeridos');
      }

      const callLog = await this.repository.logCall(directorioId, usuarioId, notas);
      
      return {
        success: true,
        message: 'Llamada registrada exitosamente',
        data: callLog
      };
    } catch (error) {
      throw new Error(`Error al registrar llamada: ${error.message}`);
    }
  }

  /**
   * Obtener categorías de directorios
   * @returns {Promise<Object>}
   */
  async getCategories() {
    try {
      const { query } = require('../../config/database');
      
      const categoriesSql = `
        SELECT 
          c.id,
          c.nombre,
          c.icono,
          c.color,
          COUNT(a.id) as total_apoyos
        FROM apoyo_categoria c
        LEFT JOIN apoyos a ON a.categoria_id = c.id AND a.activo = TRUE
        WHERE c.activo = TRUE
        GROUP BY c.id, c.nombre, c.icono, c.color
        ORDER BY c.nombre ASC
      `;

      const categories = await query(categoriesSql);

      return {
        success: true,
        data: categories
      };
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de directorios
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    try {
      const sql = `
        SELECT
          COUNT(*) as total_apoyos,
          COUNT(DISTINCT categoria_id) as total_categorias,
          COUNT(CASE WHEN telefono IS NOT NULL AND telefono != '' THEN 1 END) as total_con_telefono,
          COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as total_con_email
        FROM apoyos
        WHERE activo = TRUE
      `;

      const { query } = require('../../config/database');
      const [stats] = await query(sql);

      // Obtener estadísticas por categoría
      const categoriesSql = `
        SELECT c.nombre, c.icono, c.color, COUNT(a.id) as total_apoyos
        FROM apoyo_categoria c
        LEFT JOIN apoyos a ON a.categoria_id = c.id AND a.activo = TRUE
        WHERE c.activo = TRUE
        GROUP BY c.id, c.nombre, c.icono, c.color
        ORDER BY total_apoyos DESC
      `;

      const categories = await query(categoriesSql);

      return {
        success: true,
        data: {
          estadisticas: stats,
          categorias: categories
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = SupportDirectoryService;

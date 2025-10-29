const FaforeRepository = require('../repositories/FaforeRepository');

class FaforeService {
  constructor() {
    this.repository = new FaforeRepository();
  }

  /**
   * Obtener información completa de FAfore
   * @returns {Promise<Object>}
   */
  async getInfo() {
    try {
      const info = await this.repository.getInfo();
      
      if (!info) {
        throw new Error('No se encontró información de FAfore');
      }

      return {
        success: true,
        message: 'Información de FAfore obtenida exitosamente',
        data: info
      };
    } catch (error) {
      throw new Error(`Error al obtener información de FAfore: ${error.message}`);
    }
  }

  /**
   * Obtener información de contacto
   * @returns {Promise<Object>}
   */
  async getContactInfo() {
    try {
      const contactInfo = await this.repository.getContactInfo();
      
      if (!contactInfo) {
        throw new Error('No se encontró información de contacto');
      }

      return {
        success: true,
        message: 'Información de contacto obtenida exitosamente',
        data: contactInfo
      };
    } catch (error) {
      throw new Error(`Error al obtener información de contacto: ${error.message}`);
    }
  }

  /**
   * Obtener servicios
   * @returns {Promise<Object>}
   */
  async getServices() {
    try {
      const services = await this.repository.getServices();
      
      return {
        success: true,
        message: 'Servicios obtenidos exitosamente',
        data: {
          servicios: services,
          total: services.length
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener servicios: ${error.message}`);
    }
  }

  /**
   * Obtener horarios de atención
   * @returns {Promise<Object>}
   */
  async getSchedule() {
    try {
      const schedule = await this.repository.getSchedule();
      
      if (!schedule) {
        throw new Error('No se encontraron horarios de atención');
      }

      return {
        success: true,
        message: 'Horarios obtenidos exitosamente',
        data: schedule
      };
    } catch (error) {
      throw new Error(`Error al obtener horarios: ${error.message}`);
    }
  }

  /**
   * Obtener información legal
   * @returns {Promise<Object>}
   */
  async getLegalInfo() {
    try {
      const legalInfo = await this.repository.getLegalInfo();
      
      if (!legalInfo) {
        throw new Error('No se encontró información legal');
      }

      return {
        success: true,
        message: 'Información legal obtenida exitosamente',
        data: legalInfo
      };
    } catch (error) {
      throw new Error(`Error al obtener información legal: ${error.message}`);
    }
  }

  /**
   * Obtener valores de la organización
   * @returns {Promise<Object>}
   */
  async getValues() {
    try {
      const values = await this.repository.getValues();
      
      return {
        success: true,
        message: 'Valores obtenidos exitosamente',
        data: {
          valores: values,
          total: values.length
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener valores: ${error.message}`);
    }
  }

  /**
   * Obtener colores de la marca
   * @returns {Promise<Object>}
   */
  async getBrandColors() {
    try {
      const colors = await this.repository.getBrandColors();
      
      if (!colors) {
        throw new Error('No se encontraron colores de marca');
      }

      return {
        success: true,
        message: 'Colores de marca obtenidos exitosamente',
        data: colors
      };
    } catch (error) {
      throw new Error(`Error al obtener colores de marca: ${error.message}`);
    }
  }

  /**
   * Obtener información básica (solo datos esenciales)
   * @returns {Promise<Object>}
   */
  async getBasicInfo() {
    try {
      const info = await this.repository.getInfo();
      
      if (!info) {
        throw new Error('No se encontró información básica');
      }

      // Retornar solo información básica
      const basicInfo = {
        nombre: info.nombre,
        subtitulo: info.subtitulo,
        logoUrl: info.logoUrl,
        mision: info.mision,
        vision: info.vision,
        valores: info.valores,
        contacto: info.contacto
      };

      return {
        success: true,
        message: 'Información básica obtenida exitosamente',
        data: basicInfo
      };
    } catch (error) {
      throw new Error(`Error al obtener información básica: ${error.message}`);
    }
  }
}

module.exports = FaforeService;

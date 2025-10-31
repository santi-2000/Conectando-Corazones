import apiClient from '../apiClient';
import { uploadService } from './uploadService';

async function ensureUploadedPhotos(entryData) {
  if (!entryData || !entryData.fotos) return entryData;
  const fotos = entryData.fotos;
  const result = [];
  for (const f of fotos) {
    if (!f) continue;
    if (typeof f === 'object' && f.url) {
      result.push(f);
      continue;
    }
    if (typeof f === 'string') {
      const isRemote = f.startsWith('http://') || f.startsWith('https://') || f.startsWith('/');
      if (isRemote) {
        result.push({ url: f });
      } else if (f.startsWith('file:')) {
        const url = await uploadService.uploadPhoto(f);
        if (url) result.push({ url });
      } else {
        // nombre suelto -> usar como caption
        result.push({ caption: f });
      }
    }
  }
  return { ...entryData, fotos: result };
}

export const diaryService = {
  /**
   * Crear entrada de diario
   * @param {string} userId - ID del usuario
   * @param {Object} entryData - Datos de la entrada
   * @returns {Promise<Object>}
   */
  async createEntry(userId, entryData) {
    try {
      console.log('🔍 diaryService.createEntry: Iniciando petición...');
      const prepared = await ensureUploadedPhotos(entryData);
      const response = await apiClient.post(`/diary/${userId}/daily-entry`, prepared);
      console.log('✅ diaryService.createEntry: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ diaryService.createEntry: Error:', error);
      // Si el apiClient devolvió un payload 409 ya normalizado, retornarlo sin lanzar
      if (error?.httpStatus === 409 || error?.code === 'DUPLICATE_ENTRY') {
        return error;
      }
      throw new Error(error.response?.data?.message || error.message || 'Error al crear entrada de diario');
    }
  },

  /**
   * Obtener entradas del diario (semana actual)
   * @param {string} userId - ID del usuario
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>}
   */
  async getEntries(userId, filters = {}) {
    try {
      console.log('🔍 diaryService.getEntries: Iniciando petición...', filters);
      // Si noCache está en filters, asegurar que se agregue timestamp a la URL
      const params = { ...filters };
      if (params.noCache) {
        params._t = Date.now();
        delete params.noCache;
      }
      const response = await apiClient.get(`/diary/${userId}/weekly`, { params });
      console.log('✅ diaryService.getEntries: Respuesta recibida:', response?.data?.entries?.length || 0, 'entradas');
      return response;
    } catch (error) {
      console.error('❌ diaryService.getEntries: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener entradas del diario');
    }
  },

  /**
   * Obtener entrada por ID
   * @param {string} userId - ID del usuario
   * @param {string} entryId - ID de la entrada
   * @returns {Promise<Object>}
   */
  async getEntryById(userId, entryId) {
    try {
      console.log('🔍 diaryService.getEntryById: Iniciando petición...');
      const response = await apiClient.get(`/diary/${userId}/entries/${entryId}`);
      console.log('✅ diaryService.getEntryById: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ diaryService.getEntryById: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener entrada del diario');
    }
  },

  /**
   * Actualizar entrada del diario
   * @param {string} userId - ID del usuario
   * @param {string} entryId - ID de la entrada
   * @param {Object} entryData - Datos actualizados
   * @returns {Promise<Object>}
   */
  async updateEntry(userId, entryId, entryData) {
    try {
      console.log('🔍 diaryService.updateEntry: Iniciando petición...');
      const prepared = await ensureUploadedPhotos(entryData);
      const response = await apiClient.put(`/diary/${userId}/entries/${entryId}`, prepared);
      console.log('✅ diaryService.updateEntry: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ diaryService.updateEntry: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar entrada del diario');
    }
  },

  /**
   * Eliminar entrada del diario
   * @param {string} userId - ID del usuario
   * @param {string} entryId - ID de la entrada
   * @returns {Promise<Object>}
   */
  async deleteEntry(userId, entryId) {
    try {
      console.log('🔍 diaryService.deleteEntry: Iniciando petición...');
      const response = await apiClient.delete(`/diary/${userId}/entries/${entryId}`);
      console.log('✅ diaryService.deleteEntry: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ diaryService.deleteEntry: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar entrada del diario');
    }
  },

  /**
   * Generar PDF del diario
   * @param {string} userId - ID del usuario
   * @param {string} weekId - ID de la semana (opcional)
   * @returns {Promise<Object>}
   */
  async generatePDF(userId, pdfData = null) {
    try {
      console.log('🔍 diaryService.generatePDF: Iniciando petición...');
      // Si pdfData está presente, enviarlo directamente; si no, usar método anterior
      const payload = pdfData ? { pdfData } : {};
      const response = await apiClient.post(`/diary/${userId}/generate-pdf`, payload);
      console.log('✅ diaryService.generatePDF: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ diaryService.generatePDF: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al generar PDF del diario');
    }
  },

  /**
   * Obtener estadísticas del diario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getStats(userId) {
    try {
      console.log('🔍 diaryService.getStats: Iniciando petición...');
      const response = await apiClient.get(`/diary/${userId}/stats`);
      console.log('✅ diaryService.getStats: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ diaryService.getStats: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas del diario');
    }
  }
};
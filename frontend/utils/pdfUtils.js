/**
 * Utilidades para manejo de URLs de PDF
 */

import { CONFIG } from '../constants/config';

/**
 * Construye la URL completa de un PDF de manera dinámica
 * @param {string} pdfPath - Ruta relativa del PDF (ej: "/pdfs/filename.pdf")
 * @returns {string} URL completa del PDF
 */
export const buildPdfUrl = (pdfPath) => {
  if (!pdfPath) {
    console.warn('buildPdfUrl: pdfPath es undefined o null');
    return null;
  }

  // Si ya es una URL completa, devolverla tal como está
  if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) {
    return pdfPath;
  }

  // Extraer la URL base del backend (sin /api/v1)
  const baseUrl = CONFIG.API_BASE_URL.replace('/api/v1', '');
  
  // Construir la URL completa
  const fullUrl = `${baseUrl}${pdfPath}`;
  
  console.log(`🔗 PDF URL construida: ${fullUrl}`);
  return fullUrl;
};

/**
 * Valida si una URL de PDF es accesible
 * @param {string} pdfUrl - URL del PDF a validar
 * @returns {Promise<boolean>} true si es accesible, false si no
 */
export const validatePdfUrl = async (pdfUrl) => {
  try {
    if (!pdfUrl) return false;
    
    const response = await fetch(pdfUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Error validando PDF URL:', error);
    return false;
  }
};

/**
 * Obtiene la URL base del backend para archivos estáticos
 * @returns {string} URL base del backend
 */
export const getBackendBaseUrl = () => {
  return CONFIG.API_BASE_URL.replace('/api/v1', '');
};

/**
 * Servicio para generar PDFs con diseño bonito
 * Genera PDFs coloridos y emotivos para el diario semanal
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const moment = require('moment');

class PDFGeneratorService {
  constructor() {
    this.outputDir = path.join(__dirname, '../../public/pdfs');
    this.ensureOutputDir();
  }

  /**
   * Asegurar que el directorio de salida existe
   */
  async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Error creando directorio de PDFs:', error);
    }
  }

  /**
   * Generar PDF del diario semanal con diseño bonito
   * @param {Object} data - Datos de la semana
   * @param {string} userId - ID del usuario
   * @returns {Promise<string>} - Ruta del PDF generado
   */
  async generateWeeklyDiaryPDF(data, userId) {
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      
      // Generar HTML con diseño bonito
      const html = this.generateBeautifulHTML(data);
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Generar nombre único para el archivo
      const weekNumber = data.weekNumber || moment().week();
      const fileName = `diario-semanal-${userId}-semana-${weekNumber}-${Date.now()}.pdf`;
      const filePath = path.join(this.outputDir, fileName);
      
      // Generar PDF con configuración optimizada para impresión
      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          right: '10mm',
          bottom: '15mm',
          left: '10mm'
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true,
        // Optimizaciones para impresión
        scale: 0.8,
        landscape: false,
        // Configuraciones de color para impresión
        colorScheme: 'light'
      });

      await browser.close();
      
      // Limpiar PDFs antiguos (mantener solo los últimos 5)
      await this.cleanupOldPDFs(userId);
      
      return filePath;
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw new Error(`Error al generar PDF: ${error.message}`);
    }
  }

  /**
   * Limpiar PDFs antiguos para evitar acumulación
   * @param {string} userId - ID del usuario
   */
  async cleanupOldPDFs(userId) {
    try {
      const files = await fs.readdir(this.outputDir);
      const userPDFs = files
        .filter(file => file.startsWith(`diario-semanal-${userId}-`) && file.endsWith('.pdf'))
        .map(file => ({
          name: file,
          path: path.join(this.outputDir, file),
          stats: null
        }));

      // Obtener estadísticas de archivos
      for (let pdf of userPDFs) {
        try {
          const stats = await fs.stat(pdf.path);
          pdf.stats = stats;
        } catch (error) {
          console.log(`No se pudo obtener stats de ${pdf.name}`);
        }
      }

      // Ordenar por fecha de modificación (más recientes primero)
      const validPDFs = userPDFs.filter(pdf => pdf.stats).sort((a, b) => b.stats.mtime - a.stats.mtime);

      // Mantener solo los últimos 5 PDFs
      const pdfsToDelete = validPDFs.slice(5);
      
      for (const pdf of pdfsToDelete) {
        try {
          await fs.unlink(pdf.path);
          console.log(`🗑️ PDF eliminado: ${pdf.name}`);
        } catch (error) {
          console.log(`Error eliminando PDF ${pdf.name}:`, error.message);
        }
      }

      if (pdfsToDelete.length > 0) {
        console.log(`🧹 Limpieza completada: ${pdfsToDelete.length} PDFs antiguos eliminados`);
      }
    } catch (error) {
      console.error('Error en limpieza de PDFs:', error);
    }
  }

  /**
   * Generar HTML bonito para el PDF (solo fotos, comentarios y emociones)
   * @param {Object} data - Datos de la semana
   * @returns {string} - HTML generado
   */
  generateBeautifulHTML(data) {
    const weekNumber = data.weekNumber || moment().week();
    const dateRange = data.dateRange || 'Esta semana';
    const childName = data.childName || 'Mi hijo/a';
    const momName = data.momName || 'Mamá';
    const days = data.days || [];

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Diario Semanal - Semana ${weekNumber}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Comic Neue', cursive;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #333;
                line-height: 1.6;
                padding: 20px;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .header {
                background: white;
                padding: 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
                border-bottom: 3px solid #006400;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.3)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.3)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.3)"/></svg>');
                animation: float 20s infinite linear;
            }
            
            @keyframes float {
                0% { transform: translateX(-50px) translateY(-50px); }
                100% { transform: translateX(50px) translateY(50px); }
            }
            
            .header h1 {
                font-size: 2.5em;
                color: #006400;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                margin-bottom: 10px;
                position: relative;
                z-index: 1;
                font-weight: bold;
            }
            
            .header .subtitle {
                font-size: 1.2em;
                color: #228B22;
                opacity: 0.9;
                position: relative;
                z-index: 1;
                font-weight: 500;
            }
            
            .week-info {
                background: white;
                padding: 20px;
                text-align: center;
                border-bottom: 3px solid #006400;
            }
            
            .week-info h2 {
                font-size: 1.8em;
                color: #006400;
                margin-bottom: 10px;
                font-weight: bold;
            }
            
            .week-info .date-range {
                font-size: 1.1em;
                color: #666;
                font-weight: 300;
            }
            
            .days-section {
                margin: 20px;
            }
            
            .days-section h3 {
                font-size: 1.5em;
                color: #333;
                margin-bottom: 20px;
                text-align: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .day-card {
                background: linear-gradient(135deg, #006400 0%, #228B22 100%);
                margin: 20px 0;
                border-radius: 15px;
                padding: 25px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                position: relative;
                overflow: hidden;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            .day-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #006400, #228B22, #32CD32);
            }
            
            .day-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .day-name {
                font-size: 1.4em;
                font-weight: bold;
                color: #fff;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .day-date {
                font-size: 1.1em;
                color: #fff;
                opacity: 0.9;
            }
            
            .day-content {
                background: rgba(255,255,255,0.95);
                padding: 20px;
                border-radius: 15px;
                margin-top: 15px;
            }
            
            .photos-section {
                margin-bottom: 20px;
            }
            
            .photos-section h4 {
                font-size: 1.2em;
                color: #333;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .photos-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .photo-item {
                background: linear-gradient(135deg, #90EE90 0%, #98FB98 100%);
                padding: 15px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 5px 10px rgba(0,0,0,0.1);
            }
            
            .photo-placeholder {
                width: 100%;
                height: 120px;
                background: linear-gradient(135deg, #E0FFE0 0%, #90EE90 100%);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2em;
                color: #006400;
                margin-bottom: 10px;
                font-weight: 500;
            }
            
            .photo-caption {
                font-size: 0.9em;
                color: #333;
                font-style: italic;
            }
            
            .comments-section {
                margin-bottom: 20px;
            }
            
            .comments-section h4 {
                font-size: 1.2em;
                color: #333;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .comment-item {
                background: linear-gradient(135deg, #90EE90 0%, #98FB98 100%);
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 10px;
                box-shadow: 0 3px 8px rgba(0,0,0,0.1);
            }
            
            .comment-text {
                font-size: 1em;
                color: #333;
                line-height: 1.5;
            }
            
            .emotions-section {
                margin-bottom: 20px;
            }
            
            .emotions-section h4 {
                font-size: 1.2em;
                color: #333;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .emotions {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .emotion-tag {
                background: linear-gradient(135deg, #90EE90 0%, #98FB98 100%);
                padding: 8px 15px;
                border-radius: 25px;
                font-size: 1em;
                color: #006400;
                box-shadow: 0 3px 8px rgba(0,0,0,0.1);
                font-weight: 500;
            }
            
            .footer {
                background: linear-gradient(135deg, #006400 0%, #228B22 100%);
                padding: 20px;
                text-align: center;
                color: white;
                margin-top: 30px;
            }
            
            .footer p {
                font-size: 1.1em;
                margin-bottom: 10px;
            }
            
            .footer .love {
                font-size: 1.5em;
                color: #ffffff;
            }
            
            .sparkles {
                position: absolute;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
            
            .sparkle {
                position: absolute;
                color: #ffd700;
                font-size: 1.5em;
                animation: sparkle 2s infinite;
            }
            
            @keyframes sparkle {
                0%, 100% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(1); }
            }
            
            .sparkle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
            .sparkle:nth-child(2) { top: 30%; right: 15%; animation-delay: 0.5s; }
            .sparkle:nth-child(3) { top: 60%; left: 20%; animation-delay: 1s; }
            .sparkle:nth-child(4) { top: 70%; right: 25%; animation-delay: 1.5s; }
            
            .empty-day {
                text-align: center;
                padding: 20px;
                color: #666;
                font-style: italic;
                background: rgba(255,255,255,0.5);
                border-radius: 10px;
                border: 2px dashed #ccc;
            }
            
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                body {
                    margin: 0;
                    padding: 10px;
                    background: white !important;
                }
                
                .container {
                    box-shadow: none !important;
                    border: 1px solid #ddd;
                }
                
                .day-card {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    margin: 10px 0;
                }
                
                .header {
                    background: white !important;
                    border-bottom: 2px solid #006400;
                }
                
                .week-info {
                    background: white !important;
                    border-bottom: 2px solid #006400;
                }
                
                .footer {
                    background: #f8f9fa !important;
                    color: #333 !important;
                    border-top: 2px solid #006400;
                }
                
                .photo-placeholder {
                    border: 1px solid #ddd;
                    background: #f8f9fa !important;
                    color: #666 !important;
                }
                
                .emotion-tag, .comment-item, .photo-item {
                    border: 1px solid #ddd;
                    background: #f8f9fa !important;
                    color: #333 !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Diario Semanal</h1>
                <div class="subtitle">${childName} y ${momName}</div>
            </div>
            
            <div class="week-info">
                <h2>Semana ${weekNumber}</h2>
                <div class="date-range">${dateRange}</div>
            </div>
            
            <div class="days-section">
                <h3>Días de la Semana</h3>
                ${this.generateDaysHTML(days)}
            </div>
            
            <div class="footer">
                <p>Creado con amor para ${childName}</p>
                <p class="love">${momName}</p>
                <p>Generado el ${moment().format('DD/MM/YYYY')}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Generar HTML para los días de la semana (7 días completos, solo fotos, comentarios y emociones)
   * @param {Array} days - Array de días
   * @returns {string} - HTML de los días
   */
  generateDaysHTML(days) {
    // Generar los 7 días de la semana (lunes a domingo)
    const weekDays = [];
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Lunes
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      
      const dayNumber = i + 1;
      const dayName = this.getDayName(dayNumber);
      const dateStr = moment(dayDate).format('DD/MM/YYYY');
      
      // Buscar si hay datos para este día
      const dayData = days.find(d => d.dia === dayNumber) || {};
      
      weekDays.push({
        dayNumber,
        dayName,
        date: dateStr,
        dateObj: dayDate,
        emotions: Array.isArray(dayData.emociones) ? dayData.emociones : [],
        tags: Array.isArray(dayData.tags) ? dayData.tags : [],
        photos: Array.isArray(dayData.fotos) ? dayData.fotos : [],
        comments: Array.isArray(dayData.comentarios) ? dayData.comentarios : []
      });
    }

    return weekDays.map(day => {
      return `
        <div class="day-card">
          <div class="day-header">
            <div class="day-name">${day.dayName}</div>
            <div class="day-date">${day.date}</div>
          </div>
          <div class="day-content">
            ${day.photos.length > 0 ? `
              <div class="photos-section">
                <h4>Fotos del día</h4>
                <div class="photos-grid">
                  ${day.photos.map(photo => `
                    <div class="photo-item">
                      <div class="photo-placeholder">Foto</div>
                      <div class="photo-caption">${photo.caption || 'Momento especial'}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            ${day.comments.length > 0 ? `
              <div class="comments-section">
                <h4>Comentarios</h4>
                ${day.comments.map(comment => `
                  <div class="comment-item">
                    <div class="comment-text">${comment}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${day.emotions.length > 0 ? `
              <div class="emotions-section">
                <h4>Emociones</h4>
                <div class="emotions">
                  ${day.emotions.map(emotion => `<span class="emotion-tag">${emotion}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${day.tags.length > 0 ? `
              <div class="emotions-section">
                <h4>Tags</h4>
                <div class="emotions">
                  ${day.tags.map(tag => `<span class="emotion-tag">${tag}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${day.photos.length === 0 && day.comments.length === 0 && day.emotions.length === 0 && day.tags.length === 0 ? `
              <div class="empty-day">
                <p>Sin entradas para este día</p>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Obtener nombre del día
   * @param {number} dayNumber - Número del día (1-7)
   * @returns {string} - Nombre del día
   */
  getDayName(dayNumber) {
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return dayNames[dayNumber - 1] || 'Día';
  }

  /**
   * Generar URL pública para el PDF
   * @param {string} filePath - Ruta del archivo
   * @returns {string} - URL pública
   */
  getPublicURL(filePath) {
    const fileName = path.basename(filePath);
    return `http://localhost:3000/pdfs/${fileName}`;
  }
}

module.exports = PDFGeneratorService;

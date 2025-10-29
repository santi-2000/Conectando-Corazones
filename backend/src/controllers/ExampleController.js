/**
 * Example Controller
 * Muestra cómo usar DTOs para respuestas consistentes
 */
const ResponseFormatter = require('../utils/ResponseFormatter');
const EducationalBookService = require('../services/EducationalBookService');
const SupportDirectoryService = require('../services/SupportDirectoryService');

class ExampleController {
  constructor() {
    this.educationalBookService = new EducationalBookService();
    this.supportDirectoryService = new SupportDirectoryService();
  }

  /**
   * GET /api/v1/example/educational-books
   * Ejemplo de endpoint con DTOs
   */
  async getEducationalBooks(req, res) {
    try {
      const { nivel, grado, materia, categoria, page = 1, limit = 10 } = req.query;
      
      const result = await this.educationalBookService.getAll({
        nivel,
        grado,
        materia,
        categoria,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      // Usar DTOs para formatear respuesta
      const booksDTO = ResponseFormatter.formatEducationalBooks(result.books, 'list');

      res.json(ResponseFormatter.formatSuccessResponse({
        books: booksDTO,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages
        }
      }, 'Libros educativos obtenidos exitosamente'));

    } catch (error) {
      console.error('Error en getEducationalBooks:', error);
      res.status(500).json(ResponseFormatter.formatErrorResponse(error));
    }
  }

  /**
   * GET /api/v1/example/support-directories
   * Ejemplo de endpoint con DTOs
   */
  async getSupportDirectories(req, res) {
    try {
      const { categoria, page = 1, limit = 10 } = req.query;
      
      const result = await this.supportDirectoryService.getAll({
        categoria,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      // Usar DTOs para formatear respuesta
      const supportsDTO = ResponseFormatter.formatSupportDirectories(result.supports, 'list');

      res.json(ResponseFormatter.formatSuccessResponse({
        supports: supportsDTO,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages
        }
      }, 'Directorio de apoyos obtenido exitosamente'));

    } catch (error) {
      console.error('Error en getSupportDirectories:', error);
      res.status(500).json(ResponseFormatter.formatErrorResponse(error));
    }
  }
}

module.exports = ExampleController;

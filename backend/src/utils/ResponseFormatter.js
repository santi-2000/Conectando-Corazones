/**
 * Response Formatter
 * Utilidad para formatear respuestas consistentes para el frontend
 */
const UserDTO = require('../dto/UserDTO');
const EducationalBookDTO = require('../dto/EducationalBookDTO');
const SupportDirectoryDTO = require('../dto/SupportDirectoryDTO');
const CalendarEventDTO = require('../dto/CalendarEventDTO');
const DiaryEntryDTO = require('../dto/DiaryEntryDTO');
const EducationalBook = require('../valueObjects/EducationalBook');
const Category = require('../valueObjects/Category');

class ResponseFormatter {
  /**
   * Formatear respuesta de usuario
   */
  static formatUser(userData, responseType = 'login') {
    const userDTO = new UserDTO(userData);
    
    switch (responseType) {
      case 'login':
        return userDTO.toLoginResponse();
      case 'public':
        return userDTO.toPublicResponse();
      default:
        return userDTO.toLoginResponse();
    }
  }

  /**
   * Formatear respuesta de libros educativos
   */
  static formatEducationalBooks(booksData, responseType = 'list') {
    if (!Array.isArray(booksData)) {
      booksData = [booksData];
    }

    return booksData.map(book => {
      const bookDTO = new EducationalBookDTO(book);
      return responseType === 'detail' 
        ? bookDTO.toDetailResponse() 
        : bookDTO.toListResponse();
    });
  }

  /**
   * Formatear respuesta de directorio de apoyos
   */
  static formatSupportDirectories(supportsData, responseType = 'list') {
    if (!Array.isArray(supportsData)) {
      supportsData = [supportsData];
    }

    return supportsData.map(support => {
      const supportDTO = new SupportDirectoryDTO(support);
      return responseType === 'detail' 
        ? supportDTO.toDetailResponse() 
        : supportDTO.toListResponse();
    });
  }

  /**
   * Formatear respuesta de autenticación
   */
  static formatAuthResponse(userData, token) {
    return {
      user: this.formatUser(userData, 'login'),
      token,
      expiresIn: '24h'
    };
  }

  /**
   * Formatear respuesta de error estándar
   */
  static formatErrorResponse(error, statusCode = 500) {
    return {
      success: false,
      error: statusCode >= 500 ? 'Error interno del servidor' : 'Error de validación',
      message: error.message || 'Error inesperado',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formatear respuesta de eventos del calendario
   */
  static formatCalendarEvents(eventsData, responseType = 'list') {
    if (!Array.isArray(eventsData)) {
      eventsData = [eventsData];
    }

    return eventsData.map(event => {
      const eventDTO = new CalendarEventDTO(event);
      return responseType === 'detail' 
        ? eventDTO.toDetailResponse() 
        : eventDTO.toListResponse();
    });
  }

  /**
   * Formatear respuesta de entradas del diario
   */
  static formatDiaryEntries(entriesData, responseType = 'list') {
    if (!Array.isArray(entriesData)) {
      entriesData = [entriesData];
    }

    return entriesData.map(entry => {
      const entryDTO = new DiaryEntryDTO(entry);
      return responseType === 'detail' 
        ? entryDTO.toDetailResponse() 
        : entryDTO.toListResponse();
    });
  }

  /**
   * Formatear respuesta de éxito estándar
   */
  static formatSuccessResponse(data, message = 'Operación exitosa') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ResponseFormatter;

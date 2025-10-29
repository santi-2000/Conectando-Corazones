/**
 * Script para debuggear el DTO
 */

const { query } = require('./config/database');
const EducationalBook = require('./src/valueObjects/EducationalBook');
const EducationalBookDTO = require('./src/dto/EducationalBookDTO');

async function debugDTO() {
  try {
    console.log('🔍 Debuggeando DTO...\n');
    
    // Obtener un libro de la base de datos
    const books = await query(`
      SELECT 
        b.id, b.titulo, b.descripcion, b.nivel_educativo, b.categoria as materia,
        b.url_recurso as archivo_url, b.autor, b.tipo, b.edad_recomendada,
        b.idioma, b.visualizaciones, b.activo, b.created_at, b.updated_at
      FROM biblioteca_item b
      WHERE b.activo = TRUE
      LIMIT 1
    `);
    
    if (books.length > 0) {
      const bookData = books[0];
      console.log('📚 Datos de la base de datos:');
      console.log('   - titulo:', bookData.titulo);
      console.log('   - archivo_url:', bookData.archivo_url);
      console.log('   - url_recurso:', bookData.url_recurso);
      
      // Crear Value Object
      const bookVO = new EducationalBook(bookData);
      console.log('\n📦 Value Object:');
      console.log('   - titulo:', bookVO.titulo);
      console.log('   - archivo_url:', bookVO.archivo_url);
      
      // Crear DTO
      const bookDTO = new EducationalBookDTO(bookVO);
      console.log('\n🎯 DTO:');
      console.log('   - title:', bookDTO.title);
      console.log('   - fileUrl:', bookDTO.fileUrl);
      console.log('   - archivoUrl:', bookDTO.archivoUrl);
      
      // Probar toListResponse
      const listResponse = bookDTO.toListResponse();
      console.log('\n📋 List Response:');
      console.log('   - title:', listResponse.title);
      console.log('   - fileUrl:', listResponse.fileUrl);
      console.log('   - archivoUrl:', listResponse.archivoUrl);
      
    } else {
      console.log('❌ No se encontraron libros');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

debugDTO();

/**
 * Script para debuggear el controlador
 */

const educationalBookService = require('./src/services/EducationalBookService');
const ResponseFormatter = require('./src/utils/ResponseFormatter');

async function debugController() {
  try {
    console.log('🔍 Debuggeando controlador...\n');
    
    const service = educationalBookService;
    const result = await service.getBooks({});
    
    console.log('📚 Resultado del servicio:');
    console.log('   - Total:', result.total);
    console.log('   - Primer libro (raw):', JSON.stringify(result.data[0], null, 2));
    
    // Probar ResponseFormatter
    const booksDTO = ResponseFormatter.formatEducationalBooks(result.data, 'list');
    console.log('\n🎯 DTOs formateados:');
    console.log('   - Primer libro (DTO):', JSON.stringify(booksDTO[0], null, 2));
    
    // Verificar si el DTO tiene archivoUrl
    console.log('\n🔍 Verificando archivoUrl en DTO:');
    console.log('   - fileUrl:', booksDTO[0].fileUrl);
    console.log('   - archivoUrl:', booksDTO[0].archivoUrl);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

debugController();

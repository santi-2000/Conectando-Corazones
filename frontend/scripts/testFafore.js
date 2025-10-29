/**
 * Script para probar FAFORE específicamente
 */

const { faforeService } = require('../proxy/services/faforeService');

async function testFafore() {
  try {
    console.log('🧪 Probando FAFORE...\n');
    
    console.log('🔍 Llamando a faforeService.getInfo()...');
    const response = await faforeService.getInfo();
    
    console.log('✅ Respuesta recibida:');
    console.log('   - Tipo:', typeof response);
    console.log('   - Keys:', Object.keys(response));
    console.log('   - Data:', response.data);
    console.log('   - Success:', response.success);
    console.log('   - Message:', response.message);
    
    if (response.data) {
      console.log('\n📊 Datos de FAFORE:');
      console.log('   - Nombre:', response.data.nombre);
      console.log('   - Subtítulo:', response.data.subtitulo);
      console.log('   - Misión:', response.data.mision?.substring(0, 100) + '...');
      console.log('   - Visión:', response.data.vision?.substring(0, 100) + '...');
      console.log('   - Valores:', response.data.valores);
      console.log('   - Contacto:', response.data.contacto);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

testFafore();

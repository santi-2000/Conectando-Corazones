const axios = require('axios');

const API_BASE_URL = 'http://192.168.0.22:3000/api/v1';

async function testCompleteDiaryFlow() {
  console.log('🧪 === TEST COMPLETO DEL FLUJO DEL DIARIO ===\n');

  try {
    // 1. Verificar estado inicial
    console.log('🔍 1. Verificando estado inicial...');
    const initialWeekly = await axios.get(`${API_BASE_URL}/diary/test_review/weekly`);
    console.log('📊 Entradas iniciales:', initialWeekly.data.data.entries.length);
    console.log('📈 Estadísticas iniciales:', initialWeekly.data.data.estadisticas);

    // 2. Crear entrada de hoy
    console.log('\n🔍 2. Creando entrada de hoy...');
    const today = new Date().toISOString().split('T')[0];
    const todayFormatted = new Date().toLocaleDateString('es-ES');
    
    const newEntry = {
      fecha: today,
      titulo: `Mi día ${todayFormatted}`,
      contenido: 'Hoy fue un día increíble. Probé la funcionalidad de fotos y funciona perfectamente. Mamá estará muy feliz de ver este día.',
      fotos: ['foto_test_1.jpg', 'foto_test_2.jpg'],
      emocion: 'Feliz',
      emocion_emoji: '😊',
      tags: ['Feliz', 'fotos', 'día especial', 'prueba']
    };

    console.log('📝 Datos a enviar:', JSON.stringify(newEntry, null, 2));
    
    const createResponse = await axios.post(`${API_BASE_URL}/diary/test_review/daily-entry`, newEntry);
    console.log('✅ Respuesta de creación:', createResponse.data);

    // 3. Verificar que se guardó
    console.log('\n🔍 3. Verificando que se guardó...');
    const afterCreate = await axios.get(`${API_BASE_URL}/diary/test_review/weekly`);
    console.log('📊 Entradas después de crear:', afterCreate.data.data.entries.length);
    console.log('📈 Estadísticas después de crear:', afterCreate.data.data.estadisticas);
    
    // Buscar la entrada de hoy
    const todayEntry = afterCreate.data.data.entries.find(entry => entry.fecha.startsWith(today));
    if (todayEntry) {
      console.log('✅ Entrada de hoy encontrada:');
      console.log('   - ID:', todayEntry.id);
      console.log('   - Fecha:', todayEntry.fecha);
      console.log('   - Título:', todayEntry.titulo);
      console.log('   - Emoción:', todayEntry.emocion);
      console.log('   - Fotos:', todayEntry.fotos?.length || 0);
      console.log('   - Contenido:', todayEntry.contenido?.substring(0, 50) + '...');
    } else {
      console.log('❌ NO se encontró entrada de hoy');
    }

    // 4. Probar Moms Week
    console.log('\n🔍 4. Probando Moms Week...');
    const momsWeekResponse = await axios.get(`${API_BASE_URL}/moms-week/test_review/current-week`);
    console.log('📅 Semana actual:', momsWeekResponse.data.data);

    // 5. Probar estadísticas de Moms Week
    console.log('\n🔍 5. Probando estadísticas de Moms Week...');
    try {
      const weekStatsResponse = await axios.get(`${API_BASE_URL}/moms-week/test_review/weeks/current/stats`);
      console.log('📊 Estadísticas de semana:', weekStatsResponse.data);
    } catch (error) {
      console.log('❌ Error en estadísticas de semana:', error.response?.data || error.message);
    }

    // 6. Probar generación de PDF
    console.log('\n🔍 6. Probando generación de PDF...');
    try {
      const pdfResponse = await axios.post(`${API_BASE_URL}/diary/test_review/generate-pdf`, {});
      console.log('📄 Respuesta PDF:', pdfResponse.data);
    } catch (error) {
      console.log('❌ Error en PDF:', error.response?.data || error.message);
    }

    // 7. Verificar estructura de datos
    console.log('\n🔍 7. Verificando estructura de datos...');
    const finalCheck = await axios.get(`${API_BASE_URL}/diary/test_review/weekly`);
    const entries = finalCheck.data.data.entries;
    
    console.log('📋 Estructura de entradas:');
    entries.forEach((entry, index) => {
      console.log(`   ${index + 1}. ID: ${entry.id}, Fecha: ${entry.fecha}, Emoción: ${entry.emocion}`);
    });

    console.log('\n🎉 === TEST COMPLETO FINALIZADO ===');

  } catch (error) {
    console.error('❌ Error en el test:', error.response?.data || error.message);
  }
}

testCompleteDiaryFlow();

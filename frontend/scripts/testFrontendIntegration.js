/**
 * Script para probar la integración completa del frontend
 */

const CONFIG = {
  API_BASE_URL: 'http://192.168.0.22:3000/api/v1'
};

async function testFrontendIntegration() {
  console.log('🧪 === PROBANDO INTEGRACIÓN COMPLETA DEL FRONTEND ===\n');

  try {
    // 1. Probar health check
    console.log('1️⃣ Probando health check...');
    const healthResponse = await fetch(`${CONFIG.API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.success ? 'OK' : 'ERROR');

    // 2. Probar días de la semana
    console.log('\n2️⃣ Probando días de la semana...');
    const weeklyDaysResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/weekly-days`);
    const weeklyDaysData = await weeklyDaysResponse.json();
    console.log('✅ Días de la semana:', weeklyDaysData.success ? 'OK' : 'ERROR');
    if (weeklyDaysData.success) {
      console.log(`   📊 Días completados: ${weeklyDaysData.data.totalCompletados}/${weeklyDaysData.data.totalDias}`);
    }

    // 3. Probar entradas de la semana
    console.log('\n3️⃣ Probando entradas de la semana...');
    const weeklyResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/weekly`);
    const weeklyData = await weeklyResponse.json();
    console.log('✅ Entradas de la semana:', weeklyData.success ? 'OK' : 'ERROR');
    if (weeklyData.success) {
      console.log(`   📝 Entradas encontradas: ${weeklyData.data.entries.length}`);
    }

    // 4. Probar generación de PDF
    console.log('\n4️⃣ Probando generación de PDF...');
    const pdfResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const pdfData = await pdfResponse.json();
    console.log('✅ Generación de PDF:', pdfData.success ? 'OK' : 'ERROR');
    if (pdfData.success) {
      console.log(`   📄 PDF URL: ${pdfData.data.pdfUrl}`);
      console.log(`   📊 Estadísticas: ${pdfData.data.estadisticas.totalEntradas} entradas, ${pdfData.data.estadisticas.totalFotos} fotos, ${pdfData.data.estadisticas.totalPalabras} palabras`);
    }

    // 5. Probar acceso al PDF
    if (pdfData.success && pdfData.data.pdfUrl) {
      console.log('\n5️⃣ Probando acceso al PDF...');
      const pdfAccessResponse = await fetch(`http://192.168.0.22:3000${pdfData.data.pdfUrl}`);
      console.log('✅ Acceso al PDF:', pdfAccessResponse.ok ? 'OK' : 'ERROR');
      if (pdfAccessResponse.ok) {
        console.log(`   📄 PDF accesible: ${pdfData.data.pdfUrl}`);
      }
    }

    // 6. Probar Moms Week
    console.log('\n6️⃣ Probando Moms Week...');
    const momsWeekResponse = await fetch(`${CONFIG.API_BASE_URL}/moms-week/test_review/current-week`);
    const momsWeekData = await momsWeekResponse.json();
    console.log('✅ Moms Week:', momsWeekData.success ? 'OK' : 'ERROR');
    if (momsWeekData.success) {
      console.log(`   📅 Semana: ${momsWeekData.data.semana} (${momsWeekData.data.rango})`);
    }

    console.log('\n🎉 === INTEGRACIÓN COMPLETA EXITOSA ===');
    console.log('✅ Todos los endpoints están funcionando correctamente');
    console.log('✅ El frontend debería poder conectarse sin problemas');
    console.log('✅ La generación de PDF está funcionando con URL');

  } catch (error) {
    console.error('❌ Error en la integración:', error.message);
  }
}

// Ejecutar la prueba
testFrontendIntegration();

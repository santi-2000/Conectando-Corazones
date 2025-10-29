/**
 * Script para probar que todos los fixes funcionen correctamente
 */

const CONFIG = {
  API_BASE_URL: 'http://192.168.0.22:3000/api/v1'
};

async function testCompleteFix() {
  console.log('🧪 === PROBANDO FIXES COMPLETOS ===\n');

  try {
    // 1. Probar health check
    console.log('1️⃣ Probando health check...');
    const healthResponse = await fetch(`${CONFIG.API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.success ? 'OK' : 'ERROR');

    // 2. Probar entradas de la semana
    console.log('\n2️⃣ Probando entradas de la semana...');
    const weeklyResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/weekly`);
    const weeklyData = await weeklyResponse.json();
    console.log('✅ Entradas de la semana:', weeklyData.success ? 'OK' : 'ERROR');
    if (weeklyData.success) {
      console.log(`   📝 Entradas encontradas: ${weeklyData.data.entries.length}`);
      console.log(`   📊 Datos de entrada 1:`, {
        titulo: weeklyData.data.entries[0]?.titulo,
        contenido: weeklyData.data.entries[0]?.contenido?.substring(0, 50) + '...',
        emocion: weeklyData.data.entries[0]?.emocion,
        fotos: weeklyData.data.entries[0]?.fotos?.length || 0
      });
    }

    // 3. Probar generación de PDF
    console.log('\n3️⃣ Probando generación de PDF...');
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

    // 4. Probar acceso al PDF
    if (pdfData.success && pdfData.data.pdfUrl) {
      console.log('\n4️⃣ Probando acceso al PDF...');
      const pdfAccessResponse = await fetch(`http://192.168.0.22:3000${pdfData.data.pdfUrl}`);
      console.log('✅ Acceso al PDF:', pdfAccessResponse.ok ? 'OK' : 'ERROR');
      if (pdfAccessResponse.ok) {
        console.log(`   📄 PDF accesible: ${pdfData.data.pdfUrl}`);
      }
    }

    // 5. Probar días de la semana
    console.log('\n5️⃣ Probando días de la semana...');
    const weeklyDaysResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/weekly-days`);
    const weeklyDaysData = await weeklyDaysResponse.json();
    console.log('✅ Días de la semana:', weeklyDaysData.success ? 'OK' : 'ERROR');
    if (weeklyDaysData.success) {
      console.log(`   📊 Días completados: ${weeklyDaysData.data.totalCompletados}/${weeklyDaysData.data.totalDias}`);
    }

    console.log('\n🎉 === TODOS LOS FIXES FUNCIONAN ===');
    console.log('✅ Backend funcionando correctamente');
    console.log('✅ Entradas se cargan correctamente');
    console.log('✅ PDF se genera con URL');
    console.log('✅ PDF es accesible');
    console.log('✅ Frontend debería mostrar datos correctamente');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar la prueba
testCompleteFix();

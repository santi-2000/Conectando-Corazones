/**
 * Script para probar el flujo completo del frontend
 */

const CONFIG = {
  API_BASE_URL: 'http://192.168.0.22:3000/api/v1'
};

async function testFrontendFlow() {
  console.log('🧪 === PROBANDO FLUJO COMPLETO DEL FRONTEND ===\n');

  try {
    // 1. Simular lo que hace diaryService.generatePDF
    console.log('1️⃣ Probando diaryService.generatePDF...');
    const response = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ weekId: null })
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('📊 Resultado completo:', JSON.stringify(result, null, 2));
    
    // 2. Simular lo que hace el hook useDiary
    console.log('\n2️⃣ Simulando procesamiento del hook...');
    const data = result.data || result;
    console.log('📊 Data extraída:', JSON.stringify(data, null, 2));
    
    // 3. Verificar si tiene pdfUrl
    console.log('\n3️⃣ Verificando pdfUrl...');
    if (data?.pdfUrl) {
      console.log('✅ pdfUrl encontrado:', data.pdfUrl);
      const fullUrl = `http://192.168.0.22:3000${data.pdfUrl}`;
      console.log('🔗 URL completa:', fullUrl);
      
      // 4. Probar acceso al PDF
      console.log('\n4️⃣ Probando acceso al PDF...');
      const pdfResponse = await fetch(fullUrl);
      console.log('📄 PDF accesible:', pdfResponse.ok ? 'SÍ' : 'NO');
    } else {
      console.log('❌ pdfUrl NO encontrado');
      console.log('🔍 Claves disponibles:', Object.keys(data || {}));
    }

    // 5. Probar entradas de la semana
    console.log('\n5️⃣ Probando entradas de la semana...');
    const weeklyResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/weekly`);
    const weeklyResult = await weeklyResponse.json();
    console.log('📊 Entradas de la semana:', weeklyResult.success ? 'OK' : 'ERROR');
    if (weeklyResult.success) {
      console.log(`   📝 Entradas encontradas: ${weeklyResult.data.entries.length}`);
      console.log(`   📊 Primera entrada:`, {
        titulo: weeklyResult.data.entries[0]?.titulo,
        contenido: weeklyResult.data.entries[0]?.contenido?.substring(0, 50) + '...',
        emocion: weeklyResult.data.entries[0]?.emocion,
        fotos: weeklyResult.data.entries[0]?.fotos?.length || 0
      });
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('📊 Error completo:', error);
  }
}

// Ejecutar la prueba
testFrontendFlow();

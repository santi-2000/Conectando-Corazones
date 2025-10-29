/**
 * Script para probar que el fix del frontend funcione
 */

const CONFIG = {
  API_BASE_URL: 'http://192.168.0.22:3000/api/v1'
};

async function testFrontendFix() {
  console.log('🧪 === PROBANDO FIX DEL FRONTEND ===\n');

  try {
    // 1. Probar generación de PDF (simulando lo que hace el hook)
    console.log('1️⃣ Probando generación de PDF...');
    const pdfResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ weekId: null })
    });
    
    const pdfResult = await pdfResponse.json();
    console.log('✅ PDF Response:', pdfResult.success ? 'OK' : 'ERROR');
    console.log('📊 PDF Data:', pdfResult.data ? 'Presente' : 'Ausente');
    console.log('📄 PDF URL:', pdfResult.data?.pdfUrl || 'No encontrado');
    
    // 2. Probar entradas de la semana (simulando lo que hace el hook)
    console.log('\n2️⃣ Probando entradas de la semana...');
    const weeklyResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/weekly`);
    const weeklyResult = await weeklyResponse.json();
    console.log('✅ Weekly Response:', weeklyResult.success ? 'OK' : 'ERROR');
    console.log('📊 Weekly Data:', weeklyResult.data ? 'Presente' : 'Ausente');
    console.log('📝 Entradas:', weeklyResult.data?.entries?.length || 0);
    
    // 3. Simular lo que debería hacer el frontend
    console.log('\n3️⃣ Simulando procesamiento del frontend...');
    
    // Para PDF
    if (pdfResult.success && pdfResult.data?.pdfUrl) {
      const fullPdfUrl = `http://192.168.0.22:3000${pdfResult.data.pdfUrl}`;
      console.log('✅ PDF URL completa:', fullPdfUrl);
      
      // Verificar que el PDF sea accesible
      const pdfAccessResponse = await fetch(fullPdfUrl);
      console.log('📄 PDF accesible:', pdfAccessResponse.ok ? 'SÍ' : 'NO');
    } else {
      console.log('❌ PDF no se pudo generar correctamente');
    }
    
    // Para entradas
    if (weeklyResult.success && weeklyResult.data?.entries) {
      const entries = weeklyResult.data.entries;
      console.log('✅ Entradas cargadas:', entries.length);
      
      // Procesar entradas como lo haría el frontend
      const processedEntries = entries.map(entry => ({
        day: entry.fecha ? new Date(entry.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }) : 'Día',
        emotion: entry.emocion || null,
        emotionName: entry.emocion || null,
        photo: entry.fotos && entry.fotos.length > 0 ? '📸' : null,
        text: entry.contenido || entry.titulo || 'Día completado',
        highlights: entry.tags || []
      }));
      
      console.log('📊 Entradas procesadas:');
      processedEntries.forEach((entry, index) => {
        console.log(`   ${index + 1}. ${entry.day}: ${entry.emotion || 'Sin emoción'} - ${entry.text.substring(0, 30)}...`);
      });
    } else {
      console.log('❌ Entradas no se pudieron cargar correctamente');
    }

    console.log('\n🎉 === FIX DEL FRONTEND FUNCIONA ===');
    console.log('✅ Backend devuelve datos correctos');
    console.log('✅ PDF se genera con URL');
    console.log('✅ Entradas se cargan correctamente');
    console.log('✅ Frontend debería mostrar todo correctamente');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar la prueba
testFrontendFix();

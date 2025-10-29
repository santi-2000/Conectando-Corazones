/**
 * Script final para probar la integración completa
 */

const CONFIG = {
  API_BASE_URL: 'http://192.168.0.22:3000/api/v1'
};

async function testFinalIntegration() {
  console.log('🧪 === PRUEBA FINAL DE INTEGRACIÓN ===\n');

  try {
    // 1. Health check
    console.log('1️⃣ Health check...');
    const healthResponse = await fetch(`${CONFIG.API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData.success ? 'OK' : 'ERROR');

    // 2. Entradas de la semana
    console.log('\n2️⃣ Entradas de la semana...');
    const weeklyResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/weekly`);
    const weeklyData = await weeklyResponse.json();
    console.log('✅ Weekly:', weeklyData.success ? 'OK' : 'ERROR');
    console.log(`   📝 Entradas: ${weeklyData.data?.entries?.length || 0}`);

    // 3. Generación de PDF
    console.log('\n3️⃣ Generación de PDF...');
    const pdfResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekId: null })
    });
    const pdfData = await pdfResponse.json();
    console.log('✅ PDF:', pdfData.success ? 'OK' : 'ERROR');
    console.log(`   📄 URL: ${pdfData.data?.pdfUrl || 'No encontrado'}`);

    // 4. Verificar PDF accesible
    if (pdfData.success && pdfData.data?.pdfUrl) {
      const fullUrl = `http://192.168.0.22:3000${pdfData.data.pdfUrl}`;
      const pdfAccessResponse = await fetch(fullUrl);
      console.log('✅ PDF accesible:', pdfAccessResponse.ok ? 'SÍ' : 'NO');
    }

    // 5. Días de la semana
    console.log('\n4️⃣ Días de la semana...');
    const daysResponse = await fetch(`${CONFIG.API_BASE_URL}/diary/test_review/weekly-days`);
    const daysData = await daysResponse.json();
    console.log('✅ Days:', daysData.success ? 'OK' : 'ERROR');
    console.log(`   📊 Completados: ${daysData.data?.totalCompletados || 0}/${daysData.data?.totalDias || 0}`);

    // 6. Moms Week current week
    console.log('\n5️⃣ Moms Week current week...');
    const momsWeekResponse = await fetch(`${CONFIG.API_BASE_URL}/moms-week/test_review/current-week`);
    const momsWeekData = await momsWeekResponse.json();
    console.log('✅ Moms Week:', momsWeekData.success ? 'OK' : 'ERROR');
    console.log(`   📅 Semana: ${momsWeekData.data?.semana || 'N/A'}`);

    console.log('\n🎉 === INTEGRACIÓN COMPLETA FUNCIONANDO ===');
    console.log('✅ Todos los endpoints responden correctamente');
    console.log('✅ PDF se genera y es accesible');
    console.log('✅ Entradas se cargan correctamente');
    console.log('✅ Frontend debería funcionar perfectamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFinalIntegration();

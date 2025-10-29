const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function diagnosticComplete() {
  console.log('🔍 === DIAGNÓSTICO COMPLETO DEL SISTEMA ===\n');

  try {
    // 1. Verificar que el backend esté corriendo
    console.log('1. Verificando backend...');
    const { stdout: healthCheck } = await execAsync('curl -s http://192.168.0.22:3000/api/v1/health');
    const health = JSON.parse(healthCheck);
    console.log('✅ Backend corriendo:', health.success);

    // 2. Verificar rutas GET del diary
    console.log('\n2. Verificando rutas GET del diary...');
    const { stdout: weeklyCheck } = await execAsync('curl -s http://192.168.0.22:3000/api/v1/diary/test_review/weekly');
    const weekly = JSON.parse(weeklyCheck);
    console.log('✅ Weekly funciona:', weekly.success);
    console.log('📊 Entradas encontradas:', weekly.data.entries.length);

    // 3. Verificar rutas POST del diary
    console.log('\n3. Verificando rutas POST del diary...');
    try {
      const { stdout: dailyEntryCheck } = await execAsync(`curl -s -X POST "http://192.168.0.22:3000/api/v1/diary/test_review/daily-entry" -H "Content-Type: application/json" -d '{"fecha":"2025-10-29","titulo":"Test","contenido":"Test completo","fotos":[],"emocion":"Feliz","emocion_emoji":"😊","tags":["test"]}'`);
      const dailyEntry = JSON.parse(dailyEntryCheck);
      console.log('✅ Daily-entry funciona:', dailyEntry.success);
    } catch (error) {
      console.log('❌ Daily-entry falla:', error.message);
    }

    // 4. Verificar Moms Week
    console.log('\n4. Verificando Moms Week...');
    const { stdout: momsWeekCheck } = await execAsync('curl -s http://192.168.0.22:3000/api/v1/moms-week/test_review/current-week');
    const momsWeek = JSON.parse(momsWeekCheck);
    console.log('✅ Moms Week funciona:', momsWeek.success);
    console.log('📅 Semana actual:', momsWeek.data.semana);

    // 5. Verificar estadísticas de Moms Week
    console.log('\n5. Verificando estadísticas de Moms Week...');
    const { stdout: statsCheck } = await execAsync('curl -s http://192.168.0.22:3000/api/v1/moms-week/test_review/weekly-stats');
    const stats = JSON.parse(statsCheck);
    console.log('✅ Stats funciona:', stats.success);
    console.log('📊 Estadísticas:', stats.data);

    // 6. Verificar PDF de Moms Week
    console.log('\n6. Verificando PDF de Moms Week...');
    const { stdout: pdfCheck } = await execAsync('curl -s -X POST http://192.168.0.22:3000/api/v1/moms-week/test_review/generate-pdf');
    const pdf = JSON.parse(pdfCheck);
    console.log('✅ PDF Moms Week funciona:', pdf.success);
    if (pdf.success) {
      console.log('📄 PDF URL:', pdf.data.pdfUrl);
    }

    // 7. Verificar PDF de Diary
    console.log('\n7. Verificando PDF de Diary...');
    try {
      const { stdout: diaryPdfCheck } = await execAsync('curl -s -X POST http://192.168.0.22:3000/api/v1/diary/test_review/generate-pdf');
      const diaryPdf = JSON.parse(diaryPdfCheck);
      console.log('✅ PDF Diary funciona:', diaryPdf.success);
      if (diaryPdf.success) {
        console.log('📄 PDF URL:', diaryPdf.data.pdfUrl);
      }
    } catch (error) {
      console.log('❌ PDF Diary falla:', error.message);
    }

    // 8. Crear entrada de prueba y verificar flujo completo
    console.log('\n8. Creando entrada de prueba...');
    const today = new Date().toISOString().split('T')[0];
    const testEntry = {
      fecha: today,
      titulo: `Test completo ${new Date().toLocaleTimeString()}`,
      contenido: 'Esta es una entrada de prueba para verificar el flujo completo del diario.',
      fotos: ['foto_test_1.jpg', 'foto_test_2.jpg'],
      emocion: 'Feliz',
      emocion_emoji: '😊',
      tags: ['test', 'prueba', 'flujo completo']
    };

    const { stdout: createEntryCheck } = await execAsync(`curl -s -X POST "http://192.168.0.22:3000/api/v1/diary/test_review/daily-entry" -H "Content-Type: application/json" -d '${JSON.stringify(testEntry)}'`);
    const createEntry = JSON.parse(createEntryCheck);
    console.log('✅ Entrada creada:', createEntry.success);
    if (createEntry.success) {
      console.log('📝 ID de entrada:', createEntry.data.id);
    }

    // 9. Verificar que la entrada se refleje en las estadísticas
    console.log('\n9. Verificando estadísticas después de crear entrada...');
    const { stdout: statsAfterCheck } = await execAsync('curl -s http://192.168.0.22:3000/api/v1/moms-week/test_review/weekly-stats');
    const statsAfter = JSON.parse(statsAfterCheck);
    console.log('📊 Estadísticas después:', statsAfter.data);

    console.log('\n🎉 === DIAGNÓSTICO COMPLETO FINALIZADO ===');

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
  }
}

diagnosticComplete();

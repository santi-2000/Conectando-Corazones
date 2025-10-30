/**
 * Script de prueba final de la app
 */

const CONFIG = {
  API_BASE_URL: 'http://192.168.0.22:3000/api/v1'
};

async function testEndpoint(name, endpoint, method = 'GET') {
  try {
    console.log(`\n🔍 Probando ${name}...`);
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    const status = response.status;
    
    if (status === 200 && data.success) {
      console.log(`✅ ${name}: OK`);
      return true;
    } else {
      console.log(`❌ ${name}: Error ${status} - ${data.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: Error de red - ${error.message}`);
    return false;
  }
}

async function testApp() {
  console.log('🚀 === PRUEBA FINAL DE LA APP ===\n');
  
  const tests = [
    { name: 'Health Check', endpoint: '/health' },
    { name: 'Educational Books', endpoint: '/educational-books' },
    { name: 'Support Directories', endpoint: '/support-directories' },
    { name: 'FAfore Info', endpoint: '/fafore/info' },
    { name: 'Weekly Entries', endpoint: '/diary/test_review/weekly' },
    { name: 'Current Week', endpoint: '/moms-week/test_review/current-week' },
    { name: 'Calendar Events', endpoint: '/calendar/test_review/events' },
    { name: 'PDF Generation', endpoint: '/diary/test_review/generate-pdf', method: 'POST' }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.endpoint, test.method);
    if (result) passed++;
    
    // Pequeña pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 === RESULTADOS FINALES ===`);
  console.log(`✅ Pruebas exitosas: ${passed}/${total}`);
  console.log(`❌ Pruebas fallidas: ${total - passed}/${total}`);
  console.log(`📈 Porcentaje de éxito: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! La app está funcionando correctamente.');
  } else {
    console.log('\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.');
  }
  
  return passed === total;
}

testApp();

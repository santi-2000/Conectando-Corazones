/**
 * Script para probar la integración completa del frontend con el backend
 * Este script simula las llamadas que haría el frontend
 */

const API_BASE_URL = 'http://192.168.0.22:3000/api/v1';

// Función para hacer peticiones HTTP
async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error.message);
    throw error;
  }
}

// Pruebas de integración
async function testIntegration() {
  console.log('🧪 Iniciando pruebas de integración Frontend-Backend...\n');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
  };

  // Función para ejecutar una prueba
  async function runTest(name, testFunction) {
    results.total++;
    console.log(`\n🔍 Probando: ${name}`);
    
    try {
      const result = await testFunction();
      results.passed++;
      results.details.push({ name, status: 'PASS', result });
      console.log(`✅ ${name}: PASÓ`);
      return result;
    } catch (error) {
      results.failed++;
      results.details.push({ name, status: 'FAIL', error: error.message });
      console.log(`❌ ${name}: FALLÓ - ${error.message}`);
      return null;
    }
  }

  // 1. Probar conexión básica
  await runTest('Conexión básica', async () => {
    const response = await makeRequest('/health');
    if (!response.success) throw new Error('Health check falló');
    return response.data;
  });

  // 2. Probar detección de IP
  await runTest('Detección de IP', async () => {
    const response = await makeRequest('/network-info');
    if (!response.success) throw new Error('Network info falló');
    return response.data;
  });

  // 3. Probar libros educativos
  await runTest('Libros educativos', async () => {
    const response = await makeRequest('/educational-books');
    if (!response.success) throw new Error('Libros educativos falló');
    if (!response.data.books || response.data.books.length === 0) {
      throw new Error('No se encontraron libros');
    }
    return { count: response.data.books.length, sample: response.data.books[0].title };
  });

  // 4. Probar directorios de apoyo
  await runTest('Directorios de apoyo', async () => {
    const response = await makeRequest('/support-directories');
    if (!response.success) throw new Error('Directorios de apoyo falló');
    if (!response.data || response.data.length === 0) {
      throw new Error('No se encontraron directorios');
    }
    return { count: response.data.length, sample: response.data[0].nombre };
  });

  // 5. Probar FAFORE
  await runTest('FAFORE', async () => {
    const response = await makeRequest('/fafore/info');
    if (!response.success) throw new Error('FAFORE falló');
    return response.data;
  });

  // 6. Probar autenticación (registro)
  let authToken = null;
  await runTest('Registro de usuario', async () => {
    const testUser = {
      username: `test_${Date.now()}`,
      nombre: 'Test',
      apellido: 'Integration',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const response = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    
    if (!response.success) throw new Error('Registro falló');
    authToken = response.data.token;
    return { user: response.data.user.username, token: '***' };
  });

  // 7. Probar autenticación (login)
  await runTest('Login de usuario', async () => {
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: 'test_review',
        password: 'password123'
      })
    });
    
    if (!response.success) throw new Error('Login falló');
    return { user: response.data.user.username, token: '***' };
  });

  // 8. Probar Moms Week (con autenticación)
  if (authToken) {
    await runTest('Moms Week', async () => {
      const response = await makeRequest('/moms-week/test_review/current-week', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (!response.success) throw new Error('Moms Week falló');
      return response.data;
    });
  }

  // 9. Probar calendario
  await runTest('Calendario', async () => {
    const response = await makeRequest('/calendar/events');
    if (!response.success) throw new Error('Calendario falló');
    return { count: response.data.length };
  });

  // 10. Probar lecturas infantiles
  await runTest('Lecturas infantiles', async () => {
    const response = await makeRequest('/children-readings');
    if (!response.success) throw new Error('Lecturas infantiles falló');
    return { count: response.data ? response.data.length : 0 };
  });

  // Mostrar resumen
  console.log('\n📊 RESUMEN DE PRUEBAS:');
  console.log(`Total: ${results.total}`);
  console.log(`✅ Pasaron: ${results.passed}`);
  console.log(`❌ Fallaron: ${results.failed}`);
  console.log(`📈 Tasa de éxito: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! La integración está funcionando perfectamente.');
  } else {
    console.log('\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.');
  }

  return results;
}

// Ejecutar las pruebas si se llama directamente
if (require.main === module) {
  testIntegration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { testIntegration };

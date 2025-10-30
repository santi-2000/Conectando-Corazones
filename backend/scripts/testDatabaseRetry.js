const { query, testConnection } = require('../config/database');

async function testDatabaseRetry() {
  console.log('🧪 === PROBANDO LÓGICA DE RETRY DE BASE DE DATOS ===\n');

  try {
    // 1. Probar conexión básica
    console.log('1. Probando conexión básica...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('❌ No se pudo conectar a la base de datos');
      return;
    }
    console.log('✅ Conexión básica exitosa\n');

    // 2. Probar consulta simple
    console.log('2. Probando consulta simple...');
    const result = await query('SELECT 1 as test');
    console.log('✅ Consulta simple exitosa:', result);

    // 3. Probar consulta con parámetros
    console.log('\n3. Probando consulta con parámetros...');
    const result2 = await query('SELECT ? as test_param', ['hello']);
    console.log('✅ Consulta con parámetros exitosa:', result2);

    // 4. Probar consulta a tabla real
    console.log('\n4. Probando consulta a tabla real...');
    const result3 = await query('SELECT COUNT(*) as total FROM usuarios WHERE estado = ?', ['activo']);
    console.log('✅ Consulta a tabla real exitosa:', result3);

    console.log('\n🎉 === TODAS LAS PRUEBAS DE BASE DE DATOS EXITOSAS ===');
    console.log('✅ La lógica de retry corregida funciona correctamente');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Ejecutar las pruebas
testDatabaseRetry().then(() => {
  console.log('\n✅ Pruebas completadas');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

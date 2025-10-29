/**
 * Script para limpiar el rate limiter del backend
 */

const CONFIG = {
  API_BASE_URL: 'http://192.168.0.22:3000/api/v1'
};

async function clearRateLimit() {
  console.log('🧹 === LIMPIANDO RATE LIMITER ===\n');

  try {
    // Esperar un poco para que se resetee el rate limiter
    console.log('⏳ Esperando 5 segundos para que se resetee el rate limiter...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Probar health check
    console.log('1️⃣ Probando health check...');
    const healthResponse = await fetch(`${CONFIG.API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData.success ? 'OK' : 'ERROR');

    if (healthData.success) {
      console.log('🎉 Rate limiter reseteado correctamente');
      console.log('✅ El frontend debería funcionar ahora');
    } else {
      console.log('❌ Aún hay problemas con el rate limiter');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

clearRateLimit();

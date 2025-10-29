/**
 * Script para debuggear el bucle infinito
 */

const CONFIG = {
  API_BASE_URL: 'http://192.168.0.22:3000/api/v1'
};

let requestCount = 0;
const startTime = Date.now();

async function makeRequest(endpoint, method = 'GET') {
  requestCount++;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Request #${requestCount}: ${method} ${endpoint}`);
  
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' }
    });
    
    const status = response.status;
    const data = await response.json().catch(() => ({}));
    
    console.log(`[${timestamp}] Response #${requestCount}: ${status} - ${data.success ? 'OK' : 'ERROR'}`);
    
    if (status === 429) {
      console.log(`❌ RATE LIMITED at request #${requestCount}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error #${requestCount}: ${error.message}`);
    return false;
  }
}

async function debugInfiniteLoop() {
  console.log('🔍 === DEBUGGING INFINITE LOOP ===\n');
  console.log('Monitoreando peticiones por 30 segundos...\n');
  
  const interval = setInterval(async () => {
    const success = await makeRequest('/health');
    if (!success) {
      clearInterval(interval);
      console.log(`\n🛑 Detenido después de ${requestCount} peticiones en ${(Date.now() - startTime) / 1000} segundos`);
      console.log(`📊 Promedio: ${(requestCount / ((Date.now() - startTime) / 1000)).toFixed(2)} peticiones/segundo`);
    }
  }, 1000); // Una petición por segundo
  
  // Detener después de 30 segundos
  setTimeout(() => {
    clearInterval(interval);
    console.log(`\n⏰ Tiempo agotado: ${requestCount} peticiones en 30 segundos`);
    console.log(`📊 Promedio: ${(requestCount / 30).toFixed(2)} peticiones/segundo`);
  }, 30000);
}

debugInfiniteLoop();

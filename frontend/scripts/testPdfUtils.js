/**
 * Script de prueba para pdfUtils
 */

// Simular la configuración
const CONFIG = {
  API_BASE_URL: 'http://192.168.0.22:3000/api/v1'
};

/**
 * Construye la URL completa de un PDF de manera dinámica
 */
const buildPdfUrl = (pdfPath) => {
  if (!pdfPath) {
    console.warn('buildPdfUrl: pdfPath es undefined o null');
    return null;
  }

  // Si ya es una URL completa, devolverla tal como está
  if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) {
    return pdfPath;
  }

  // Extraer la URL base del backend (sin /api/v1)
  const baseUrl = CONFIG.API_BASE_URL.replace('/api/v1', '');
  
  // Construir la URL completa
  const fullUrl = `${baseUrl}${pdfPath}`;
  
  console.log(`🔗 PDF URL construida: ${fullUrl}`);
  return fullUrl;
};

// Pruebas
console.log('🧪 === PROBANDO PDF UTILS ===\n');

console.log('1. PDF con ruta relativa:');
const test1 = buildPdfUrl('/pdfs/test.pdf');
console.log(`   Resultado: ${test1}\n`);

console.log('2. PDF con URL completa:');
const test2 = buildPdfUrl('http://example.com/test.pdf');
console.log(`   Resultado: ${test2}\n`);

console.log('3. PDF undefined:');
const test3 = buildPdfUrl(undefined);
console.log(`   Resultado: ${test3}\n`);

console.log('4. PDF con ruta que empieza con /:');
const test4 = buildPdfUrl('/pdfs/diario-semanal-test_review-semana-44.pdf');
console.log(`   Resultado: ${test4}\n`);

console.log('✅ Todas las pruebas completadas');

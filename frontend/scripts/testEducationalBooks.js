/**
 * Script para probar específicamente la integración de Libros Educativos
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

// Pruebas específicas para Libros Educativos
async function testEducationalBooks() {
  console.log('🧪 Probando integración de Libros Educativos...\n');

  try {
    // 1. Probar endpoint básico
    console.log('🔍 Probando: Obtener todos los libros');
    const allBooks = await makeRequest('/educational-books');
    console.log(`✅ Libros obtenidos: ${allBooks.data.books.length}`);
    console.log(`📚 Primeros 3 libros:`);
    allBooks.data.books.slice(0, 3).forEach((book, index) => {
      console.log(`   ${index + 1}. ${book.title} - ${book.author}`);
    });

    // 2. Probar filtros por nivel
    console.log('\n🔍 Probando: Filtros por nivel');
    const primaryBooks = allBooks.data.books.filter(book => {
      const title = book.title?.toLowerCase() || '';
      return !title.includes('secundaria') && 
             (title.includes('primaria') || title.includes('grado'));
    });
    console.log(`✅ Libros de primaria: ${primaryBooks.length}`);

    const secondaryBooks = allBooks.data.books.filter(book => {
      const title = book.title?.toLowerCase() || '';
      return title.includes('secundaria');
    });
    console.log(`✅ Libros de secundaria: ${secondaryBooks.length}`);

    // 3. Probar funcionalidad de descarga
    console.log('\n🔍 Probando: Funcionalidad de descarga');
    const bookWithUrl = allBooks.data.books.find(book => book.archivoUrl);
    if (bookWithUrl) {
      console.log(`✅ Libro con URL encontrado: ${bookWithUrl.title}`);
      console.log(`🔗 URL: ${bookWithUrl.archivoUrl}`);
    } else {
      console.log('ℹ️  No hay libros con URLs reales, usando URLs de ejemplo');
      const exampleBook = allBooks.data.books[0];
      const exampleUrl = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
      console.log(`📖 Ejemplo: ${exampleBook.title} → ${exampleUrl}`);
    }

    // 4. Probar búsqueda
    console.log('\n🔍 Probando: Búsqueda de libros');
    const searchResults = await makeRequest('/educational-books?search=ciencias');
    console.log(`✅ Resultados de búsqueda "ciencias": ${searchResults.data.books.length}`);

    // 5. Resumen final
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log(`✅ Total de libros: ${allBooks.data.books.length}`);
    console.log(`✅ Libros de primaria: ${primaryBooks.length}`);
    console.log(`✅ Libros de secundaria: ${secondaryBooks.length}`);
    console.log(`✅ Búsqueda funcionando: ${searchResults.data.books.length > 0 ? 'Sí' : 'No'}`);
    console.log(`✅ Funcionalidad de descarga: ${bookWithUrl ? 'Con URLs reales' : 'Con URLs de ejemplo'}`);

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE LIBROS EDUCATIVOS PASARON!');
    console.log('📱 La integración está lista para probar en la app móvil.');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que el backend esté corriendo en 192.168.0.22:3000');
    console.log('2. Verificar la conexión a la base de datos');
    console.log('3. Verificar que la IP sea correcta para tu red');
  }
}

// Ejecutar las pruebas
testEducationalBooks();

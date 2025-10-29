/**
 * Script para verificar URLs en la base de datos
 */

const { query } = require('./config/database');

async function checkUrls() {
  try {
    console.log('🔍 Verificando URLs en la base de datos...\n');
    
    // Verificar estructura de la tabla
    const structure = await query('DESCRIBE biblioteca_item');
    console.log('📋 Estructura de la tabla biblioteca_item:');
    structure.forEach(field => {
      if (field.Field.includes('url') || field.Field.includes('recurso')) {
        console.log(`   - ${field.Field}: ${field.Type}`);
      }
    });
    
    console.log('\n📚 Verificando URLs de libros:');
    
    // Buscar libros con URLs
    const booksWithUrls = await query(`
      SELECT titulo, url_recurso 
      FROM biblioteca_item 
      WHERE url_recurso IS NOT NULL 
      AND url_recurso != ''
      ORDER BY titulo
    `);
    
    if (booksWithUrls.length > 0) {
      console.log(`✅ Encontrados ${booksWithUrls.length} libros con URLs:`);
      booksWithUrls.forEach(book => {
        console.log(`   - ${book.titulo}: ${book.url_recurso}`);
      });
    } else {
      console.log('❌ No se encontraron libros con URLs');
    }
    
    // Verificar todos los libros
    const allBooks = await query(`
      SELECT titulo, url_recurso 
      FROM biblioteca_item 
      ORDER BY titulo
    `);
    
    console.log(`\n📊 Total de libros en la base de datos: ${allBooks.length}`);
    console.log('📖 Primeros 5 libros:');
    allBooks.slice(0, 5).forEach(book => {
      console.log(`   - ${book.titulo}: ${book.url_recurso || 'SIN URL'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkUrls();

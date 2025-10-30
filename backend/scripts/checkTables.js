/**
 * Script para verificar las tablas existentes en la base de datos
 */

const { query } = require('../config/database');

async function checkTables() {
  try {
    console.log('🔍 Verificando tablas en la base de datos...\n');
    
    // Obtener todas las tablas
    const tablesQuery = 'SHOW TABLES';
    const tables = await query(tablesQuery);
    
    console.log('📋 Tablas encontradas:');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`${index + 1}. ${tableName}`);
    });
    
    console.log('\n🔍 Verificando estructura de tablas específicas...\n');
    
    // Verificar tabla usuarios
    console.log('1. Tabla usuarios:');
    try {
      const usuariosDesc = await query('DESCRIBE usuarios');
      console.log('   Columnas:');
      usuariosDesc.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } catch (error) {
      console.log('   ❌ Tabla usuarios no existe');
    }
    
    // Verificar tabla pdf_generados
    console.log('\n2. Tabla pdf_generados:');
    try {
      const pdfDesc = await query('DESCRIBE pdf_generados');
      console.log('   Columnas:');
      pdfDesc.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } catch (error) {
      console.log('   ❌ Tabla pdf_generados no existe');
    }
    
    // Verificar tabla calendar_events
    console.log('\n3. Tabla calendar_events:');
    try {
      const calendarDesc = await query('DESCRIBE calendar_events');
      console.log('   Columnas:');
      calendarDesc.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } catch (error) {
      console.log('   ❌ Tabla calendar_events no existe');
    }
    
    // Verificar tabla moms_week_entries
    console.log('\n4. Tabla moms_week_entries:');
    try {
      const momsDesc = await query('DESCRIBE moms_week_entries');
      console.log('   Columnas:');
      momsDesc.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } catch (error) {
      console.log('   ❌ Tabla moms_week_entries no existe');
    }
    
    console.log('\n✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error verificando tablas:', error);
  }
}

checkTables();

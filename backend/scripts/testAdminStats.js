/**
 * Script para probar las estadísticas de admin después de las correcciones
 */

const { query } = require('../config/database');

async function testAdminStats() {
  try {
    console.log('🧪 === PROBANDO ESTADÍSTICAS DE ADMIN ===\n');
    
    // Probar consulta de usuarios
    console.log('1. Probando consulta de usuarios...');
    try {
      const usuariosQuery = `
        SELECT COUNT(*) as total 
        FROM usuarios 
        WHERE estado = 'activo'
      `;
      const [usuariosResult] = await query(usuariosQuery);
      console.log(`   ✅ Usuarios activos: ${usuariosResult.total}`);
    } catch (error) {
      console.log(`   ❌ Error en usuarios: ${error.message}`);
    }
    
    // Probar consulta de eventos
    console.log('\n2. Probando consulta de eventos...');
    try {
      const eventosQuery = `
        SELECT COUNT(*) as total 
        FROM calendar_events 
        WHERE activo = TRUE
      `;
      const [eventosResult] = await query(eventosQuery);
      console.log(`   ✅ Eventos activos: ${eventosResult.total}`);
    } catch (error) {
      console.log(`   ❌ Error en eventos: ${error.message}`);
    }
    
    // Probar consulta de PDFs
    console.log('\n3. Probando consulta de PDFs...');
    try {
      const pdfsQuery = `
        SELECT COUNT(*) as total 
        FROM pdf_generados 
        WHERE estado = 'generado'
      `;
      const [pdfsResult] = await query(pdfsQuery);
      console.log(`   ✅ PDFs generados: ${pdfsResult.total}`);
    } catch (error) {
      console.log(`   ❌ Error en PDFs: ${error.message}`);
    }
    
    // Probar consulta de entradas semanales
    console.log('\n4. Probando consulta de entradas semanales...');
    try {
      const entradasQuery = `
        SELECT COUNT(*) as total 
        FROM moms_week_entries 
        WHERE activo = TRUE
      `;
      const [entradasResult] = await query(entradasQuery);
      console.log(`   ✅ Entradas semanales activas: ${entradasResult.total}`);
    } catch (error) {
      console.log(`   ❌ Error en entradas semanales: ${error.message}`);
    }
    
    console.log('\n✅ Todas las pruebas completadas');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testAdminStats();

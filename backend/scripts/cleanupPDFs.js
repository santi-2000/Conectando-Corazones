const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function cleanupPDFs() {
  try {
    console.log('🧹 Limpiando PDFs y entradas del diario de la base de datos...\n');
    
    // Tablas a limpiar
    const tablesToClean = [
      { name: 'pdf_generados', description: 'PDFs generados' },
      { name: 'diary_entries', description: 'Entradas del diario (diary_entries)' },
      { name: 'diario', description: 'Entradas del diario (diario)' },
      { name: 'moms_week_entries', description: 'Entradas semanales (moms_week_entries)' },
      { name: 'carta_semanal', description: 'Cartas semanales' }
    ];
    
    // 1. Contar registros antes de eliminar
    console.log('📊 Conteo inicial de registros:');
    for (const table of tablesToClean) {
      try {
        const countResult = await query(`SELECT COUNT(*) as total FROM ${table.name}`);
        const total = countResult[0]?.total || 0;
        if (total > 0) {
          console.log(`   ${table.description}: ${total} registros`);
        }
      } catch (e) {
        // Tabla no existe, ignorar
      }
    }
    
    console.log('\n🗑️  Eliminando registros...');
    
    // 2. Eliminar registros de todas las tablas
    let totalDeleted = 0;
    for (const table of tablesToClean) {
      try {
        const deleteResult = await query(`DELETE FROM ${table.name}`);
        const deleted = deleteResult.affectedRows || 0;
        if (deleted > 0) {
          console.log(`   ✅ ${table.description}: ${deleted} registros eliminados`);
          totalDeleted += deleted;
        }
      } catch (e) {
        if (!e.message.includes("doesn't exist")) {
          console.log(`   ⚠️  ${table.description}: Error - ${e.message}`);
        }
      }
    }
    
    console.log(`\n✅ Total de registros eliminados: ${totalDeleted}`);
    
    // 3. Eliminar archivos PDF físicos
    const pdfsDir = path.join(__dirname, '../public/pdfs');
    let deletedPdfFiles = 0;
    
    if (fs.existsSync(pdfsDir)) {
      const files = fs.readdirSync(pdfsDir);
      const pdfFiles = files.filter(f => f.endsWith('.pdf'));
      
      if (pdfFiles.length > 0) {
        console.log(`\n📁 Archivos PDF encontrados en ${pdfsDir}: ${pdfFiles.length}`);
        
        pdfFiles.forEach(file => {
          try {
            const filePath = path.join(pdfsDir, file);
            fs.unlinkSync(filePath);
            deletedPdfFiles++;
            console.log(`   🗑️  Eliminado: ${file}`);
          } catch (err) {
            console.error(`   ❌ Error eliminando ${file}:`, err.message);
          }
        });
        
        console.log(`\n✅ Archivos PDF eliminados: ${deletedPdfFiles}`);
      } else {
        console.log(`\n📁 No hay archivos PDF para eliminar`);
      }
    } else {
      console.log(`\n⚠️  Directorio ${pdfsDir} no existe`);
    }
    
    // 4. Eliminar fotos del directorio uploads
    const uploadsDir = path.join(__dirname, '../public/uploads');
    let deletedPhotoFiles = 0;
    const photoExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const photoFiles = files.filter(f => {
        const ext = path.extname(f).toLowerCase();
        return photoExtensions.includes(ext);
      });
      
      if (photoFiles.length > 0) {
        console.log(`\n📸 Fotos encontradas en ${uploadsDir}: ${photoFiles.length}`);
        
        photoFiles.forEach(file => {
          try {
            const filePath = path.join(uploadsDir, file);
            fs.unlinkSync(filePath);
            deletedPhotoFiles++;
            console.log(`   🗑️  Eliminada: ${file}`);
          } catch (err) {
            console.error(`   ❌ Error eliminando ${file}:`, err.message);
          }
        });
        
        console.log(`\n✅ Fotos eliminadas: ${deletedPhotoFiles}`);
      } else {
        console.log(`\n📸 No hay fotos para eliminar`);
      }
    } else {
      console.log(`\n⚠️  Directorio ${uploadsDir} no existe`);
    }
    
    // 5. Verificar que las tablas estén vacías
    console.log('\n📊 Verificación final:');
    for (const table of tablesToClean) {
      try {
        const verifyResult = await query(`SELECT COUNT(*) as total FROM ${table.name}`);
        const remaining = verifyResult[0]?.total || 0;
        if (remaining === 0) {
          console.log(`   ✅ ${table.description}: vacía`);
        } else {
          console.log(`   ⚠️  ${table.description}: ${remaining} registros restantes`);
        }
      } catch (e) {
        // Tabla no existe, ignorar
      }
    }
    
    console.log('\n✅ Limpieza completada. Base de datos lista para pruebas desde cero.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    process.exit(1);
  }
}

cleanupPDFs();


const fs = require('fs');
const path = require('path');

/**
 * Script para corregir las rutas en los archivos generados por Expo
 * para que funcionen correctamente en GitHub Pages (subdirectorio)
 */
const BASE_PATH = '/Conectando-Corazones';
const DIST_DIR = path.join(__dirname, '../dist');

function fixPathsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Reemplazar rutas absolutas que empiezan con /_expo
    if (content.includes('/_expo/')) {
      content = content.replace(/\/_expo\//g, `${BASE_PATH}/_expo/`);
      modified = true;
    }

    // Reemplazar rutas absolutas que empiezan con /static
    if (content.includes('/static/')) {
      content = content.replace(/\/static\//g, `${BASE_PATH}/static/`);
      modified = true;
    }

    // Reemplazar rutas absolutas en src/href de scripts y links
    content = content.replace(/src="\/([^"]+)"/g, `src="${BASE_PATH}/$1"`);
    content = content.replace(/href="\/([^"]+)"/g, `href="${BASE_PATH}/$1"`);
    
    // Reemplazar en JSON (para manifest, etc)
    content = content.replace(/"\/_expo\//g, `"${BASE_PATH}/_expo/`);
    content = content.replace(/"\/static\//g, `"${BASE_PATH}/static/`);

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corregido: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

function fixPathsInDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directorio no existe: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });
  let fixedCount = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      fixPathsInDirectory(fullPath);
    } else if (file.isFile()) {
      // Procesar archivos HTML, JS, JSON, CSS
      if (/\.(html|js|json|css)$/.test(file.name)) {
        if (fixPathsInFile(fullPath)) {
          fixedCount++;
        }
      }
    }
  }

  return fixedCount;
}

console.log('🔧 Corrigiendo rutas para GitHub Pages...');
console.log(`📁 Directorio: ${DIST_DIR}`);
console.log(`🔗 Base path: ${BASE_PATH}\n`);

const fixed = fixPathsInDirectory(DIST_DIR);
console.log(`\n✅ Proceso completado. ${fixed} archivos modificados.`);


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
    const originalContent = content;

    // Reemplazar rutas absolutas que empiezan con /_expo (en cualquier contexto)
    content = content.replace(/\/_expo\//g, `${BASE_PATH}/_expo/`);
    
    // Reemplazar rutas absolutas que empiezan con /static
    content = content.replace(/\/static\//g, `${BASE_PATH}/static/`);

    // Reemplazar rutas absolutas en src/href de scripts y links (más específico)
    content = content.replace(/src=["']\/([^"']+)["']/g, `src="${BASE_PATH}/$1"`);
    content = content.replace(/href=["']\/([^"']+)["']/g, `href="${BASE_PATH}/$1"`);
    
    // Reemplazar en JSON (para manifest, etc) - con comillas simples y dobles
    content = content.replace(/"\/_expo\//g, `"${BASE_PATH}/_expo/`);
    content = content.replace(/"\/static\//g, `"${BASE_PATH}/static/`);
    content = content.replace(/'\/_expo\//g, `'${BASE_PATH}/_expo/`);
    content = content.replace(/'\/static\//g, `'${BASE_PATH}/static/`);
    
    // Reemplazar en strings de JavaScript (sin comillas, como en código)
    content = content.replace(/([^"'])\/_expo\//g, `$1${BASE_PATH}/_expo/`);
    content = content.replace(/([^"'])\/static\//g, `$1${BASE_PATH}/static/`);
    
    // Reemplazar rutas que empiezan con / al inicio de string (para imports, requires, etc)
    content = content.replace(/(import|require|from|src|href)\s*\(?\s*["']\/_expo\//g, `$1("${BASE_PATH}/_expo/`);
    content = content.replace(/(import|require|from|src|href)\s*\(?\s*["']\/static\//g, `$1("${BASE_PATH}/static/`);

    // Si el contenido cambió, guardar
    if (content !== originalContent) {
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
    return 0;
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });
  let fixedCount = 0;
  let processedCount = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      const subCount = fixPathsInDirectory(fullPath);
      fixedCount += subCount;
    } else if (file.isFile()) {
      // Procesar archivos HTML, JS, JSON, CSS, y también archivos sin extensión que podrían ser HTML
      if (/\.(html|js|json|css|map)$/.test(file.name) || file.name === 'index' || file.name === '404') {
        processedCount++;
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

// Verificar que el directorio existe antes de procesar
if (!fs.existsSync(DIST_DIR)) {
  console.error(`❌ ERROR: El directorio ${DIST_DIR} no existe.`);
  console.error('   Asegúrate de que el build de Expo se haya ejecutado correctamente.');
  process.exit(1);
}

const fixed = fixPathsInDirectory(DIST_DIR);
console.log(`\n✅ Proceso completado. ${fixed} archivos modificados.`);

// Listar algunos archivos importantes para verificar
const importantFiles = ['index.html', '_expo/static/js/web/entry.js'];
importantFiles.forEach(file => {
  const fullPath = path.join(DIST_DIR, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('/_expo/') && !content.includes(`${BASE_PATH}/_expo/`)) {
      console.warn(`⚠️  ADVERTENCIA: ${file} aún contiene rutas sin corregir`);
    }
  }
});


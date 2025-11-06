const fs = require('fs');
const path = require('path');

/**
 * Script NUEVO y SIMPLIFICADO para corregir rutas en archivos generados por Expo
 * para GitHub Pages (subdirectorio)
 * 
 * Estrategia:
 * 1. PRIMERO: Limpiar TODAS las duplicaciones de manera agresiva
 * 2. SEGUNDO: Asegurar que las rutas tengan el prefijo correcto
 */
const BASE_PATH = '/Conectando-Corazones';
const DIST_DIR = path.join(__dirname, '../dist');

/**
 * Limpia duplicaciones de manera agresiva
 */
function cleanDuplications(content) {
  let cleaned = content;
  let previous = '';
  let iterations = 0;
  
  // Hacer múltiples pasadas hasta que no haya más cambios
  while (cleaned !== previous && iterations < 10) {
    previous = cleaned;
    iterations++;
    
    // Escapar BASE_PATH para usar en regex
    const escaped = BASE_PATH.replace(/\//g, '\\/');
    
    // Patrón 1: /Conectando-Corazones/_expo/Conectando-Corazones/ -> /Conectando-Corazones/_expo/
    cleaned = cleaned.replace(
      new RegExp(`${escaped}/_expo/${escaped}/`, 'g'),
      `${BASE_PATH}/_expo/`
    );
    
    // Patrón 2: /Conectando-Corazones/static/Conectando-Corazones/ -> /Conectando-Corazones/static/
    cleaned = cleaned.replace(
      new RegExp(`${escaped}/static/${escaped}/`, 'g'),
      `${BASE_PATH}/static/`
    );
    
    // Patrón 3: /Conectando-Corazones/Conectando-Corazones/ -> /Conectando-Corazones/
    cleaned = cleaned.replace(
      new RegExp(`${escaped}${escaped}/`, 'g'),
      `${BASE_PATH}/`
    );
    
    // Patrón 4: En atributos src/href específicamente
    cleaned = cleaned.replace(
      new RegExp(`(src=["'])${escaped}/_expo/${escaped}/`, 'g'),
      `$1${BASE_PATH}/_expo/`
    );
    
    cleaned = cleaned.replace(
      new RegExp(`(href=["'])${escaped}/_expo/${escaped}/`, 'g'),
      `$1${BASE_PATH}/_expo/`
    );
    
    cleaned = cleaned.replace(
      new RegExp(`(src=["'])${escaped}/static/${escaped}/`, 'g'),
      `$1${BASE_PATH}/static/`
    );
    
    cleaned = cleaned.replace(
      new RegExp(`(href=["'])${escaped}/static/${escaped}/`, 'g'),
      `$1${BASE_PATH}/static/`
    );
  }
  
  if (iterations > 1) {
    console.log(`  🔧 Limpieza completada en ${iterations} iteraciones`);
  }
  
  return cleaned;
}

/**
 * Corrige rutas en un archivo
 */
function fixPathsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const isHtml = filePath.endsWith('.html');
    
    // Paso 1: Remover tag <base> si existe (causa problemas)
    if (isHtml && content.includes('<base')) {
      content = content.replace(/<base[^>]*>/i, '');
      console.log(`  ✅ Removido tag <base>`);
    }
    
    // Paso 2: LIMPIAR TODAS LAS DUPLICACIONES PRIMERO (muy importante)
    content = cleanDuplications(content);
    
    // Paso 3: Corregir rutas que empiezan con /_expo/ o /static/ (sin prefijo)
    // Solo si NO tienen el prefijo ya
    const escaped = BASE_PATH.replace(/\//g, '\\/');
    
    // Rutas en src/href que empiezan con /_expo/ pero NO tienen el prefijo
    content = content.replace(
      new RegExp(`src=["']\\/(_expo\\/[^"']+)["']`, 'g'),
      (match, path) => {
        // Si ya tiene el prefijo, no modificar
        if (path.includes(`${BASE_PATH}/`) || path.startsWith(`${BASE_PATH}/`)) {
          return match;
        }
        return `src="${BASE_PATH}/${path}"`;
      }
    );
    
    content = content.replace(
      new RegExp(`href=["']\\/(_expo\\/[^"']+)["']`, 'g'),
      (match, path) => {
        if (path.includes(`${BASE_PATH}/`) || path.startsWith(`${BASE_PATH}/`)) {
          return match;
        }
        return `href="${BASE_PATH}/${path}"`;
      }
    );
    
    // Rutas en src/href que empiezan con /static/ pero NO tienen el prefijo
    content = content.replace(
      new RegExp(`src=["']\\/(static\\/[^"']+)["']`, 'g'),
      (match, path) => {
        // Verificar contexto: si antes de /static/ ya hay BASE_PATH, no modificar
        const fullMatch = match;
        const beforeStatic = fullMatch.substring(0, fullMatch.indexOf('/static/'));
        if (beforeStatic.includes(`${BASE_PATH}/`)) {
          return match;
        }
        if (path.includes(`${BASE_PATH}/`)) {
          return match;
        }
        return `src="${BASE_PATH}/${path}"`;
      }
    );
    
    content = content.replace(
      new RegExp(`href=["']\\/(static\\/[^"']+)["']`, 'g'),
      (match, path) => {
        const fullMatch = match;
        const beforeStatic = fullMatch.substring(0, fullMatch.indexOf('/static/'));
        if (beforeStatic.includes(`${BASE_PATH}/`)) {
          return match;
        }
        if (path.includes(`${BASE_PATH}/`)) {
          return match;
        }
        return `href="${BASE_PATH}/${path}"`;
      }
    );
    
    // Paso 4: Corregir en strings JSON/JavaScript (import, require, etc.)
    // Solo rutas que empiezan con /_expo/ o /static/ sin el prefijo
    content = content.replace(
      new RegExp(`"\\/(_expo\\/[^"]+)"`, 'g'),
      (match, path) => {
        if (path.includes(`${BASE_PATH}/`)) return match;
        return `"${BASE_PATH}/${path}"`;
      }
    );
    
    content = content.replace(
      new RegExp(`"\\/(static\\/[^"]+)"`, 'g'),
      (match, path) => {
        if (path.includes(`${BASE_PATH}/`)) return match;
        return `"${BASE_PATH}/${path}"`;
      }
    );
    
    // Paso 5: Limpiar duplicaciones una vez más por si acaso
    content = cleanDuplications(content);
    
    // Guardar si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`  ❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Procesa un directorio recursivamente
 */
function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directorio no existe: ${dir}`);
    return 0;
  }
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let fixedCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      const subCount = processDirectory(fullPath);
      fixedCount += subCount;
    } else if (file.isFile()) {
      // Procesar archivos HTML, JS, JSON, CSS, map, y service workers
      if (/\.(html|js|json|css|map)$/.test(file.name) || 
          file.name === 'index' || 
          file.name === '404' ||
          file.name === 'sw.js' ||
          file.name === 'service-worker.js') {
        const relativePath = path.relative(DIST_DIR, fullPath);
        if (fixPathsInFile(fullPath)) {
          console.log(`✅ ${relativePath}`);
          fixedCount++;
        }
      }
    }
  }
  
  return fixedCount;
}

/**
 * Verifica archivos HTML para problemas
 */
function verifyHtmlFiles(dir) {
  const htmlFiles = [];
  
  function findHtmlFiles(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const files = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(currentDir, file.name);
      if (file.isDirectory()) {
        findHtmlFiles(fullPath);
      } else if (file.isFile() && file.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  }
  
  findHtmlFiles(dir);
  
  let issues = 0;
  htmlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(dir, file);
      
      // Buscar rutas problemáticas
      const problematic = [
        /src=["']\/_expo\//g,
        /href=["']\/_expo\//g,
        /src=["']\/static\//g,
        /href=["']\/static\//g,
        new RegExp(`${BASE_PATH.replace(/\//g, '\\/')}/_expo/${BASE_PATH.replace(/\//g, '\\/')}/`, 'g'),
        new RegExp(`${BASE_PATH.replace(/\//g, '\\/')}/static/${BASE_PATH.replace(/\//g, '\\/')}/`, 'g')
      ];
      
      const hasIssues = problematic.some(pattern => pattern.test(content));
      
      if (hasIssues) {
        console.warn(`⚠️  ${relativePath} - Aún tiene problemas`);
        issues++;
      } else {
        console.log(`✅ ${relativePath} - OK`);
      }
    } catch (error) {
      console.error(`❌ Error verificando ${file}:`, error.message);
      issues++;
    }
  });
  
  return { total: htmlFiles.length, issues };
}

// ============================================
// EJECUCIÓN PRINCIPAL
// ============================================
console.log('🔧 Corrigiendo rutas para GitHub Pages...');
console.log(`📁 Directorio: ${DIST_DIR}`);
console.log(`🔗 Base path: ${BASE_PATH}\n`);

// Verificar que el directorio existe
if (!fs.existsSync(DIST_DIR)) {
  console.error(`❌ ERROR: El directorio ${DIST_DIR} no existe.`);
  console.error('   Asegúrate de que el build de Expo se haya ejecutado correctamente.');
  process.exit(1);
}

// Procesar todos los archivos
const fixed = processDirectory(DIST_DIR);
console.log(`\n✅ Proceso completado. ${fixed} archivo(s) modificado(s).`);

// Verificar archivos HTML
console.log('\n🔍 Verificando archivos HTML...');
const verification = verifyHtmlFiles(DIST_DIR);

if (verification.issues === 0 && verification.total > 0) {
  console.log(`\n✅ Todos los archivos HTML están correctos (${verification.total} archivos verificados)`);
} else if (verification.issues > 0) {
  console.warn(`\n⚠️  ${verification.issues} archivo(s) HTML aún tienen problemas`);
  process.exit(1);
}

console.log('\n🎉 ¡Deploy listo!');

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
    const isHtml = filePath.endsWith('.html');

    // Para archivos HTML, NO usar tag <base> porque causa duplicación
    // En su lugar, reemplazar todas las rutas absolutas directamente
    // Si ya tiene tag <base>, quitarlo
    if (isHtml && content.includes('<base')) {
      content = content.replace(/<base[^>]*>/i, '');
      console.log(`✅ Removido tag <base> de: ${filePath}`);
    }

    // PRIMERO: Limpiar cualquier duplicación existente de manera más agresiva
    // Usar replace directo en lugar de test primero para asegurar que se reemplace
    let hasDuplicates = false;
    const originalBeforeClean = content;
    
    // Patrón 1: /Conectando-Corazones/_expo/Conectando-Corazones/ -> /Conectando-Corazones/_expo/
    const pattern1 = new RegExp(`${BASE_PATH.replace('/', '\\/')}/_expo/${BASE_PATH.replace('/', '\\/')}/`, 'g');
    const before1 = content;
    content = content.replace(pattern1, `${BASE_PATH}/_expo/`);
    if (content !== before1) {
      hasDuplicates = true;
      console.warn(`⚠️  ${filePath} tiene duplicación en _expo, limpiando...`);
    }
    
    // Patrón 2: /Conectando-Corazones/static/Conectando-Corazones/ -> /Conectando-Corazones/static/
    const pattern2 = new RegExp(`${BASE_PATH.replace('/', '\\/')}/static/${BASE_PATH.replace('/', '\\/')}/`, 'g');
    const before2 = content;
    content = content.replace(pattern2, `${BASE_PATH}/static/`);
    if (content !== before2) {
      hasDuplicates = true;
      console.warn(`⚠️  ${filePath} tiene duplicación en static, limpiando...`);
    }
    
    // Patrón 3: /Conectando-Corazones/Conectando-Corazones/ -> /Conectando-Corazones/
    const pattern3 = new RegExp(`${BASE_PATH.replace('/', '\\/')}${BASE_PATH.replace('/', '\\/')}/`, 'g');
    const before3 = content;
    content = content.replace(pattern3, `${BASE_PATH}/`);
    if (content !== before3) {
      hasDuplicates = true;
      console.warn(`⚠️  ${filePath} tiene duplicación completa, limpiando...`);
    }
    
    // Patrón 4: Buscar cualquier ocurrencia de BASE_PATH duplicado en cualquier contexto
    // Esto captura casos como: src="/Conectando-Corazones/_expo/Conectando-Corazones/static/..."
    const pattern4 = new RegExp(`(${BASE_PATH.replace('/', '\\/')}/[^"']*?)${BASE_PATH.replace('/', '\\/')}/`, 'g');
    const before4 = content;
    content = content.replace(pattern4, '$1');
    if (content !== before4) {
      hasDuplicates = true;
      console.warn(`⚠️  ${filePath} tiene duplicación en contexto, limpiando...`);
    }
    
    // Si había duplicaciones, guardar y continuar para verificar otras rutas
    if (hasDuplicates) {
      // Continuar procesamiento para asegurar que todas las rutas estén correctas
    } else if (content.includes(`${BASE_PATH}/_expo/`) || content.includes(`${BASE_PATH}/static/`)) {
      // Ya tiene rutas corregidas y no hay duplicaciones, verificar si necesita más procesamiento
      // Solo procesar si hay rutas sin corregir
      const hasUncorrectedPaths = /src=["']\/(?!Conectando-Corazones\/)_expo\//.test(content) || 
                                   /href=["']\/(?!Conectando-Corazones\/)_expo\//.test(content) ||
                                   /src=["']\/(?!Conectando-Corazones\/)static\//.test(content) || 
                                   /href=["']\/(?!Conectando-Corazones\/)static\//.test(content);
      if (!hasUncorrectedPaths) {
        // Ya está todo correcto, no procesar
        return false;
      }
    }
    
    // Reemplazar rutas en src/href (solo si NO tienen el prefijo)
    content = content.replace(/src=["']\/(_expo\/[^"']+)["']/g, (match, path) => {
      if (path.includes('Conectando-Corazones/')) return match;
      return `src="${BASE_PATH}/${path}"`;
    });
    
    content = content.replace(/href=["']\/(_expo\/[^"']+)["']/g, (match, path) => {
      if (path.includes('Conectando-Corazones/')) return match;
      return `href="${BASE_PATH}/${path}"`;
    });
    
    content = content.replace(/src=["']\/(static\/[^"']+)["']/g, (match, path) => {
      if (path.includes('Conectando-Corazones/')) return match;
      return `src="${BASE_PATH}/${path}"`;
    });
    
    content = content.replace(/href=["']\/(static\/[^"']+)["']/g, (match, path) => {
      if (path.includes('Conectando-Corazones/')) return match;
      return `href="${BASE_PATH}/${path}"`;
    });
    
    // Reemplazar otras rutas absolutas (solo si NO tienen el prefijo)
    content = content.replace(/src=["']\/([^"']+)["']/g, (match, path) => {
      if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//') || 
          path.includes('Conectando-Corazones/')) {
        return match;
      }
      return `src="${BASE_PATH}/${path}"`;
    });
    
    content = content.replace(/href=["']\/([^"']+)["']/g, (match, path) => {
      if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//') ||
          path.includes('Conectando-Corazones/')) {
        return match;
      }
      return `href="${BASE_PATH}/${path}"`;
    });
    
    // Reemplazar en JSON y strings (solo si NO tienen el prefijo)
    content = content.replace(/"\/(?!Conectando-Corazones\/)_expo\//g, `"${BASE_PATH}/_expo/`);
    content = content.replace(/"\/(?!Conectando-Corazones\/)static\//g, `"${BASE_PATH}/static/`);
    content = content.replace(/'\/(?!Conectando-Corazones\/)_expo\//g, `'${BASE_PATH}/_expo/`);
    content = content.replace(/'\/(?!Conectando-Corazones\/)static\//g, `'${BASE_PATH}/static/`);
    
    // Reemplazar en strings de JavaScript
    content = content.replace(/([^"'])\/(?!Conectando-Corazones\/)_expo\//g, `$1${BASE_PATH}/_expo/`);
    content = content.replace(/([^"'])\/(?!Conectando-Corazones\/)static\//g, `$1${BASE_PATH}/static/`);
    
    // Reemplazar rutas que empiezan con / al inicio de string
    content = content.replace(/(import|require|from|src|href)\s*\(?\s*["']\/(?!Conectando-Corazones\/)_expo\//g, `$1("${BASE_PATH}/_expo/`);
    content = content.replace(/(import|require|from|src|href)\s*\(?\s*["']\/(?!Conectando-Corazones\/)static\//g, `$1("${BASE_PATH}/static/`);
    
    // Limpiar cualquier duplicación que pueda haber quedado (múltiples pasadas)
    // Patrón más específico: buscar /Conectando-Corazones/_expo/Conectando-Corazones/ y reemplazar
    let previousContent = '';
    let iterations = 0;
    while (content !== previousContent && iterations < 5) {
      previousContent = content;
      iterations++;
      
      // Limpiar duplicaciones específicas
      content = content.replace(
        new RegExp(`${BASE_PATH.replace('/', '\\/')}/_expo/${BASE_PATH.replace('/', '\\/')}/`, 'g'),
        `${BASE_PATH}/_expo/`
      );
      content = content.replace(
        new RegExp(`${BASE_PATH.replace('/', '\\/')}/static/${BASE_PATH.replace('/', '\\/')}/`, 'g'),
        `${BASE_PATH}/static/`
      );
      content = content.replace(
        new RegExp(`${BASE_PATH.replace('/', '\\/')}${BASE_PATH.replace('/', '\\/')}/`, 'g'),
        `${BASE_PATH}/`
      );
    }
    
    if (iterations > 1) {
      console.log(`🔧 ${filePath}: Limpiadas duplicaciones en ${iterations} iteraciones`);
    }

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
      // También procesar Service Workers y otros archivos importantes
      if (/\.(html|js|json|css|map)$/.test(file.name) || 
          file.name === 'index' || 
          file.name === '404' ||
          file.name === 'sw.js' ||
          file.name === 'service-worker.js') {
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
console.log('\n🔍 Verificando archivos importantes...');
const importantFiles = ['index.html'];
const htmlFiles = [];

// Buscar todos los archivos HTML
function findHtmlFiles(dir, baseDir = dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      findHtmlFiles(fullPath, baseDir);
    } else if (file.isFile() && file.name.endsWith('.html')) {
      htmlFiles.push(path.relative(baseDir, fullPath));
    }
  }
}

findHtmlFiles(DIST_DIR);

// Verificar archivos HTML
let htmlIssues = 0;
htmlFiles.forEach(file => {
  const fullPath = path.join(DIST_DIR, file);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    // Buscar rutas problemáticas
    const problematicPatterns = [
      /src=["']\/_expo\//g,
      /href=["']\/_expo\//g,
      /src=["']\/static\//g,
      /href=["']\/static\//g
    ];
    
    let hasIssues = false;
    problematicPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        hasIssues = true;
      }
    });
    
    if (hasIssues) {
      console.warn(`⚠️  ADVERTENCIA: ${file} aún contiene rutas sin corregir`);
      htmlIssues++;
    } else {
      console.log(`✅ ${file} - OK`);
    }
  } catch (error) {
    console.error(`❌ Error verificando ${file}:`, error.message);
  }
});

if (htmlIssues === 0 && htmlFiles.length > 0) {
  console.log(`\n✅ Todos los archivos HTML están correctos (${htmlFiles.length} archivos verificados)`);
} else if (htmlIssues > 0) {
  console.warn(`\n⚠️  ${htmlIssues} archivo(s) HTML aún tienen problemas`);
}


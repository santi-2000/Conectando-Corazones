# 🚀 Guía de Despliegue - Conectando Corazones

Esta guía te ayudará a desplegar tu aplicación PWA en GitHub Pages para que funcione como página web y como app instalable en móvil y computadora.

## 📋 Prerrequisitos

1. Tener un repositorio en GitHub
2. Tener Node.js instalado (versión 20 o superior)
3. Tener el backend desplegado y accesible (puede ser Heroku, Railway, Render, etc.)

## 🔧 Pasos para Desplegar

### 1. Configurar la URL del Backend en Producción

**IMPORTANTE:** Antes de desplegar, debes actualizar la URL de tu backend en producción.

Edita el archivo `frontend/constants/config.js` y cambia esta línea:

```javascript
return process.env.REACT_APP_API_URL || 'https://tu-backend-url.com/api/v1';
```

Reemplaza `'https://tu-backend-url.com/api/v1'` con la URL real de tu backend desplegado.

**Ejemplo:**
- Si tu backend está en Heroku: `'https://conectando-corazones.herokuapp.com/api/v1'`
- Si tu backend está en Railway: `'https://conectando-corazones.up.railway.app/api/v1'`
- Si tienes un dominio propio: `'https://api.tudominio.com/api/v1'`

### 2. Habilitar GitHub Pages en tu Repositorio

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, busca **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. Guarda los cambios

### 3. Hacer Push a la Rama Principal

El workflow de GitHub Actions se ejecutará automáticamente cuando hagas push a `main` o `master`:

```bash
git add .
git commit -m "Configurar despliegue en GitHub Pages"
git push origin main
```

### 4. Verificar el Despliegue

1. Ve a la pestaña **Actions** en tu repositorio de GitHub
2. Verás que el workflow "Deploy to GitHub Pages" está ejecutándose
3. Cuando termine, verás un check verde ✅
4. Ve a **Settings > Pages** y verás la URL de tu aplicación
5. Tu app estará disponible en: `https://tu-usuario.github.io/Conectando-Corazones/`

## 📱 Instalar como PWA

### En Móvil (Android/iOS)

**Android:**
1. Abre la URL de tu app en Chrome
2. Chrome mostrará un banner "Instalar app"
3. Toca "Instalar" o el icono de menú (⋮) > "Instalar app"

**iOS (Safari):**
1. Abre la URL en Safari
2. Toca el botón de compartir (□↑)
3. Selecciona "Agregar a pantalla de inicio"
4. Toca "Agregar"

### En Computadora (Desktop)

**Chrome/Edge:**
1. Abre la URL de tu app
2. Busca el icono de instalación (+) en la barra de direcciones
3. O ve a Menú (⋮) > "Instalar Conectando Corazones"
4. La app se instalará como una aplicación de escritorio

**Firefox:**
1. Abre la URL
2. Firefox mostrará un banner en la parte superior
3. Toca "Instalar" para agregar al escritorio

## 🔄 Actualizar la Aplicación

Cada vez que hagas cambios y hagas push a `main`, el workflow se ejecutará automáticamente y actualizará tu app en ~2-3 minutos.

## ⚙️ Configuración del Backend

### CORS

Asegúrate de que tu backend permita peticiones desde tu dominio de GitHub Pages:

```javascript
// En tu backend (ejemplo con Express)
const cors = require('cors');
app.use(cors({
  origin: [
    'https://tu-usuario.github.io',
    'http://localhost:3000' // Para desarrollo local
  ]
}));
```

### Variables de Entorno

Si usas variables de entorno en el frontend, puedes configurarlas en el workflow de GitHub Actions editando `.github/workflows/deploy.yml`:

```yaml
- name: Build web app
  working-directory: ./frontend
  run: npm run build
  env:
    NODE_ENV: production
    REACT_APP_API_URL: 'https://tu-backend-url.com/api/v1'
```

## 🐛 Solución de Problemas

### La app no se instala

1. Verifica que estés usando HTTPS (GitHub Pages lo proporciona automáticamente)
2. Verifica que el `manifest.json` esté accesible
3. Verifica que el Service Worker esté registrado (ver en DevTools > Application > Service Workers)

### El backend no responde

1. Verifica que la URL del backend en `config.js` sea correcta
2. Verifica que el backend esté desplegado y funcionando
3. Verifica los CORS en el backend
4. Abre la consola del navegador para ver errores

### La app no se actualiza

1. Limpia el caché del navegador
2. En DevTools, ve a Application > Clear Storage > Clear site data
3. Recarga la página

## 📝 Notas Importantes

- **HTTPS es obligatorio:** Las PWA requieren HTTPS para funcionar (GitHub Pages lo proporciona)
- **Service Worker:** Se registra automáticamente cuando la app carga
- **Offline:** La app funcionará offline para contenido estático una vez instalada
- **Backend:** Debe estar desplegado y accesible públicamente para que la app funcione completamente

## 🎉 ¡Listo!

Tu aplicación está desplegada y lista para ser instalada como PWA en cualquier dispositivo.


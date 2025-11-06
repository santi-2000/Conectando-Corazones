# 🚀 Configuración Exacta del Frontend en GitHub

## ✅ Paso 1: Actualizar URL del Backend

**IMPORTANTE:** Antes de desplegar, debes actualizar la URL de tu backend.

1. Abre el archivo: `frontend/constants/config.js`
2. Ve a la **línea 22** (aproximadamente)
3. Busca esta línea:
```javascript
return process.env.REACT_APP_API_URL || 'https://tu-backend-url.com/api/v1';
```

4. **Reemplaza** `'https://tu-backend-url.com/api/v1'` con la URL real de tu backend de Render

**Ejemplo:**
Si tu backend en Render es: `https://conectando-corazones.onrender.com`

Entonces cambia a:
```javascript
return process.env.REACT_APP_API_URL || 'https://conectando-corazones.onrender.com/api/v1';
```

**⚠️ IMPORTANTE:** 
- Debe terminar en `/api/v1`
- Debe ser `https://` (no `http://`)
- Usa la URL exacta que te dio Render

---

## 📝 Paso 2: Guardar y Hacer Commit

```bash
# Agregar el archivo modificado
git add frontend/constants/config.js

# Hacer commit
git commit -m "Configurar URL del backend para producción"

# Subir a GitHub
git push origin main
```

---

## ⚙️ Paso 3: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub: `https://github.com/tu-usuario/Conectando-Corazones`
2. Click en **"Settings"** (arriba, en el menú del repositorio)
3. En el menú lateral izquierdo, busca y click en **"Pages"**
4. En la sección **"Source"** o **"Build and deployment"**:
   - Selecciona **"GitHub Actions"** (NO selecciones "Deploy from a branch")
5. **No necesitas hacer nada más**, solo seleccionar GitHub Actions
6. GitHub guardará automáticamente

---

## 🚀 Paso 4: El Despliegue es Automático

Una vez que hagas push (Paso 2), GitHub Actions se ejecutará automáticamente:

1. Ve a la pestaña **"Actions"** en tu repositorio
2. Verás el workflow **"Deploy to GitHub Pages"** ejecutándose
3. Espera **2-3 minutos**
4. Cuando veas ✅ verde, está listo

---

## 🔗 Paso 5: Obtener tu URL

1. Ve a **Settings** → **Pages** (mismo lugar del Paso 3)
2. Verás tu URL en la parte superior:
   - Tipo: `https://tu-usuario.github.io/Conectando-Corazones/`
3. **¡Guarda esta URL!**

---

## ✅ Paso 6: Verificar que Funciona

1. Abre tu URL: `https://tu-usuario.github.io/Conectando-Corazones/`
2. La app debería cargar
3. Abre la consola del navegador (F12)
4. Ve a la pestaña **"Console"**
5. **No debe haber errores de CORS** (errores rojos sobre CORS)
6. Si hay errores, verifica que la URL del backend sea correcta

---

## 📋 Resumen de Pasos

```bash
# 1. Editar frontend/constants/config.js línea 22
#    Cambiar: 'https://tu-backend-url.com/api/v1'
#    Por: 'https://tu-backend-render.onrender.com/api/v1'

# 2. Guardar y subir
git add frontend/constants/config.js
git commit -m "Configurar backend URL"
git push origin main

# 3. En GitHub: Settings → Pages → Source: GitHub Actions

# 4. Esperar 2-3 minutos en Actions

# 5. Visitar tu URL en Pages
```

---

## 🐛 Si Algo No Funciona

### Error: "Cannot find module" o build falla
- Verifica que el workflow esté en `.github/workflows/deploy.yml`
- Verifica que el archivo existe

### Error de CORS en la consola
- Verifica que la URL del backend sea correcta
- Verifica que termine en `/api/v1`
- Verifica que el backend tenga `CORS_ORIGIN` configurado con tu URL de GitHub Pages

### La app carga pero no se conecta al backend
- Abre la consola (F12) y ve a la pestaña **Network**
- Intenta hacer una acción en la app
- Verifica que las peticiones vayan a tu backend de Render
- Si van a `localhost`, la URL no se actualizó correctamente

### El workflow no se ejecuta
- Verifica que esté en la rama `main` o `master`
- Verifica que el archivo `.github/workflows/deploy.yml` exista
- Verifica que hayas hecho push

---

## 📝 Ejemplo Completo

### Archivo: `frontend/constants/config.js`

**ANTES:**
```javascript
if (isProduction) {
  return process.env.REACT_APP_API_URL || 'https://tu-backend-url.com/api/v1';
}
```

**DESPUÉS (con tu URL de Render):**
```javascript
if (isProduction) {
  return process.env.REACT_APP_API_URL || 'https://conectando-corazones-abc123.onrender.com/api/v1';
}
```

---

## ✅ Checklist Final

- [ ] URL del backend actualizada en `config.js`
- [ ] Archivo guardado
- [ ] Cambios subidos a GitHub (`git push`)
- [ ] GitHub Pages habilitado (Settings → Pages → GitHub Actions)
- [ ] Workflow ejecutado exitosamente (Actions → ✅ verde)
- [ ] URL obtenida (Settings → Pages)
- [ ] App carga correctamente
- [ ] No hay errores de CORS en la consola
- [ ] La app se conecta al backend correctamente

---

## 🎉 ¡Listo!

Una vez completados estos pasos:
- ✅ Tu frontend estará en GitHub Pages
- ✅ Se conectará automáticamente a tu backend en Render
- ✅ Funcionará como PWA instalable
- ✅ Cada push actualizará automáticamente la app

---

## 💡 Próximos Pasos

1. **Instalar como PWA:**
   - Móvil: Chrome mostrará banner "Instalar app"
   - Desktop: Icono (+) en la barra de direcciones

2. **Compartir tu app:**
   - Comparte la URL: `https://tu-usuario.github.io/Conectando-Corazones/`
   - Cualquiera puede usarla como página web o instalarla como app

3. **Hacer cambios:**
   - Edita archivos localmente
   - `git push origin main`
   - Los cambios se desplegarán automáticamente en 2-3 minutos


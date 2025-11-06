# 🚀 Guía Completa de Despliegue - Conectando Corazones

## ✅ Lo que ya tienes

- ✅ **TiDB Cloud** - Base de datos configurada
- ✅ **Backend** - Código listo para desplegar
- ✅ **Frontend** - PWA configurada para GitHub Pages

## 📋 Resumen de Pasos

1. **Desplegar Backend** → Railway/Render/Heroku
2. **Configurar Frontend** → Actualizar URL del backend
3. **Desplegar Frontend** → GitHub Pages (automático)
4. **Instalar PWA** → En móvil y computadora

---

## 🔧 Paso 1: Desplegar Backend

### Opción A: Railway (Recomendado)

1. Ve a [railway.app](https://railway.app) y crea cuenta
2. **New Project** → **Deploy from GitHub repo**
3. Selecciona tu repositorio
4. En **Settings** → **Root Directory**: `backend`
5. En **Variables**, agrega:

```env
DB_HOST=tu-host-tidb.tidbcloud.com
DB_PORT=4000
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=conectando_corazones
NODE_ENV=production
CORS_ORIGIN=https://tu-usuario.github.io
```

6. Railway te dará una URL: `https://tu-proyecto.up.railway.app`
7. **¡Guarda esta URL!** La necesitarás en el siguiente paso

### Opción B: Render

1. Ve a [render.com](https://render.com)
2. **New** → **Web Service**
3. Conecta tu repositorio
4. **Root Directory**: `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Agrega las mismas variables de entorno
8. Obtendrás: `https://tu-proyecto.onrender.com`

---

## 📝 Paso 2: Configurar Frontend

1. Edita `frontend/constants/config.js` línea 22
2. Cambia:
```javascript
return process.env.REACT_APP_API_URL || 'https://tu-proyecto.up.railway.app/api/v1';
```
3. Reemplaza con tu URL real del backend

---

## 🚀 Paso 3: Desplegar Frontend (Automático)

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. Haz push a `main`:
```bash
git add .
git commit -m "Configurar despliegue"
git push origin main
```
5. Espera ~3 minutos
6. Tu app estará en: `https://tu-usuario.github.io/Conectando-Corazones/`

---

## 📱 Paso 4: Instalar como PWA

### En Móvil

**Android:**
- Abre la URL en Chrome
- Toca "Instalar app" cuando aparezca el banner

**iOS:**
- Abre en Safari
- Compartir (□↑) → "Agregar a pantalla de inicio"

### En Computadora

**Chrome/Edge:**
- Abre la URL
- Busca el icono (+) en la barra de direcciones
- Click en "Instalar"

---

## ✅ Verificar que Todo Funciona

1. **Backend:** `https://tu-backend.up.railway.app/health`
   - Debe responder: `{"status":"OK"}`

2. **Frontend:** `https://tu-usuario.github.io/Conectando-Corazones/`
   - Debe cargar la app

3. **Conexión:** Abre la consola del navegador (F12)
   - No debe haber errores de CORS
   - Las peticiones al backend deben funcionar

---

## 🐛 Problemas Comunes

### Error de CORS
- Verifica que `CORS_ORIGIN` tenga tu dominio exacto
- El backend ya permite `*.github.io` automáticamente

### Backend no responde
- Verifica las variables de entorno en Railway
- Revisa los logs en Railway
- Verifica que TiDB Cloud permita conexiones desde Railway

### Frontend no se conecta
- Verifica la URL del backend en `config.js`
- Asegúrate de que termine en `/api/v1`
- Verifica que el backend esté funcionando

---

## 🎉 ¡Listo!

Tu aplicación está desplegada y funcionando:
- ✅ Backend en Railway/Render
- ✅ Frontend en GitHub Pages
- ✅ Base de datos en TiDB Cloud
- ✅ PWA instalable en cualquier dispositivo

---

## 📚 Documentación Adicional

- `BACKEND_DEPLOY.md` - Detalles del despliegue del backend
- `DEPLOY.md` - Detalles del despliegue del frontend
- `DEPLOY_QUICK_START.md` - Guía rápida


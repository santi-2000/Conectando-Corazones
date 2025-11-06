# 🚀 Despliegue del Backend - Conectando Corazones

Tu backend ya está configurado para TiDB Cloud. Ahora necesitas desplegar el servidor Node.js en un servicio de hosting.

## 📋 Opciones de Hosting Recomendadas

### 1. **Railway** (Recomendado - Gratis para empezar)
- ✅ Fácil de usar
- ✅ Soporte para variables de entorno
- ✅ Despliegue automático desde GitHub
- ✅ HTTPS incluido

### 2. **Render** (Gratis con limitaciones)
- ✅ Plan gratuito disponible
- ✅ Despliegue automático
- ✅ HTTPS incluido

### 3. **Heroku** (Requiere tarjeta para plan gratuito)
- ✅ Muy popular
- ✅ Fácil de usar

## 🚀 Desplegar en Railway (Recomendado)

### Paso 1: Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Crea un nuevo proyecto

### Paso 2: Conectar tu repositorio
1. En Railway, click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Selecciona tu repositorio `Conectando-Corazones`
4. Selecciona la carpeta `backend` como raíz del proyecto

### Paso 3: Configurar variables de entorno
En Railway, ve a **Variables** y agrega:

```env
# Base de datos TiDB Cloud (obtén estos valores de tu panel de TiDB Cloud)
DB_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=tu_usuario_tidb
DB_PASSWORD=tu_password_tidb
DB_NAME=conectando_corazones
DB_CHARSET=utf8mb4

# Puerto del servidor (Railway lo asigna automáticamente, pero puedes dejarlo)
PORT=3000

# Entorno
NODE_ENV=production

# CORS - Agrega tu dominio de GitHub Pages
# IMPORTANTE: Reemplaza 'tu-usuario' con tu usuario de GitHub
CORS_ORIGIN=https://tu-usuario.github.io
```

**IMPORTANTE:** 
- Reemplaza los valores de TiDB con los tuyos reales (los encuentras en tu panel de TiDB Cloud)
- Reemplaza `tu-usuario` con tu usuario real de GitHub
- El backend ya está configurado para permitir automáticamente `*.github.io`, pero es mejor especificarlo

### Paso 4: Configurar el build
Railway detectará automáticamente que es Node.js, pero asegúrate de que:
- **Root Directory:** `backend`
- **Build Command:** (dejar vacío, Railway lo detecta)
- **Start Command:** `npm start`

### Paso 5: Obtener la URL
1. Railway te dará una URL automática tipo: `https://tu-proyecto.up.railway.app`
2. Esta es la URL de tu backend

## 🔧 Configurar CORS en el Backend

Asegúrate de que tu backend permita peticiones desde GitHub Pages. Edita `backend/index.js`:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir sin origen (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://tu-usuario.github.io',
      'http://localhost:3000',
      'http://localhost:19006',
      process.env.CORS_ORIGIN?.split(',') || []
    ].flat();
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
```

## 📝 Actualizar Frontend

Una vez que tengas la URL de tu backend desplegado:

1. Edita `frontend/constants/config.js` línea 22:
```javascript
return process.env.REACT_APP_API_URL || 'https://tu-proyecto.up.railway.app/api/v1';
```

2. Reemplaza `'https://tu-proyecto.up.railway.app/api/v1'` con tu URL real de Railway

## ✅ Verificar que funciona

1. Ve a la URL de tu backend: `https://tu-proyecto.up.railway.app/api/v1/diagnostic`
2. Deberías ver información del sistema
3. Si funciona, tu backend está listo

## 🔒 Seguridad

- ✅ Nunca subas tu `.env` a GitHub
- ✅ Usa variables de entorno en Railway
- ✅ Tu TiDB Cloud ya tiene SSL configurado
- ✅ Railway proporciona HTTPS automáticamente

## 🐛 Solución de Problemas

### Error de conexión a TiDB
- Verifica que las variables de entorno estén correctas
- Verifica que la IP de Railway esté permitida en TiDB Cloud (si aplica)
- Revisa los logs en Railway

### Error de CORS
- Verifica que tu dominio de GitHub Pages esté en `CORS_ORIGIN`
- Verifica que el backend esté usando la configuración de CORS correcta

### El backend no inicia
- Revisa los logs en Railway
- Verifica que `package.json` tenga el script `start`
- Verifica que Node.js versión sea compatible (>=18.0.0)

## 📚 Alternativas Rápidas

### Render.com
1. Ve a [render.com](https://render.com)
2. **New** → **Web Service**
3. Conecta tu repositorio
4. **Root Directory:** `backend`
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. Agrega las mismas variables de entorno

### Heroku
1. Instala Heroku CLI
2. `heroku create tu-proyecto`
3. `heroku config:set DB_HOST=...` (para cada variable)
4. `git push heroku main`

## 🎉 Listo

Una vez desplegado:
- Tu backend estará en: `https://tu-proyecto.up.railway.app`
- Tu frontend se conectará automáticamente
- Todo funcionará con TiDB Cloud


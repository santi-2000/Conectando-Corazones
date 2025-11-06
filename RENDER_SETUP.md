# 🎨 Configuración Paso a Paso en Render

## 📍 Paso 1: Crear el Servicio Web

1. Ve a [render.com](https://render.com) e inicia sesión
2. Click en **"New +"** (botón azul en la esquina superior derecha)
3. Selecciona **"Web Service"**
4. Conecta tu repositorio de GitHub:
   - Si es la primera vez, autoriza Render para acceder a tus repositorios
   - Selecciona el repositorio `Conectando-Corazones`
   - Click en **"Connect"**

---

## 📁 Paso 2: Configurar Root Directory

1. Después de conectar el repositorio, verás el formulario de configuración
2. Busca la sección **"Root Directory"** (está en la parte superior del formulario)
3. Escribe: `backend`
4. Esto le dice a Render que el código está en la carpeta `backend`

---

## ⚙️ Paso 3: Configurar Build y Start Commands

En el mismo formulario, configura:

### Build Command:
```
npm install
```

### Start Command:
```
npm start
```

---

## 🔐 Paso 4: Configurar Variables de Entorno

1. En el mismo formulario de creación, baja hasta la sección **"Environment Variables"**
2. O después de crear el servicio, ve a **"Environment"** en el menú lateral
3. Click en **"Add Environment Variable"** o el botón **"+ Add"**
4. Agrega cada variable una por una:

#### Variable 1: DB_HOST
- **Key:** `DB_HOST`
- **Value:** `tu-host-tidb.tidbcloud.com` (reemplaza con tu host real de TiDB)
- Click en **"Save"**

#### Variable 2: DB_PORT
- **Key:** `DB_PORT`
- **Value:** `4000` (o el puerto que te dio TiDB Cloud)
- Click en **"Save"**

#### Variable 3: DB_USER
- **Key:** `DB_USER`
- **Value:** `tu_usuario_tidb` (tu usuario de TiDB Cloud)
- Click en **"Save"**

#### Variable 4: DB_PASSWORD
- **Key:** `DB_PASSWORD`
- **Value:** `tu_password_tidb` (tu contraseña de TiDB Cloud)
- Click en **"Save"**

#### Variable 5: DB_NAME
- **Key:** `DB_NAME`
- **Value:** `conectando_corazones` (o el nombre de tu base de datos)
- Click en **"Save"**

#### Variable 6: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- Click en **"Save"**

#### Variable 7: CORS_ORIGIN
- **Key:** `CORS_ORIGIN`
- **Value:** `https://tu-usuario.github.io` (reemplaza `tu-usuario` con tu usuario real de GitHub)
- Click en **"Save"**

---

## 🚀 Paso 5: Configurar Plan y Desplegar

1. En el formulario, selecciona el plan:
   - **Free** (gratis, con limitaciones)
   - O un plan de pago si lo prefieres

2. **Name:** Déjalo como está o cámbialo (ej: `conectando-corazones-backend`)

3. **Region:** Selecciona la región más cercana a ti

4. **Branch:** Deja `main` (o la rama que uses)

5. Click en **"Create Web Service"**

---

## ⏳ Paso 6: Esperar el Despliegue

1. Render comenzará a construir y desplegar tu servicio
2. Verás los logs en tiempo real
3. Esto puede tardar 5-10 minutos la primera vez
4. Cuando termine, verás **"Live"** en verde

---

## 🔗 Paso 7: Obtener la URL

1. Una vez desplegado, Render te dará una URL automática
2. Tipo: `https://conectando-corazones-backend.onrender.com`
3. **¡Guarda esta URL!** La necesitarás para el frontend

---

## ✅ Paso 8: Verificar que Funciona

1. Ve a la URL que te dio Render
2. Agrega `/health` al final: `https://tu-servicio.onrender.com/health`
3. Deberías ver: `{"status":"OK","message":"Conectando Corazones API funcionando",...}`

---

## 📝 Ejemplo Visual de Variables

Una vez agregadas, deberías ver algo así en la lista de Variables:

```
DB_HOST = gateway01.us-east-1.prod.aws.tidbcloud.com
DB_PORT = 4000
DB_USER = tu_usuario_real
DB_PASSWORD = tu_password_real
DB_NAME = conectando_corazones
NODE_ENV = production
CORS_ORIGIN = https://tu-usuario-real.github.io
```

---

## 🎯 Ubicación Exacta en Render

### Si estás creando el servicio (primera vez):
- Todo está en el formulario de creación
- **Root Directory** está en la parte superior
- **Environment Variables** está más abajo, antes de crear

### Si ya creaste el servicio:
1. Ve a tu **Dashboard** en Render
2. Click en tu servicio (el nombre que le diste)
3. En el menú lateral izquierdo, click en **"Environment"**
4. Ahí puedes agregar/editar variables

### Para editar Root Directory después:
1. Ve a tu servicio
2. Click en **"Settings"** en el menú lateral
3. Busca **"Root Directory"**
4. Cámbialo a `backend` si no lo configuraste antes
5. Click en **"Save Changes"**

---

## 🔄 Actualizar Variables Después de Crear

Si necesitas agregar o cambiar variables después:

1. Ve a tu servicio en Render
2. Click en **"Environment"** en el menú lateral izquierdo
3. Verás todas las variables actuales
4. Click en **"Add Environment Variable"**
5. Agrega la nueva variable
6. Render reiniciará automáticamente el servicio

---

## ⚠️ Importante

### Valores de TiDB Cloud:
- **DB_HOST, DB_USER, DB_PASSWORD:** Los encuentras en tu panel de TiDB Cloud
  - Ve a TiDB Cloud → Tu cluster → **"Connect"** o **"Connection Info"**
  - Ahí verás el host, usuario y contraseña

### CORS_ORIGIN:
- Si tu usuario de GitHub es `juan123`, entonces: `https://juan123.github.io`
- Si tu repositorio se llama diferente, ajusta la URL
- Ejemplo completo: `https://juan123.github.io/Conectando-Corazones/`

### Plan Gratuito de Render:
- ⚠️ El servicio se "duerme" después de 15 minutos de inactividad
- La primera petición después de dormir puede tardar ~30 segundos en despertar
- Para producción, considera un plan de pago o usa Railway

---

## 🐛 Si Algo No Funciona

### 1. Build falla:
- Revisa los logs en la pestaña **"Logs"**
- Verifica que el Root Directory sea exactamente `backend` (sin espacios)
- Verifica que `package.json` esté en la carpeta `backend`

### 2. No se conecta a TiDB:
- Verifica que todas las variables de entorno estén correctas
- Revisa los logs para ver el error específico
- Verifica que el host de TiDB sea correcto (incluye el dominio completo)

### 3. Variables no se aplican:
- Después de agregar variables, Render reinicia automáticamente
- Espera a que termine el reinicio
- Verifica en los logs que las variables se cargaron

### 4. Servicio no inicia:
- Revisa los logs en tiempo real
- Verifica que el Start Command sea `npm start`
- Verifica que `package.json` tenga el script `start`

---

## 📸 Estructura Visual

```
Render Dashboard
└── Tu Servicio Web
    ├── Overview (pestaña)
    ├── Logs (pestaña) ← Ver logs aquí
    ├── Metrics (pestaña)
    ├── Environment (pestaña) ← Variables aquí ⭐
    ├── Settings (pestaña) ← Root Directory aquí ⭐
    └── Events (pestaña)
```

---

## ✅ Checklist Completo

- [ ] Repositorio conectado a Render
- [ ] Root Directory configurado como `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] DB_HOST agregado
- [ ] DB_PORT agregado (4000)
- [ ] DB_USER agregado
- [ ] DB_PASSWORD agregado
- [ ] DB_NAME agregado
- [ ] NODE_ENV = production
- [ ] CORS_ORIGIN con tu URL de GitHub Pages
- [ ] Servicio desplegado exitosamente
- [ ] Health check responde OK
- [ ] URL guardada para usar en el frontend

---

## 🔗 Siguiente Paso

Una vez que tengas la URL de Render (ej: `https://tu-servicio.onrender.com`):

1. Edita `frontend/constants/config.js` línea 22
2. Cambia a: `https://tu-servicio.onrender.com/api/v1`
3. Haz push a GitHub
4. Tu frontend se conectará automáticamente al backend

---

## 💡 Tips Adicionales

- **Logs en tiempo real:** Render muestra los logs mientras construye y despliega
- **Auto-deploy:** Cada push a `main` despliega automáticamente (puedes desactivarlo en Settings)
- **Custom Domain:** Puedes agregar tu propio dominio en Settings → Custom Domain
- **Health Checks:** Render verifica automáticamente que tu servicio esté funcionando

---

¡Una vez que completes estos pasos, tu backend estará desplegado y funcionando en Render! 🎉


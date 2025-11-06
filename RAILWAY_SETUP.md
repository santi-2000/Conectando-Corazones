# 🚂 Configuración Paso a Paso en Railway

## 📍 Paso 1: Configurar Root Directory

1. En Railway, ve a tu proyecto (el que acabas de crear)
2. Click en el servicio que se creó automáticamente (o crea uno nuevo si no hay)
3. Click en el servicio para abrir sus configuraciones
4. Ve a la pestaña **"Settings"** (Configuración)
5. Busca la sección **"Source"** o **"Build & Deploy"**
6. Encuentra el campo **"Root Directory"** o **"Working Directory"**
7. Escribe: `backend`
8. Guarda los cambios (Railway guarda automáticamente)

---

## 🔐 Paso 2: Configurar Variables de Entorno

### Opción A: Desde la página del servicio

1. En la página principal de tu servicio en Railway
2. Click en la pestaña **"Variables"** (está en la parte superior, junto a "Settings", "Deployments", etc.)
3. Verás una sección que dice **"New Variable"** o un botón **"+ New"**
4. Agrega cada variable una por una:

#### Variable 1: DB_HOST
- **Name:** `DB_HOST`
- **Value:** `tu-host-tidb.tidbcloud.com` (reemplaza con tu host real de TiDB)
- Click en **"Add"** o **"Save"**

#### Variable 2: DB_PORT
- **Name:** `DB_PORT`
- **Value:** `4000` (o el puerto que te dio TiDB Cloud)
- Click en **"Add"**

#### Variable 3: DB_USER
- **Name:** `DB_USER`
- **Value:** `tu_usuario_tidb` (tu usuario de TiDB Cloud)
- Click en **"Add"**

#### Variable 4: DB_PASSWORD
- **Name:** `DB_PASSWORD`
- **Value:** `tu_password_tidb` (tu contraseña de TiDB Cloud)
- Click en **"Add"**

#### Variable 5: DB_NAME
- **Name:** `DB_NAME`
- **Value:** `conectando_corazones` (o el nombre de tu base de datos)
- Click en **"Add"**

#### Variable 6: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- Click en **"Add"**

#### Variable 7: CORS_ORIGIN
- **Name:** `CORS_ORIGIN`
- **Value:** `https://tu-usuario.github.io` (reemplaza `tu-usuario` con tu usuario real de GitHub)
- Click en **"Add"**

### Opción B: Desde Settings → Variables

1. Click en **"Settings"** en la parte superior
2. Busca la sección **"Variables"** o **"Environment Variables"**
3. Click en **"New Variable"** o el botón **"+ Add"**
4. Agrega las mismas variables que arriba

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

## 🔄 Paso 3: Trigger Deploy (si es necesario)

1. Después de agregar las variables, Railway debería detectar los cambios automáticamente
2. Si no se despliega automáticamente:
   - Ve a la pestaña **"Deployments"**
   - Click en **"Redeploy"** o **"Deploy"**

---

## ✅ Paso 4: Verificar que Funciona

1. Espera a que el deploy termine (verás un check verde ✅)
2. Railway te dará una URL automática tipo: `https://tu-proyecto.up.railway.app`
3. Prueba la URL: `https://tu-proyecto.up.railway.app/health`
4. Deberías ver: `{"status":"OK","message":"Conectando Corazones API funcionando",...}`

---

## 🎯 Ubicación Exacta en Railway

### Si no encuentras "Variables":
1. Click en tu **servicio** (no en el proyecto, sino en el servicio dentro del proyecto)
2. En la parte superior verás pestañas: **"Deployments"**, **"Settings"**, **"Variables"**, **"Metrics"**, etc.
3. Click en **"Variables"**

### Si no encuentras "Root Directory":
1. Click en **"Settings"**
2. Busca **"Source"** o **"Build & Deploy"**
3. Ahí está **"Root Directory"**

---

## ⚠️ Importante

- **DB_HOST, DB_USER, DB_PASSWORD:** Los encuentras en tu panel de TiDB Cloud
  - Ve a TiDB Cloud → Tu cluster → **"Connect"** o **"Connection Info"**
  - Ahí verás el host, usuario y contraseña

- **CORS_ORIGIN:** 
  - Si tu usuario de GitHub es `juan123`, entonces: `https://juan123.github.io`
  - Si tu repositorio se llama diferente, ajusta la URL

---

## 🐛 Si Algo No Funciona

1. **Variables no se guardan:**
   - Asegúrate de hacer click en "Add" o "Save" después de cada variable
   - Verifica que no haya espacios extra en los nombres

2. **Deploy falla:**
   - Revisa los logs en la pestaña **"Deployments"**
   - Verifica que todas las variables estén correctas
   - Verifica que el Root Directory sea exactamente `backend` (sin espacios)

3. **No se conecta a TiDB:**
   - Verifica que las credenciales de TiDB sean correctas
   - Verifica que el host incluya el puerto correcto (generalmente 4000)
   - Revisa los logs para ver el error específico

---

## 📸 Ubicación Visual

```
Railway Dashboard
└── Tu Proyecto
    └── Tu Servicio
        ├── Deployments (pestaña)
        ├── Settings (pestaña) ← Root Directory aquí
        ├── Variables (pestaña) ← Variables aquí ⭐
        ├── Metrics (pestaña)
        └── Logs (pestaña)
```

---

## ✅ Checklist

- [ ] Root Directory configurado como `backend`
- [ ] DB_HOST agregado
- [ ] DB_PORT agregado (4000)
- [ ] DB_USER agregado
- [ ] DB_PASSWORD agregado
- [ ] DB_NAME agregado
- [ ] NODE_ENV = production
- [ ] CORS_ORIGIN con tu URL de GitHub Pages
- [ ] Deploy completado exitosamente
- [ ] Health check responde OK

---

¡Una vez que completes estos pasos, tu backend estará desplegado y funcionando! 🎉


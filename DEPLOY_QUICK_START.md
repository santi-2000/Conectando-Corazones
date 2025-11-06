# ⚡ Despliegue Rápido - Conectando Corazones

## 🚀 Pasos Rápidos

### 1. Actualizar URL del Backend

Edita `frontend/constants/config.js` línea 22:

```javascript
return process.env.REACT_APP_API_URL || 'https://TU-BACKEND-URL.com/api/v1';
```

**Cambia `'https://TU-BACKEND-URL.com/api/v1'` por la URL real de tu backend.**

### 2. Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. Guarda

### 3. Hacer Push

```bash
git add .
git commit -m "Configurar despliegue"
git push origin main
```

### 4. Esperar ~3 minutos

Ve a **Settings** → **Pages** para ver tu URL.

## 📱 Instalar como App

### Móvil
- **Android:** Chrome mostrará banner "Instalar app"
- **iOS:** Safari → Compartir → "Agregar a pantalla de inicio"

### Computadora
- **Chrome/Edge:** Icono (+) en la barra de direcciones → "Instalar"

## ✅ Listo

Tu app estará disponible en: `https://tu-usuario.github.io/Conectando-Corazones/`

Para más detalles, ver `DEPLOY.md`


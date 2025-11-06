# 🔐 Información de Login

## Usuarios de Prueba Disponibles

Basado en la base de datos, estos son los usuarios que puedes usar para iniciar sesión:

### Usuario Administrador
- **Username/Email**: `maria_admin` o `admin@conectando-corazones.com`
- **Password**: `password` (hash: `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`)
- **Rol**: Administrador

### Usuarios Normales
1. **Sofia García**
   - **Username/Email**: `sofia_garcia` o `sofia.garcia@email.com`
   - **Password**: `password`
   - **Rol**: Usuario normal

2. **Carlos Rodríguez**
   - **Username/Email**: `carlos_rodriguez` o `carlos.rodriguez@email.com`
   - **Password**: `password`
   - **Rol**: Usuario normal

3. **Ana López**
   - **Username/Email**: `ana_lopez` o `ana.lopez@email.com`
   - **Password**: `password`
   - **Rol**: Usuario normal

## ⚠️ Nota Importante

**Todos los usuarios de prueba usan la contraseña: `password`**

El hash bcrypt en la base de datos (`$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`) corresponde a la contraseña `password`.

### Puedes usar:
- **Username** (ej: `sofia_garcia`) O
- **Email** (ej: `sofia.garcia@email.com`)

Ambos funcionan para iniciar sesión.

## 🔍 Debugging

Si no puedes iniciar sesión:

1. **Abre la consola del navegador** (F12 o Cmd+Option+I en Mac)
2. **Busca estos logs**:
   - `🔐 Login: Intentando iniciar sesión...`
   - `🌐 Backend URL: ...`
   - `🌐 API POST ...`
   - `📥 Response status: ...`

3. **Verifica**:
   - Que la URL del backend sea correcta (debe ser `https://conectando-corazones-8ias.onrender.com/api/v1`)
   - Que no haya errores de CORS
   - Que el backend esté respondiendo

## 🐛 Problemas Comunes

### Error: "Error de conexión"
- El backend no está disponible
- Verifica que Render esté funcionando: `https://conectando-corazones-8ias.onrender.com/health`

### Error: "No permitido por CORS"
- El backend no está permitiendo tu origen
- Verifica que `CORS_ORIGIN` en Render incluya `https://santi-2000.github.io`

### Error: "Credenciales inválidas"
- Usuario o contraseña incorrectos
- Usa uno de los usuarios de prueba listados arriba

### No aparecen logs en la consola
- El JavaScript no se está cargando
- Verifica que no haya errores 404 en la pestaña Network
- Verifica que el workflow de GitHub Pages haya terminado correctamente


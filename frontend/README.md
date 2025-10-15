# Conectando Corazones - Frontend

Una aplicación móvil desarrollada con React Native y Expo, diseñada para ser compatible con dispositivos Android e iPhone, especialmente dirigida a usuarios de bajos recursos.

## 🚀 Características

- **Diseño Responsive**: Compatible con Android e iPhone
- **Componentes Reutilizables**: Arquitectura modular
- **JavaScript Puro**: Sin TypeScript para mayor simplicidad
- **Gradientes Modernos**: Diseño atractivo y profesional
- **Navegación Intuitiva**: Expo Router para navegación fluida

## 📱 Pantallas

### Pantalla de Inicio de Sesión
- **Ruta**: `/login`
- **Características**:
  - Gradiente de colores vibrantes (magenta a naranja)
  - Campos de usuario y contraseña
  - Botón de "Crear cuenta"
  - Logo de FAFORE
  - Diseño responsive para diferentes tamaños de pantalla

### Pantalla Principal (Home)
- **Ruta**: `/home`
- **Características**:
  - Navegación a 18 pantallas diferentes
  - Módulos: Biblioteca, Calendario, Directorio, Fafore, Moms Week, Usuario

## 🏗️ Estructura del Proyecto

```
frontend/
├── app/                    # Pantallas de la aplicación
│   ├── index.jsx          # Redirección a login
│   ├── login.jsx          # Pantalla de inicio de sesión
│   ├── home.jsx           # Pantalla principal
│   ├── _layout.jsx        # Configuración de navegación
│   └── [módulos]/         # Pantallas por módulos
├── components/            # Componentes reutilizables
│   ├── Button.jsx         # Botón personalizable
│   └── Input.jsx          # Campo de entrada
├── constants/            # Constantes y configuración
│   ├── colors.js         # Paleta de colores
│   ├── dimensions.js     # Dimensiones responsive
│   └── theme.js          # Tema de la aplicación
└── assets/               # Recursos (imágenes, etc.)
```

## 🎨 Sistema de Diseño

### Colores
- **Gradiente Principal**: Magenta (#8B1A8B) → Naranja (#FF6B35)
- **Botones**: Rosa claro (#FFB6C1), Azul iOS (#007AFF)
- **Texto**: Gris oscuro (#333), Gris medio (#666)
- **Marca FAFORE**: Amarillo (#FFD700), Naranja (#FF6B35), Morado (#8B1A8B)

### Componentes
- **Button**: Botón personalizable con variantes (primary, secondary, outline)
- **Input**: Campo de entrada con validación y estilos consistentes

### Responsive Design
- **Dispositivos Pequeños**: < 375px
- **Dispositivos Medianos**: 375px - 414px
- **Dispositivos Grandes**: > 414px
- **Tamaños de Fuente**: Adaptativos según el dispositivo
- **Espaciado**: Sistema consistente de espaciado

## 🛠️ Tecnologías

- **React Native**: Framework principal
- **Expo**: Herramientas de desarrollo y build
- **Expo Router**: Navegación
- **Expo Linear Gradient**: Gradientes
- **JavaScript**: Lenguaje principal (sin TypeScript)
- **ESLint**: Linting y calidad de código

## 📦 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en Web
npm run web

# Linting
npm run lint
```

## 🎯 Objetivos de Accesibilidad

- **Compatibilidad Universal**: Android e iPhone
- **Optimización para Dispositivos de Bajo Costo**: Rendimiento optimizado
- **Interfaz Intuitiva**: Fácil de usar para todos los usuarios
- **Diseño Responsive**: Se adapta a diferentes tamaños de pantalla

## 📋 Próximos Pasos

1. **Implementar Autenticación**: Sistema de login real
2. **Desarrollar Módulos**: Completar las 18 pantallas
3. **Agregar Funcionalidades**: Características específicas por módulo
4. **Optimización**: Mejoras de rendimiento
5. **Testing**: Pruebas en dispositivos reales

## 🤝 Contribución

El proyecto está estructurado para facilitar el desarrollo colaborativo con:
- Componentes reutilizables
- Constantes centralizadas
- Estructura modular
- Código limpio y documentado
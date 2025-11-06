export default {
  expo: {
    name: "Conectando Corazones",
    slug: "conectando-corazones",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "conectandocorazones",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    developmentClient: {
      silentLaunch: true
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "Esta app necesita acceso a la cámara para tomar fotos para tu diario semanal.",
        NSPhotoLibraryUsageDescription: "Esta app necesita acceso a tu galería de fotos para seleccionar imágenes para tu diario semanal."
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      output: "static",
      bundler: "metro",
      favicon: "./assets/images/logo-fafore.png",
      // Configuración para GitHub Pages (si el repositorio no está en la raíz)
      baseUrl: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : undefined
    },
    plugins: [
      "expo-router",
      "expo-font",
      [
        "expo-splash-screen",
        {
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Esta app necesita acceso a tu galería de fotos para seleccionar imágenes para tu diario semanal.",
          cameraPermission: "Esta app necesita acceso a la cámara para tomar fotos para tu diario semanal."
        }
      ]
    ],
    experiments: {
      reactCompiler: true
    },
    extra: {
      // Removed EAS projectId to allow anonymous development
    }
  }
};

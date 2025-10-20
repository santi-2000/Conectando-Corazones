export default {
  expo: {
    name: "Conectando Corazones",
    slug: "Conectando-Corazones",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "conectandocorazones",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "single",
      bundler: "metro",
      favicon: "./assets/images/logo-fafore.png",
      name: "Conectando Corazones",
      shortName: "Conectando",
      description: "App de apoyo familiar para madres y familias",
      themeColor: "#E6F4FE",
      backgroundColor: "#E6F4FE",
      display: "standalone",
      orientation: "portrait",
      startUrl: "/",
      scope: "/",
      lang: "es",
      dir: "ltr"
    },
    plugins: [
      "expo-router",
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
      ]
    ],
    experiments: {
      reactCompiler: true
    },
    extra: {
      eas: {
        projectId: "your-project-id-here"
      }
    }
  }
};

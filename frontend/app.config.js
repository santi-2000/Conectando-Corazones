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
      output: "static",
      bundler: "metro",
      favicon: "./assets/images/logo-fafore.png"
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
      // Removed EAS projectId to allow anonymous development
    }
  }
};

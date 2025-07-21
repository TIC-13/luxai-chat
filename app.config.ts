const LuxAIChat = {
  name: "LuxAI Chat",
  icon: "./assets/images/app-icon.png",
  androidPackage: "com.luxai.ragchat",
  splashScreenConfig: {
    backgroundColor: "#fff",
    image: "./assets/images/splash-icon-lightmode.png",
    dark: {
      image: "./assets/images/splash-icon-darkmode.png",
      backgroundColor: "#151718",
    },
    imageWidth: 200,
  },
}

const MotorolaChat = {
  name: "Moto Chat Razr 40",
  icon: "./assets/images/motorola_icon.png",
  androidPackage: "com.luxai.razr40",
  splashScreenConfig: {
    backgroundColor: "#fff",
    image: "./assets/images/motorola_splash_screen.png",
    dark: {
      image: "./assets/images/motorola_splash_screen.png",
      backgroundColor: "#151718",
    },
    imageWidth: 200,
    resizeMode: "contain",
  },
}

const AppVersion = process.env.EXPO_PUBLIC_APP === "RAZR_40"? MotorolaChat: LuxAIChat;

export default {
  expo: {
    name: AppVersion.name,
    slug: "rag-chat",
    version: "1.0.0",
    orientation: "portrait",
    icon: AppVersion.icon,
    scheme: "ragchat",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    androidStatusBar: {
      barStyle: "light-content",
    },
    android: {
      edgeToEdgeEnabled: true,
      package: AppVersion.androidPackage,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 26,
            usesCleartextTraffic: true
          },
        },
      ],
      [
        "expo-splash-screen",
        AppVersion.splashScreenConfig
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "f1a5c265-00fc-4ff7-8693-776a89435678",
      },
    },
  },
};

export { AppVersion };


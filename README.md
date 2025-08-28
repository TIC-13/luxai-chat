## Lux.AI Chat

**Lux.AI Chat** is a fully local AI-powered assistant designed to answer questions about any knowledge base using Retrieval-Augmented Generation (RAG). 

### 🔍 Key Features
- **Local Language Model**: Utilizes [Qwen2.5-1.5B-Instruct-GGUF](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF), a compact and efficient instruction-tuned LLM.
- **Local RAG Pipeline**: Employs the [bge-small-en-v1.5](https://huggingface.co/BAAI/bge-small-en-v1.5) embedding model for semantic search.
- **Image-Enhanced Chat**: Capable of displaying relevant images in the chat to enhance answers and context.
- **Private & Secure**: Stores chat history locally with full support for deletion and no cloud-based data storage. 
- **Automatic Runtime Downloads**: All required models and files are downloaded automatically at runtime—no manual setup needed.

## 📋 Prerequisites

Before running the app, ensure you have the following installed:

- **Node.js**: Version 20.x or newer
- **Android Studio** with Android SDK and Java Development Kit (JDK)
- **Yarn package manager**

## 🚀 Installation

1. **Clone the repository**:
```bash
git clone --recurse-submodules https://github.com/TIC-13/rag-chat
cd rag-chat
```

2. **Install dependencies**:
```bash
yarn 
```

## 📱 Running the App

### Android 

1. **Build and run the app**:
```bash
yarn expo run:android
```

This command will:
- Build the app for Android
- Install it on your connected device or emulator
- Start the Metro bundler
- Launch the app automatically

2. **For development after initial build**:
```bash
yarn expo start -d
```

After the initial build, you can use `yarn expo start -d` to run the development server without rebuilding.

### Alternative Build Method

You can also build the app using Android Studio:

1. **Open in Android Studio**:
   - Open Android Studio
   - Select "Open an existing Android Studio project"
   - Navigate to and select the `android` folder in your project directory
   - Build and run the project from Android Studio using the standard Android development workflow
   - Run `yarn expo start -d` in the terminal and restart the app

### Prerequisites for Android Development

- **Android Device**: Either a physical Android device with USB debugging enabled, or an Android Virtual Device (AVD) running in Android Studio
- **ADB**: Android Debug Bridge should be accessible from your terminal (usually installed with Android Studio)

## 🔧 Configuration

The app automatically downloads required AI models at runtime. No additional configuration is needed for the AI features.

You can switch the LLM and RAG files, including the database, by editing constants like `MODEL_LINK`, `MODEL_NAME` `RAG_MODEL_LINK` and `RAG_MODEL_NAME` on `constants/Files.ts`

## Hosting the backend

This app includes a [backend](https://github.com/TIC-13/rag-chat-backend) that is currently used only to optionally store user conversation reports.
When deploying an instance of the app, the backend is optional. If you choose to host it, create a `.env` file and set the `EXPO_PUBLIC_API_URL` environment variable to the URL of your hosted server instance.

## Motorola theme

This app supports a Motorola theme that changes the app's name, icon, and colors to match the Motorola brand.
To activate it, set the environment variable `EXPO_PUBLIC_APP` to `MOTOROLA`.

## 📝 Usage

1. Launch the app on your Android device
2. Wait for the initial model downloads to complete
3. Start asking questions about the Moto Razr 60 Ultra manual
4. The AI will provide relevant answers with supporting images when available
5. Chat history is stored locally and can be cleared from within the app

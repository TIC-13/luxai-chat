import { NativeModules } from "react-native";

type RagModuleType = {
  isLoaded: () => Promise<boolean>;
  loadFromInternalStorage: (modelPath: string, tokenizerPath: string, vectorsPath: string, chunksPath: string) => Promise<boolean>;
  loadFromAndroidAssets: (modelPath: string, tokenizerPath: string, vectorsPath: string, chunksPath: string) => Promise<boolean>;
  getPrompt: (query: string, k?: number) => Promise<RagPrompt>;
};

type RagPrompt = {
  systemMessage: string;
  query: string;
  instructions: string;
  userMessage: string;
  contexts: string[];
}

const { RagModule } = NativeModules;

const Rag: RagModuleType = {
  isLoaded: () => RagModule.isLoaded(),
  loadFromAndroidAssets: (modelPath, tokenizerPath, vectorsPath, chunksPath) =>
    RagModule.loadFromAndroidAssets(modelPath, tokenizerPath, vectorsPath, chunksPath),
  loadFromInternalStorage: (modelPath, tokenizerPath, vectorsPath, chunksPath) =>
    RagModule.loadFromInternalStorage(modelPath, tokenizerPath, vectorsPath, chunksPath),
  getPrompt: (query, k = 2) => RagModule.getPrompt(query, k),
};

export default Rag;
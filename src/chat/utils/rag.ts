import { NativeModules } from "react-native";

type RagModuleType = {
  isLoaded: () => Promise<boolean>;
  loadFromInternalStorage: (modelPath: string, tokenizerPath: string, vectorsPath: string, chunksPath: string, rerankerTokenizerFilename?: string, rerankerFileFilename?: string) => Promise<boolean>;
  loadFromAndroidAssets: (modelPath: string, tokenizerPath: string, vectorsPath: string, chunksPath: string, rerankerTokenizerFilename?: string, rerankerFileFilename?: string) => Promise<boolean>;
  getPrompt: (query: string, k?: number) => Promise<RagPrompt>;
};

type RagPrompt = {
  query: string;
  contexts: string[];
}

const { RagModule } = NativeModules;

const Rag: RagModuleType = {
  isLoaded: () => RagModule.isLoaded(),
  loadFromAndroidAssets: (modelPath, tokenizerPath, vectorsPath, chunksPath, rerankerTokenizerFilename, rerankerFileFilename) =>
    RagModule.loadFromAndroidAssets(modelPath, tokenizerPath, vectorsPath, chunksPath, rerankerTokenizerFilename, rerankerFileFilename),
  loadFromInternalStorage: (modelPath, tokenizerPath, vectorsPath, chunksPath, rerankerTokenizerFilename, rerankerFileFilename) =>
    RagModule.loadFromInternalStorage(modelPath, tokenizerPath, vectorsPath, chunksPath, rerankerTokenizerFilename, rerankerFileFilename),
  getPrompt: (query, k = 2) => RagModule.getPrompt(query, k),
};

export default Rag;
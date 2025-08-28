import { useDownloadProps } from '@/src/download/hooks/useDownload';
import * as FileSystem from 'expo-file-system';

//IMPORTANTE: Caso atulizar o link do arquivo, é essencial mudar o nome nesse arquivo também, pois é assim que o aplicativo sabe que o arquivo mudou e precisa baixar novamente 

const MODEL_LINK = "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q8_0.gguf"
const FILES_FOLDER = FileSystem.cacheDirectory + "models/"
const MODEL_NAME = "qwen2.5-1.5b-instruct-q8_0.gguf"

const RAG_MODEL_LINK = "https://huggingface.co/BAAI/bge-small-en-v1.5/resolve/main/onnx/model.onnx"
const RAG_MODEL_NAME = "model.onnx"

const TOKENIZER_LINK = "https://huggingface.co/BAAI/bge-small-en-v1.5/resolve/main/tokenizer.json"
const TOKENIZER_NAME = "tokenizer_bge_small.json"

const EMBEDDINGS_LINK = "https://drive.google.com/uc?export=download&id=1sqPcsG49pSzaHtdI1aqxl1mRYFfR4Xlj"
const EMBEDDINGS_NAME = "embeddings_razr_60_ultra_mean_pooled_vectors_v1.2.1.csv"

const CHUNKS_LINK = "https://drive.google.com/uc?export=download&id=1ogzxZJO9gXzQ0OIKJXB2kGb6LOpS3idx"
const CHUNKS_NAME = "chunks_razr_60_ultra_v1.2.1.txt"

const RERANKER_FILE_LINK = "https://huggingface.co/mixedbread-ai/mxbai-rerank-xsmall-v1/resolve/main/onnx/model.onnx"
const RERANKER_FILE_NAME = "mxbai-reranker-xsmall.onnx"

const RERANKER_TOKENIZER_LINK = "https://drive.google.com/uc?export=download&id=1T_Vy_vXAY6p72BT2E_bzt4ABVHfWmoFj"
const RERANKER_TOKENIZER_FILE_NAME = "reranker_tokenizer.json"

export const IMAGES_FILE_LINK = "https://drive.google.com/uc?export=download&id=1CvIHo0jzP_H-BfwSwLwTshG9F-GhTFMK"
export const IMAGES_FILE_NAME = "images_razr_60_ultra_v1.2.1.zip"
export const IMAGES_FULL_PATH  = FILES_FOLDER + IMAGES_FILE_NAME

export const MODEL_COMPLET_PATH = FILES_FOLDER + MODEL_NAME
export const RAG_MODEL_PATH = "/models/" + RAG_MODEL_NAME
export const TOKENIZER_PATH = "/models/" + TOKENIZER_NAME
export const EMBEDDINGS_PATH = "/models/" + EMBEDDINGS_NAME
export const CHUNKS_PATH = "/models/" + CHUNKS_NAME
export const RERANKER_TOKENIZER_PATH = "/models/" + RERANKER_TOKENIZER_FILE_NAME
export const RERANKER_FILE_PATH = "/models/" + RERANKER_FILE_NAME 

export const DOWNLOADS: useDownloadProps[] = [
    {
        downloadLink: MODEL_LINK,
        saveFolderPath: FILES_FOLDER,
        filename: MODEL_NAME,
    },
    {
        downloadLink: RAG_MODEL_LINK,
        saveFolderPath: FILES_FOLDER,
        filename: RAG_MODEL_NAME,
    },
    {
        downloadLink: TOKENIZER_LINK,
        saveFolderPath: FILES_FOLDER,
        filename: TOKENIZER_NAME,
    },
    {
        downloadLink: EMBEDDINGS_LINK,
        saveFolderPath: FILES_FOLDER,
        filename: EMBEDDINGS_NAME,
    },
    {
        downloadLink: CHUNKS_LINK,
        saveFolderPath: FILES_FOLDER,
        filename: CHUNKS_NAME,
    },
    {
        downloadLink: IMAGES_FILE_LINK,
        saveFolderPath: FILES_FOLDER,
        filename: IMAGES_FILE_NAME
    },
    {
        downloadLink: RERANKER_TOKENIZER_LINK,
        saveFolderPath: FILES_FOLDER,
        filename: RERANKER_TOKENIZER_FILE_NAME
    },
    {
        downloadLink: RERANKER_FILE_LINK,
        saveFolderPath: FILES_FOLDER,
        filename: RERANKER_FILE_NAME
    }
]

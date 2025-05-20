import { useDownloadProps } from '@/src/download/hooks/useDownload';
import * as FileSystem from 'expo-file-system';

const MODEL_LINK = "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-fp16.gguf"
const FILES_FOLDER = FileSystem.cacheDirectory + "models/"
const MODEL_NAME = "qwen2.5-1.5b-instruct-fp16.gguf"

const RAG_MODEL_LINK = "https://huggingface.co/BAAI/bge-small-en-v1.5/resolve/main/onnx/model.onnx"
const RAG_MODEL_NAME = "model.onnx"

const TOKENIZER_LINK = "https://drive.google.com/uc?export=download&id=1j4maCOisPUe8jUqqS0UfibLwkAZ5JxYO"
const TOKENIZER_NAME = "tokenizer.json"

const EMBEDDINGS_LINK = "https://drive.google.com/uc?export=download&id=1Ir5rB52ShrmPMVGCDsyo-VLHIjN2ga0P"
const EMBEDDINGS_NAME = "embeddings.csv"

const CHUNKS_LINK = "https://drive.google.com/uc?export=download&id=1dQUNqjv-FLaDsZj5NSo_NKb8LIvSVLMq"
const CHUNKS_NAME = "chunks.csv"

export const IMAGES_FILE_LINK = "https://drive.google.com/uc?export=download&id=1KNIYng9qwfdyj_a3LRPDIdRT42sdXPGE"
export const IMAGES_FILE_NAME = "manual-images.zip"
export const IMAGES_FULL_PATH  = FILES_FOLDER + IMAGES_FILE_NAME

export const MODEL_COMPLET_PATH = FILES_FOLDER + MODEL_NAME
export const RAG_MODEL_PATH = "/models/" + RAG_MODEL_NAME
export const TOKENIZER_PATH = "/models/" + TOKENIZER_NAME
export const EMBEDDINGS_PATH = "/models/" + EMBEDDINGS_NAME
export const CHUNKS_PATH = "/models/" + CHUNKS_NAME

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
    }
]

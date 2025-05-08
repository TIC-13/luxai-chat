import * as FileSystem from 'expo-file-system';
import { initLlama, LlamaContext, RNLlamaOAICompatibleMessage } from "llama.rn";
import { useEffect, useState } from "react";
import Rag from '../utils/rag';

type useLLMProps = {
    onMessagesUpdate?: (messages: RNLlamaOAICompatibleMessage[]) => void
}

export default function useLLM({ onMessagesUpdate }: useLLMProps) {

    const [llama, setLlama] = useState<LlamaContext | null>(null)
    const [ragLoaded, setRagLoaded] = useState(false)
    const [messages, setMessages] = useState<RNLlamaOAICompatibleMessage[]>([])

    const [isDecoding, setIsDecoding] = useState(false)

    useEffect(() => {
        reload()
        loadRAG().then(() => setRagLoaded(true))
    }, [])

    useEffect(() => {
        onMessagesUpdate?.(messages)
    }, [messages]);

    const isLoading = llama === null
    const isUnableToSend = isLoading || isDecoding || !ragLoaded

    function reload() {
        if (isDecoding)
            throw new Error("Model is decoding")

        setMessages([])
        setLlama(null)
        loadLLM().then((context) => {
            setLlama(context)
        })
    }

    async function sendMessage(prompt: string) {
        if (llama === null)
            throw new Error("Model is not initialized yet")

        if (isDecoding)
            throw new Error("Model is already decoding")

        if(!ragLoaded)
            throw new Error("RAG is not loaded yet")

        const ragContext = await Rag.getPrompt(prompt, 2)

        setIsDecoding(true)
      
        setMessages(prevMessages => {
            const newMessagesWithoutContext = [...prevMessages, { role: 'user', content: prompt }]
            const newMessagesWithContext = [...prevMessages, { role: 'user', content: ragContext.userMessage }]
            completePrompt({
                context: llama,
                messages: [
                    {
                        role: 'system',
                        content: ragContext.systemMessage,
                    },
                    ...newMessagesWithContext
                ],
                onEnd: () => {
                    setIsDecoding(false)
                },
                onDecodeToken: (token) => {
                    addTokenToLastLLMMessage(token)
                }
            })
            return newMessagesWithoutContext
        })
    }

    function addTokenToLastLLMMessage(token: string) {
        setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];

            if (lastMessage === undefined || lastMessage.role !== 'bot') {
                const newMessage = { role: 'bot', content: token };
                return [...prevMessages, newMessage];
            }

            const updatedMessage = { ...lastMessage, content: lastMessage.content + token };
            return [...prevMessages.slice(0, -1), updatedMessage];
        });
    }

    return { isLoading, isDecoding, messages, isUnableToSend, sendMessage, reload }

}

async function loadLLM(modelPath: string = FileSystem.cacheDirectory + "qwen2.5-1.5b-instruct-q2_k.gguf"): Promise<LlamaContext> {
    return await initLlama({
        model: modelPath,
        use_mlock: true,
        n_ctx: 2048,
        n_gpu_layers: 99,
    })
}

async function loadRAG() {
    console.log("Loading RAG...")
    await Rag.loadFromInternalStorage(
        "model.onnx",
        "tokenizer.json",
        "embeddings.csv",
        "chunks.csv"
    )
}

type CompletionProps = {
    context: LlamaContext,
    messages: RNLlamaOAICompatibleMessage[],
    onEnd: () => void,
    onDecodeToken: (token: string) => void
}

async function completePrompt({ context, messages, onEnd, onDecodeToken }: CompletionProps) {
    const stopWords = ['</s>', '<|end|>', '<|eot_id|>', '<|end_of_text|>', '<|im_end|>', '<|EOT|>', '<|END_OF_TURN_TOKEN|>', '<|end_of_turn|>', '<|endoftext|>']
    await context.completion(
        {
            messages,
            n_predict: 100,
            stop: stopWords,
        },
        (data) => {
            const { token } = data
            onDecodeToken(token)
            console.log(token)
        },
    )
    onEnd()
}

import { LLMMessage } from '@/src/chat/types/LLMMessage';
import Rag from '@/src/chat/utils/rag';
import * as FileSystem from 'expo-file-system';
import { initLlama, LlamaContext, RNLlamaOAICompatibleMessage } from "llama.rn";
import { useEffect, useState } from "react";

type useLLMProps = {
    onMessagesUpdate?: (messages: LLMMessage[]) => void
}

export default function useLLM({ onMessagesUpdate }: useLLMProps) {

    const [llama, setLlama] = useState<LlamaContext | null>(null)
    const [ragLoaded, setRagLoaded] = useState(false)
    const [messages, setMessages] = useState<LLMMessage[]>([])

    const [isDecoding, setIsDecoding] = useState(false)

    useEffect(() => {
        reload()
        loadRAG().then(() => setRagLoaded(true))
    }, [])

    useEffect(() => {
        console.log("Messages: ", messages.map(it => it.message))
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
            throw new Error("Model is not initialized yet");

        if (isDecoding)
            throw new Error("Model is already decoding");

        if (!ragLoaded)
            throw new Error("RAG is not loaded yet");

        setIsDecoding(true);

        const ragOutput = await Rag.getPrompt(prompt, 2);
      
        const newMessagesWithoutContextInPrompt = [
            ...messages,
            { message: { role: 'user', content: prompt } },
        ];

        const newMessagesWithContextInPrompt = [
            ...messages,
            { message: { role: 'user', content: ragOutput.userMessage } },
        ];

        setMessages(newMessagesWithoutContextInPrompt);

        completePrompt({
            context: llama,
            messages: [
                {
                    role: 'system',
                    content: ragOutput.systemMessage + ". Feel free to answer the question in markdown",
                },
                ...newMessagesWithContextInPrompt.map((message) => message.message),
            ],
            onEnd: () => {
                setIsDecoding(false);
            },
            onDecodeToken: (token) => {
                addTokenToLastLLMMessage(token, ragOutput.contexts);
            },
        });
    }

    function addTokenToLastLLMMessage(token: string, contexts: string[]) {
        setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];

            if (lastMessage === undefined || lastMessage.message.role !== 'bot') {
                const newMessage = { ...lastMessage, contexts, message: { role: 'bot', content: token } };
                return [...prevMessages, newMessage];
            }

            const updatedMessage = { ...lastMessage, contexts, message: { ...lastMessage.message, content: lastMessage.message.content + token } };
            return [...prevMessages.slice(0, -1), updatedMessage];
        });
    }

    return { isLoading, isDecoding, messages, isUnableToSend, sendMessage, reload }

}

async function loadLLM(modelPath: string = FileSystem.cacheDirectory + "qwen2.5-1.5b-instruct-fp16.gguf"): Promise<LlamaContext> {
    return await initLlama({
        model: modelPath
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
            n_predict: 400,
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

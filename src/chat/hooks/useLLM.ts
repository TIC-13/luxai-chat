import * as FileSystem from 'expo-file-system';
import { initLlama, LlamaContext, RNLlamaOAICompatibleMessage } from "llama.rn";
import { useEffect, useState } from "react";

type useLLMProps = {
    onMessagesUpdate?: (messages: RNLlamaOAICompatibleMessage[]) => void
}

export default function useLLM({onMessagesUpdate}: useLLMProps) {

    const [llama, setLlama] = useState<LlamaContext | null>(null)
    const [messages, setMessages] = useState<RNLlamaOAICompatibleMessage[]>([])

    const [isDecoding, setIsDecoding] = useState(false)

    useEffect(() => {
        reload()
    }, [])

    useEffect(() => {
        onMessagesUpdate?.(messages)
    }, [messages]);

    const isLoading = llama === null
    const isUnableToSend = isLoading || isDecoding

    function reload() {
        if (isDecoding)
            throw new Error("Model is decoding")

        setMessages([])
        setLlama(null)
        loadLLM().then((context) => {
            setLlama(context)
        })
    }

    function sendMessage(prompt: string) {
        if (llama === null)
            throw new Error("Model is not initialized yet")

        if (isDecoding)
            throw new Error("Model is already decoding")

        setIsDecoding(true)
        const newMessage = { role: 'user', content: prompt }

        setMessages(prevMessages => {
            const newMessages = [...prevMessages, newMessage]
            completePrompt({
                context: llama,
                messages: [
                    {
                        role: 'system',
                        content: 'This is a conversation between user and assistant, a friendly chatbot.',
                    },
                    ...newMessages
                ],
                onEnd: () => {
                    setIsDecoding(false)
                },
                onDecodeToken: (token) => {
                    addTokenToLastLLMMessage(token)
                }
            })
            return newMessages
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

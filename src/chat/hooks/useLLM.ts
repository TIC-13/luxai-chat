import { CHUNKS_PATH, EMBEDDINGS_PATH, MODEL_COMPLET_PATH, RAG_MODEL_PATH, RERANKER_FILE_PATH, RERANKER_TOKENIZER_PATH, TOKENIZER_PATH } from '@/constants/Files';
import { LLMMessage } from '@/src/chat/types/LLMMessage';
import Rag from '@/src/chat/utils/rag';
import { initLlama, LlamaContext, RNLlamaOAICompatibleMessage } from "llama.rn";
import { useEffect, useState } from "react";
import { conversations } from '../utils/storeConversations';

type useLLMProps = {
    onMessagesUpdate?: (messages: LLMMessage[]) => void,
    conversationId: string
}

export default function useLLM({ onMessagesUpdate, conversationId }: useLLMProps) {

    const [llama, setLlama] = useState<LlamaContext | null>(null)
    const [ragLoaded, setRagLoaded] = useState(false)
    const [messages, setMessages] = useState<LLMMessage[]>(getPreviousMessagesIfExist)

    const [isDecoding, setIsDecoding] = useState(false)

    useEffect(() => {
        load()
        loadRAG().then(() => setRagLoaded(true))
    }, [])

    useEffect(() => {
        resetMessages()
    }, [conversationId])

    useEffect(() => {
        storeConversation(messages)
        onMessagesUpdate?.(messages)
    }, [messages]);

    const isLoading = llama === null
    const isUnableToSend = isLoading || isDecoding || !ragLoaded

    function storeConversation(messages: LLMMessage[]) {

        if (messages.length === 0)
            return false

        const parsedMessages = messages[messages.length - 1].message.role === "user" ?
            messages.slice(0, -1) : messages

        if (parsedMessages.length === 0)
            return false

        const title = parsedMessages[0].message.content

        conversations.set(conversationId, {
            title: title.length === 0? "Chat": title,
            id: conversationId,
            messages: parsedMessages
        })

        console.log("SAVED CONV")

        return true
    }

    function getStoredConversationIfExists() {
        return conversations.get(conversationId)
    }

    function getPreviousMessagesIfExist() {
        return (getStoredConversationIfExists()?.messages) ?? []
    }

    function load() {
        if (isDecoding)
            throw new Error("Model is decoding")

        resetMessages()
        setLlama(null)
        loadLLM().then((context) => {
            setLlama(context)
        })
    }

    function resetMessages() {
        setMessages(getPreviousMessagesIfExist())
    }

    async function sendMessage(messages: LLMMessage[], prompt: string) {
        if (llama === null)
            throw new Error("Model is not initialized yet");

        if (isDecoding)
            throw new Error("Model is already decoding");

        if (!ragLoaded)
            throw new Error("RAG is not loaded yet");

        setIsDecoding(true);

        const newMessagesWithoutContextInPrompt = [
            ...messages,
            { message: { role: 'user', content: prompt } },
        ];
        setMessages(newMessagesWithoutContextInPrompt);

        const ragOutput = await Rag.getPrompt(prompt, 2);

        const newMessagesWithContextInPrompt = [
            ...messages,
            { message: { role: 'user', content: ragOutput.userMessage } },
        ];

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

    return { isLoading, isDecoding, messages, isUnableToSend, sendMessage: (prompt: string) => sendMessage(messages, prompt) }

}

async function loadLLM(modelPath: string = MODEL_COMPLET_PATH): Promise<LlamaContext> {
    return await initLlama({
        model: modelPath
    })
}

async function loadRAG() {
    console.log("Loading RAG...")
    await Rag.loadFromInternalStorage(
        RAG_MODEL_PATH,
        TOKENIZER_PATH,
        EMBEDDINGS_PATH,
        CHUNKS_PATH,
        RERANKER_TOKENIZER_PATH,
        RERANKER_FILE_PATH
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

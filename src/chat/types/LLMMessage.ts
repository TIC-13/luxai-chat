import { RNLlamaOAICompatibleMessage } from "llama.rn"

export type LLMMessage = {
    message: RNLlamaOAICompatibleMessage,
    contexts?: string[]
}
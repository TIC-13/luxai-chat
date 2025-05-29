import { LLMMessage } from "./LLMMessage"

export type Conversation = {
    title: string,
    id: string,
    messages: LLMMessage[]
}
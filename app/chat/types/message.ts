export type Sender = 'user' | 'system'

export type Message = {
    sender: Sender
    text: string
}
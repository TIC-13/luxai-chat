import { PersistentDictionary } from "@/src/utils/mmkv/dictionary";
import { Conversation } from "../types/Conversation";

export const conversations = new PersistentDictionary<Conversation>("conversations")

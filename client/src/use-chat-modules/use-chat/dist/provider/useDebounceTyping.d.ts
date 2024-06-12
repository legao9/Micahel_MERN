import { ConversationId, UserId } from "../Types";
import { IStorage } from "../interfaces";
export declare const useDebounceTyping: (duration: number, updateState: () => void, storage: IStorage) => (conversationId: ConversationId, userId: UserId) => void;

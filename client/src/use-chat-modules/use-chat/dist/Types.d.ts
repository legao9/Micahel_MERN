import { IChatService, IStorage } from "./interfaces";
import { ChatEventType, MessageContentType } from "./enums";
import { ChatEvent } from "./events";
import { MessageGroup } from "./MessageGroup";
import { Conversation } from "./Conversation";
import { User } from "./User";
import { ChatMessage } from "./ChatMessage";
export declare type ChatEventHandler<T extends ChatEventType, E extends ChatEvent<T>> = (event: E) => void;
export declare type ChatMessageId = string;
export declare type ConversationId = string;
export declare type UserId = string;
export declare type Permission = unknown;
export declare type GroupedMessages = Record<ConversationId, MessageGroup[]>;
export declare type ChatState = {
    /**
     * Current logged in user (chat operator)
     */
    currentUser?: User;
    users: Array<User>;
    conversations: Array<Conversation>;
    activeConversation?: Conversation;
    currentMessages: MessageGroup[];
    messages: GroupedMessages;
    /**
     * Current Message input value
     */
    currentMessage: string;
};
export declare type UpdateState = () => void;
export declare type ChatServiceFactory<S extends IChatService> = (storage: IStorage, update: UpdateState) => S;
export declare type SendMessageServiceParams = {
    message: ChatMessage<MessageContentType>;
    conversationId: ConversationId;
};
export interface SendTypingServiceParams {
    conversationId: ConversationId;
    userId: UserId;
    content: string;
    isTyping: boolean;
}

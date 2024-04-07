import type { ReactNode } from "react";
import type { ChatServiceFactory, ChatState, ConversationId, SendTypingServiceParams, UserId } from "../Types";
import type { IChatService, IStorage } from "../interfaces";
import PropTypes from "prop-types";
import { AutoDraft, MessageContentType } from "../enums";
import type { Conversation } from "../Conversation";
import type { User } from "../User";
import type { ChatMessage } from "../ChatMessage";
import type { MessageGroup } from "../MessageGroup";
export interface SendMessageParams {
    message: ChatMessage<MessageContentType>;
    conversationId: ConversationId;
    senderId: string;
    generateId?: boolean;
    clearMessageInput?: boolean;
}
export interface SendTypingParams extends SendTypingServiceParams {
    throttle: boolean;
}
declare type ChatContextProps = ChatState & {
    currentMessages: MessageGroup[];
    setCurrentUser: (user: User) => void;
    addUser: (user: User) => boolean;
    removeUser: (userId: UserId) => boolean;
    getUser: (userId: UserId) => User | undefined;
    setActiveConversation: (conversationId: ConversationId) => void;
    sendMessage: (params: SendMessageParams) => void;
    addMessage: (message: ChatMessage<MessageContentType>, conversationId: ConversationId, generateId: boolean) => void;
    updateMessage: (message: ChatMessage<MessageContentType>) => void;
    setDraft: (message: string) => void;
    sendTyping: (params: SendTypingParams) => void;
    addConversation: (conversation: Conversation) => void;
    removeConversation: (conversationId: ConversationId, removeMessages: boolean | undefined) => boolean;
    getConversation: (conversationId: ConversationId) => Conversation | undefined;
    updateState: () => void;
    setCurrentMessage: (message: string) => void;
    resetState: () => void;
    service: IChatService;
};
export declare const useChat: () => ChatContextProps;
export interface ChatProviderConfig {
    typingThrottleTime?: number;
    typingDebounceTime?: number;
    debounceTyping?: boolean;
    autoDraft?: AutoDraft;
}
export interface ChatProviderProps<S extends IChatService> {
    serviceFactory: ChatServiceFactory<S>;
    storage: IStorage;
    config: ChatProviderConfig;
    children?: ReactNode;
}
/**
 * Provides methods to operate on chat and properties and collections of chat
 * @param children
 * @param {IChatService} service
 * @param {IStorage} storage
 * @constructor
 */
export declare const ChatProvider: {
    <S extends IChatService>({ serviceFactory, storage, config: { typingThrottleTime, debounceTyping, typingDebounceTime, autoDraft, }, children, }: ChatProviderProps<S>): JSX.Element;
    defaultProps: {
        config: {
            typingThrottleTime: number;
            debounceTyping: boolean;
            typingDebounceTime: number;
        };
    };
    propTypes: {
        children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        service: PropTypes.Requireable<object>;
        storage: PropTypes.Requireable<object>;
        config: PropTypes.Requireable<object>;
    };
};
export {};

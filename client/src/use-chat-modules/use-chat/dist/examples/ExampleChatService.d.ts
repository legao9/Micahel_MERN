import { IChatService } from "../interfaces/IChatService";
import { ChatEventType, MessageContentType } from "../enums";
import { ChatEventHandler, SendMessageServiceParams, SendTypingServiceParams, UpdateState } from "../Types";
import { IStorage } from "../interfaces";
import { ChatEvent } from "../events";
import { ChatMessage } from "../ChatMessage";
declare type EventHandlers = {
    onMessage: ChatEventHandler<ChatEventType.Message, ChatEvent<ChatEventType.Message>>;
    onConnectionStateChanged: ChatEventHandler<ChatEventType.ConnectionStateChanged, ChatEvent<ChatEventType.ConnectionStateChanged>>;
    onUserConnected: ChatEventHandler<ChatEventType.UserConnected, ChatEvent<ChatEventType.UserConnected>>;
    onUserDisconnected: ChatEventHandler<ChatEventType.UserDisconnected, ChatEvent<ChatEventType.UserDisconnected>>;
    onUserPresenceChanged: ChatEventHandler<ChatEventType.UserPresenceChanged, ChatEvent<ChatEventType.UserPresenceChanged>>;
    onUserTyping: ChatEventHandler<ChatEventType.UserTyping, ChatEvent<ChatEventType.UserTyping>>;
    [key: string]: any;
};
export declare class ExampleChatService implements IChatService {
    storage?: IStorage;
    updateState: UpdateState;
    eventHandlers: EventHandlers;
    constructor(storage: IStorage, update: UpdateState);
    sendMessage({ message, conversationId }: SendMessageServiceParams): ChatMessage<MessageContentType>;
    sendTyping({ isTyping, content, conversationId, userId, }: SendTypingServiceParams): void;
    on<T extends ChatEventType, H extends ChatEvent<T>>(evtType: T, evtHandler: ChatEventHandler<T, H>): void;
    off<T extends ChatEventType, H extends ChatEvent<T>>(evtType: T, eventHandler: ChatEventHandler<T, H>): void;
}
export {};

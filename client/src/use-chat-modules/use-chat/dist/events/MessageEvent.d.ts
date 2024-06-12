import { ChatEventType, MessageContentType } from "../enums";
import { ChatEvent } from "./ChatEvent";
import { ConversationId } from "../Types";
import { ChatMessage } from "../ChatMessage";
export declare type MessageEventParams<T extends MessageContentType> = {
    message: ChatMessage<MessageContentType>;
    conversationId: ConversationId;
};
export declare class MessageEvent implements ChatEvent<ChatEventType.Message> {
    readonly type = ChatEventType.Message;
    message: ChatMessage<MessageContentType>;
    conversationId: ConversationId;
    constructor({ message, conversationId, }: MessageEventParams<MessageContentType>);
}

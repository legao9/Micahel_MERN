import { MessageContentType, MessageDirection, MessageStatus } from "./enums";
import { MessageContent } from "./interfaces/MessageContent";
import { ChatMessageId } from "./Types";
export declare type ChatMessageParams<T extends MessageContentType> = {
    id: ChatMessageId;
    status: MessageStatus;
    contentType: T;
    senderId: string;
    direction: MessageDirection;
    content: MessageContent<T>;
    cratedDate?: Date;
    updatedDate?: Date;
};
export declare class ChatMessage<T extends MessageContentType> {
    id: ChatMessageId;
    status: MessageStatus;
    contentType: MessageContentType;
    senderId: string;
    direction: MessageDirection;
    content: MessageContent<T>;
    createdDate: Date;
    updatedDate?: Date;
    constructor({ id, status, contentType, senderId, direction, content, cratedDate, updatedDate, }: ChatMessageParams<MessageContentType>);
}

import { ChatMessageId, UserId } from "./Types";
import { MessageDirection } from "./enums";
import { ChatMessage } from "./";
import { MessageContentType } from "./enums";
declare type MessageGroupParams = {
    id: string;
    senderId: string;
    direction: MessageDirection;
};
export declare class MessageGroup {
    readonly id: string;
    readonly senderId: UserId;
    readonly direction: MessageDirection;
    messages: Array<ChatMessage<MessageContentType>>;
    constructor({ id, senderId, direction }: MessageGroupParams);
    addMessage(message: ChatMessage<MessageContentType>): void;
    getMessage(id: ChatMessageId): [ChatMessage<MessageContentType>, number] | [undefined, undefined];
    /**
     * Replace message in message collection
     * @param message
     */
    updateMessage(message: ChatMessage<MessageContentType>): void;
    /**
     * Replace message at specified index
     * Return true if message exists in specified position.
     * Returns true if index is out of bound
     * @param message
     * @param index
     */
    replaceMessage(message: ChatMessage<MessageContentType>, index: number): boolean;
}
export {};

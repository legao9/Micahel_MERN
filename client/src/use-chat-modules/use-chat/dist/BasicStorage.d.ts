import { IStorage } from "./interfaces";
import { ChatState, ConversationId, UserId } from "./Types";
import { ChatMessage, Conversation, Participant, Presence } from "./";
import { User } from "./User";
import { MessageContentType } from "./";
export declare type MessageIdGenerator = (message: ChatMessage<MessageContentType>) => string;
export declare type GroupIdGenerator = () => string;
export interface BasicStorageParams {
    groupIdGenerator: GroupIdGenerator;
    messageIdGenerator?: MessageIdGenerator;
}
export declare class BasicStorage<ConversationData = any> implements IStorage<ConversationData> {
    private readonly _groupIdGenerator;
    private readonly _messageIdGenerator?;
    get groupIdGenerator(): GroupIdGenerator;
    get messageIdGenerator(): MessageIdGenerator | undefined;
    private currentUser?;
    private users;
    private conversations;
    private activeConversationId?;
    private messages;
    private currentMessage;
    /**
     * Constructor
     * @param messageIdGenerator
     * @param groupIdGenerator
     */
    constructor({ groupIdGenerator, messageIdGenerator }: BasicStorageParams);
    private getMessageWithId;
    /**
     * Check if user exists in users collection
     * @param userId
     */
    userExists(userId: UserId): boolean;
    /**
     * Sets current (logged in) user object
     * @param user
     */
    setCurrentUser(user: User): void;
    /**
     * Add user to collection of users.
     * User will be added only when item with its id not exists in the collection.
     * @param user
     */
    addUser(user: User): boolean;
    /**
     * Remove user from users collection.
     * If the participant existed and has been removed, it returns true, otherwise it returns false
     * @param userId
     */
    removeUser(userId: UserId): boolean;
    /**
     * Get user by id
     * @param userId
     * @return [User, number]|[undefined,undefined]
     */
    getUser(userId: UserId): [User, number] | [undefined, undefined];
    /**
     * Checks if conversation exists
     * @param conversationId
     */
    conversationExists(conversationId: ConversationId): boolean;
    /**
     * Get conversation
     * @param conversationId
     * @return [Conversation, number]|[undefined, undefined]
     */
    getConversation(conversationId: ConversationId): [Conversation<ConversationData>, number] | [undefined, undefined];
    /**
     * Add conversation to collection of conversations.
     * Conversation will be added only when item with its id not exists in the collection.
     * @param conversation
     */
    addConversation(conversation: Conversation<ConversationData>): boolean;
    /**
     * Set unread messages for conversation
     * @param conversationId
     * @param count
     */
    setUnread(conversationId: ConversationId, count: number): void;
    /**
     * Remove conversation from conversations collection.
     * If the conversation existed and has been removed, it returns true, otherwise it returns false
     * @param conversationId
     * @param removeMessages
     */
    removeConversation(conversationId: ConversationId, removeMessages?: boolean): boolean;
    /**
     * Replace the conversation in the collection with the new one specified in the parameter
     * @param conversation
     */
    updateConversation(conversation: Conversation<ConversationData>): void;
    private replaceConversation;
    private replaceUser;
    /**
     * Add participant to the conversation only if not already added and conversation exists.
     * Returns true if participant has been added, otherwise returns false.
     * @param conversationId
     * @param participant
     * @return boolean
     */
    addParticipant(conversationId: ConversationId, participant: Participant): boolean;
    /**
     * Remove participant from conversation.
     * If the participant existed and has been removed, it returns true, otherwise it returns false
     * @param conversationId
     * @param participantId
     */
    removeParticipant(conversationId: ConversationId, participantId: UserId): boolean;
    addMessage(message: ChatMessage<MessageContentType>, conversationId: ConversationId, generateId?: boolean): ChatMessage<MessageContentType>;
    /**
     * Update message
     * @param message
     */
    updateMessage(message: ChatMessage<MessageContentType>): void;
    /**
     * Set user presence
     * @param userId
     * @param presence
     */
    setPresence(userId: UserId, presence: Presence): void;
    /**
     * Set draft of message in current conversation
     * @param {String} draft
     */
    setDraft(draft: string): void;
    clearState(): void;
    getState(): ChatState;
    resetState(): void;
    /**
     * Set active conversation and reset unread counter of this conversation if second parameter is set.
     * Why active conversation is kept here in storage?
     * Because it's easy to persist whole storage and recreate from persistent state.
     * @param conversationId
     * @param resetUnreadCounter
     */
    setActiveConversation(conversationId?: ConversationId, resetUnreadCounter?: boolean): void;
    /**
     * Set current  message input value
     * @param message
     */
    setCurrentMessage(message: string): void;
}

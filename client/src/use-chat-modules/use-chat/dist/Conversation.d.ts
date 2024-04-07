import { Participant, TypingUser } from "./";
import { ConversationId, UserId } from "./Types";
import { TypingUsersList } from "./TypingUsersList";
export interface ConversationParams<ConversationData> {
    readonly id: ConversationId;
    readonly participants?: Array<Participant>;
    readonly unreadCounter?: number;
    readonly typingUsers?: TypingUsersList;
    readonly draft?: string;
    readonly description?: string;
    readonly readonly?: boolean;
    readonly data?: ConversationData;
}
export declare class Conversation<ConversationData = any> {
    readonly id: ConversationId;
    unreadCounter: number;
    participants: Array<Participant>;
    typingUsers: TypingUsersList;
    description: string;
    draft: string;
    readonly: boolean;
    data?: ConversationData;
    constructor({ id, participants, unreadCounter, typingUsers, draft, description, readonly, data, }: ConversationParams<ConversationData>);
    /**
     * Checks if participant exists
     * @param participantId
     * @returns boolean
     */
    participantExists(participantId: UserId): boolean;
    /**
     * Get participant and its index
     * @param participantId
     * @returns [Participant,number]|[undefined,undefined]
     */
    getParticipant(participantId: UserId): [Participant, number] | [undefined, undefined];
    /**
     * Add participant to the collection only if not already added.
     * Returns true if participant has been added, otherwise returns false.
     * Returns
     * @param participant
     * @returns boolean
     */
    addParticipant(participant: Participant): boolean;
    /**
     * Removes participant.
     * If the participant existed and has been removed, it returns true, otherwise it returns false
     * @param participantId
     * @returns boolean
     */
    removeParticipant(participantId: UserId): boolean;
    /**
     * Ads typing user to the typing users collection.
     * If user with this id already exists it will be replaced
     * @param typingUser
     */
    addTypingUser(typingUser: TypingUser): void;
    /**
     * Remove user with specified id from the collection of typing users
     * @param userId
     */
    removeTypingUser(userId: UserId): void;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const TypingUsersList_1 = require("./TypingUsersList");
class Conversation {
    constructor({ id, participants = [], unreadCounter = 0, typingUsers = new TypingUsersList_1.TypingUsersList({ items: [] }), draft = "", description = "", readonly = false, data, }) {
        this.unreadCounter = 0;
        this.description = "";
        this.draft = "";
        this.readonly = false;
        this.id = id;
        this.unreadCounter = unreadCounter;
        this.participants = participants;
        this.typingUsers = typingUsers;
        this.draft = draft;
        this.description = description;
        this.readonly = readonly;
        this.data = data;
    }
    /**
     * Checks if participant exists
     * @param participantId
     * @returns boolean
     */
    participantExists(participantId) {
        return this.participants.findIndex((p) => p.id === participantId) !== -1;
    }
    /**
     * Get participant and its index
     * @param participantId
     * @returns [Participant,number]|[undefined,undefined]
     */
    getParticipant(participantId) {
        const idx = this.participants.findIndex((p) => p.id === participantId);
        if (idx !== -1) {
            return [this.participants[idx], idx];
        }
        return [undefined, undefined];
    }
    /**
     * Add participant to the collection only if not already added.
     * Returns true if participant has been added, otherwise returns false.
     * Returns
     * @param participant
     * @returns boolean
     */
    addParticipant(participant) {
        if (!this.participantExists(participant.id)) {
            this.participants = this.participants.concat(Object.assign({}, participant));
            return true;
        }
        return false;
    }
    /**
     * Removes participant.
     * If the participant existed and has been removed, it returns true, otherwise it returns false
     * @param participantId
     * @returns boolean
     */
    removeParticipant(participantId) {
        const [, idx] = this.getParticipant(participantId);
        if (idx) {
            this.participants = this.participants
                .slice(0, idx)
                .concat(this.participants.slice(idx + 1));
            return true;
        }
        return false;
    }
    /**
     * Ads typing user to the typing users collection.
     * If user with this id already exists it will be replaced
     * @param typingUser
     */
    addTypingUser(typingUser) {
        this.typingUsers.addUser(typingUser);
    }
    /**
     * Remove user with specified id from the collection of typing users
     * @param userId
     */
    removeTypingUser(userId) {
        this.typingUsers.removeUser(userId);
    }
}
exports.Conversation = Conversation;
//# sourceMappingURL=Conversation.js.map
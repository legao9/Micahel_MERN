"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicStorage = void 0;
const MessageGroup_1 = require("./MessageGroup");
const _1 = require("./");
class BasicStorage {
    /**
     * Constructor
     * @param messageIdGenerator
     * @param groupIdGenerator
     */
    constructor({ groupIdGenerator, messageIdGenerator }) {
        // TODO: Users by Id
        this.users = [];
        // TODO: Conversations By Id (Dedicated conversations collection)
        this.conversations = [];
        this.messages = {};
        this.currentMessage = "";
        this._groupIdGenerator = groupIdGenerator;
        this._messageIdGenerator = messageIdGenerator;
    }
    get groupIdGenerator() {
        return this._groupIdGenerator;
    }
    get messageIdGenerator() {
        return this._messageIdGenerator;
    }
    getMessageWithId(message, generateId) {
        if (generateId) {
            if (!this.messageIdGenerator) {
                throw "Id generator is not defined";
            }
            else {
                return Object.assign(Object.assign({}, message), { id: this.messageIdGenerator(message) });
            }
        }
        else {
            return message;
        }
    }
    /**
     * Check if user exists in users collection
     * @param userId
     */
    userExists(userId) {
        return this.users.findIndex((u) => u.id === userId) !== -1;
    }
    /**
     * Sets current (logged in) user object
     * @param user
     */
    setCurrentUser(user) {
        this.currentUser = user;
    }
    /**
     * Add user to collection of users.
     * User will be added only when item with its id not exists in the collection.
     * @param user
     */
    addUser(user) {
        const notExists = !this.userExists(user.id);
        if (notExists) {
            this.users = this.users.concat(user);
        }
        return notExists;
    }
    /**
     * Remove user from users collection.
     * If the participant existed and has been removed, it returns true, otherwise it returns false
     * @param userId
     */
    removeUser(userId) {
        const idx = this.users.findIndex((u) => u.id === userId);
        if (idx !== -1) {
            this.users = this.users.slice(0, idx).concat(this.users.slice(idx + 1));
            return true;
        }
        return false;
    }
    /**
     * Get user by id
     * @param userId
     * @return [User, number]|[undefined,undefined]
     */
    getUser(userId) {
        const idx = this.users.findIndex((u) => u.id === userId);
        if (idx !== -1) {
            return [this.users[idx], idx];
        }
        return [undefined, undefined];
    }
    /**
     * Checks if conversation exists
     * @param conversationId
     */
    conversationExists(conversationId) {
        return this.conversations.findIndex((c) => c.id === conversationId) !== -1;
    }
    /**
     * Get conversation
     * @param conversationId
     * @return [Conversation, number]|[undefined, undefined]
     */
    getConversation(conversationId) {
        const idx = this.conversations.findIndex((c) => c.id === conversationId);
        if (idx !== -1) {
            return [this.conversations[idx], idx];
        }
        return [undefined, undefined];
    }
    /**
     * Add conversation to collection of conversations.
     * Conversation will be added only when item with its id not exists in the collection.
     * @param conversation
     */
    addConversation(conversation) {
        const notExists = !this.conversationExists(conversation.id);
        if (notExists) {
            this.conversations = this.conversations.concat(conversation);
        }
        return notExists;
    }
    /**
     * Set unread messages for conversation
     * @param conversationId
     * @param count
     */
    setUnread(conversationId, count) {
        const [conversation] = this.getConversation(conversationId);
        if (conversation) {
            conversation.unreadCounter = count;
        }
    }
    /**
     * Remove conversation from conversations collection.
     * If the conversation existed and has been removed, it returns true, otherwise it returns false
     * @param conversationId
     * @param removeMessages
     */
    removeConversation(conversationId, removeMessages = true) {
        const idx = this.conversations.findIndex((c) => c.id === conversationId);
        if (idx !== -1) {
            this.conversations = this.conversations
                .slice(0, idx)
                .concat(this.conversations.slice(idx + 1));
            if (removeMessages) {
                delete this.messages[conversationId];
            }
            return true;
        }
        return false;
    }
    /**
     * Replace the conversation in the collection with the new one specified in the parameter
     * @param conversation
     */
    updateConversation(conversation) {
        const [con, idx] = this.getConversation(conversation.id);
        if (con) {
            this.replaceConversation(conversation, idx);
        }
    }
    replaceConversation(conversation, idx) {
        this.conversations = this.conversations
            .slice(0, idx)
            .concat(new _1.Conversation({
            id: conversation.id,
            participants: conversation.participants,
            typingUsers: conversation.typingUsers,
            unreadCounter: conversation.unreadCounter,
            draft: conversation.draft,
            description: conversation.description,
            readonly: conversation.readonly,
            data: conversation.data,
        }))
            .concat(this.conversations.slice(idx + 1));
    }
    replaceUser(user, idx) {
        this.users = this.users
            .slice(0, idx)
            .concat(user)
            .concat(this.users.slice(idx + 1));
    }
    /**
     * Add participant to the conversation only if not already added and conversation exists.
     * Returns true if participant has been added, otherwise returns false.
     * @param conversationId
     * @param participant
     * @return boolean
     */
    addParticipant(conversationId, participant) {
        const [conversation, idx] = this.getConversation(conversationId);
        if (conversation) {
            if (conversation.addParticipant(participant)) {
                this.replaceConversation(conversation, idx);
            }
        }
        return false;
    }
    /**
     * Remove participant from conversation.
     * If the participant existed and has been removed, it returns true, otherwise it returns false
     * @param conversationId
     * @param participantId
     */
    removeParticipant(conversationId, participantId) {
        const [conversation, idx] = this.getConversation(conversationId);
        if (conversation) {
            conversation.removeParticipant(participantId);
            this.replaceConversation(conversation, idx);
            return true;
        }
        return false;
    }
    addMessage(message, conversationId, generateId = false) {
        if (conversationId in this.messages) {
            const groups = this.messages[conversationId];
            const lastGroup = groups[groups.length - 1];
            if (lastGroup.senderId === message.senderId) {
                // Add message to group
                const newMessage = this.getMessageWithId(message, generateId);
                lastGroup.addMessage(newMessage);
                return newMessage;
            }
        }
        const group = new MessageGroup_1.MessageGroup({
            id: this.groupIdGenerator(),
            senderId: message.senderId,
            direction: message.direction,
        });
        const newMessage = this.getMessageWithId(message, generateId);
        group.addMessage(newMessage);
        this.messages[conversationId] =
            conversationId in this.messages
                ? this.messages[conversationId].concat(group)
                : [group];
        return newMessage;
    }
    // TODO: Refactoring - it's not very optimal :)
    /**
     * Update message
     * @param message
     */
    updateMessage(message) {
        for (const conversationId in this.messages) {
            const groups = this.messages[conversationId];
            const l = groups.length;
            for (let i = 0; i < l; i++) {
                const group = groups[i];
                const [currentMessage, idx] = group.getMessage(message.id);
                if (currentMessage) {
                    group.replaceMessage(message, idx);
                }
            }
        }
    }
    /**
     * Set user presence
     * @param userId
     * @param presence
     */
    setPresence(userId, presence) {
        const [user, idx] = this.getUser(userId);
        if (user) {
            user.presence = presence;
            this.replaceUser(user, idx);
        }
    }
    /**
     * Set draft of message in current conversation
     * @param {String} draft
     */
    setDraft(draft) {
        if (this.activeConversationId) {
            const [activeConversation, idx] = this.getConversation(this.activeConversationId);
            if (activeConversation) {
                activeConversation.draft = draft;
                this.replaceConversation(activeConversation, idx);
            }
        }
    }
    clearState() { }
    getState() {
        return {
            currentUser: this.currentUser,
            users: this.users,
            conversations: this.conversations,
            // TODO: Implement sth like collection referencing by id (map with guaranteed order like in immutablejs) because searching every time in the array does not make sense
            activeConversation: this.activeConversationId
                ? this.conversations.find((c) => c.id === this.activeConversationId)
                : undefined,
            currentMessages: this.activeConversationId && this.activeConversationId in this.messages
                ? this.messages[this.activeConversationId]
                : [],
            messages: this.messages,
            currentMessage: this.currentMessage,
        };
    }
    resetState() {
        this.currentUser = undefined;
        this.users = [];
        this.conversations = [];
        this.activeConversationId = undefined;
        this.messages = {};
    }
    /**
     * Set active conversation and reset unread counter of this conversation if second parameter is set.
     * Why active conversation is kept here in storage?
     * Because it's easy to persist whole storage and recreate from persistent state.
     * @param conversationId
     * @param resetUnreadCounter
     */
    setActiveConversation(conversationId, resetUnreadCounter = true) {
        this.activeConversationId = conversationId;
        if (resetUnreadCounter && conversationId) {
            const [conversation, idx] = this.getConversation(conversationId);
            if (conversation) {
                conversation.unreadCounter = 0;
                this.replaceConversation(conversation, idx);
            }
        }
    }
    /**
     * Set current  message input value
     * @param message
     */
    setCurrentMessage(message) {
        this.currentMessage = message;
    }
}
exports.BasicStorage = BasicStorage;
//# sourceMappingURL=BasicStorage.js.map
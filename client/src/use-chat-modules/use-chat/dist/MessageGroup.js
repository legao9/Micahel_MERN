"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageGroup = void 0;
class MessageGroup {
    constructor({ id, senderId, direction }) {
        this.messages = [];
        this.id = id;
        this.senderId = senderId;
        this.direction = direction;
    }
    addMessage(message) {
        this.messages.push(message);
    }
    getMessage(id) {
        const idx = this.messages.findIndex((message) => message.id === id);
        if (idx !== -1) {
            return [this.messages[idx], idx];
        }
        else {
            return [undefined, undefined];
        }
    }
    /**
     * Replace message in message collection
     * @param message
     */
    updateMessage(message) {
        const [foundMessage, idx] = this.getMessage(message.id);
        if (foundMessage) {
            this.messages = this.messages
                .concat(this.messages.slice(0, idx))
                .concat(message)
                .concat(this.messages.slice(idx + 1));
        }
    }
    /**
     * Replace message at specified index
     * Return true if message exists in specified position.
     * Returns true if index is out of bound
     * @param message
     * @param index
     */
    replaceMessage(message, index) {
        if (this.messages.length > index) {
            return false;
        }
        this.messages = this.messages
            .concat(this.messages.slice(0, index))
            .concat(message)
            .concat(this.messages.slice(index + 1));
        return true;
    }
}
exports.MessageGroup = MessageGroup;
//# sourceMappingURL=MessageGroup.js.map
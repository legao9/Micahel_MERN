"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingUsersList = void 0;
/**
 * List of typing users
 */
class TypingUsersList {
    constructor({ items }) {
        this.items = items;
    }
    get length() {
        return this.items.length;
    }
    findIndex(userId) {
        return this.items.findIndex((u) => u.userId === userId);
    }
    /**
     * Ads typing user to collection.
     * If user with this id already exists it will be replaced
     * @param typingUser
     */
    addUser(typingUser) {
        const idx = this.findIndex(typingUser.userId);
        if (idx !== -1) {
            this.items = this.items
                .slice(0, idx)
                .concat(typingUser)
                .concat(this.items.slice(idx + 1));
        }
        else {
            this.items = this.items.concat(typingUser);
        }
    }
    /**
     * Remove user with specified id from collection
     * @param userId
     */
    removeUser(userId) {
        const idx = this.findIndex(userId);
        if (idx !== -1) {
            this.items = this.items.slice(0, idx).concat(this.items.slice(idx + 1));
        }
    }
}
exports.TypingUsersList = TypingUsersList;
//# sourceMappingURL=TypingUsersList.js.map
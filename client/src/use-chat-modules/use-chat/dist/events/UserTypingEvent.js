"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypingEvent = void 0;
const enums_1 = require("../enums");
class UserTypingEvent {
    constructor({ userId, conversationId, content, isTyping, }) {
        this.type = enums_1.ChatEventType.UserTyping;
        this.userId = userId;
        this.conversationId = conversationId;
        this.content = content;
        this.isTyping = isTyping;
    }
}
exports.UserTypingEvent = UserTypingEvent;
//# sourceMappingURL=UserTypingEvent.js.map
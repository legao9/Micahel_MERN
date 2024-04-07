"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
class ChatMessage {
    constructor({ id, status, contentType, senderId, direction, content, cratedDate = new Date(), updatedDate, }) {
        this.id = id;
        this.status = status;
        this.contentType = contentType;
        this.senderId = senderId;
        this.direction = direction;
        this.content = content;
        this.createdDate = cratedDate;
        this.updatedDate = updatedDate;
    }
}
exports.ChatMessage = ChatMessage;
//# sourceMappingURL=ChatMessage.js.map
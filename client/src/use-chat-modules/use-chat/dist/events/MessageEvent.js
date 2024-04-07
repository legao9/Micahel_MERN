"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEvent = void 0;
const enums_1 = require("../enums");
class MessageEvent {
    constructor({ message, conversationId, }) {
        this.type = enums_1.ChatEventType.Message;
        this.message = message;
        this.conversationId = conversationId;
    }
}
exports.MessageEvent = MessageEvent;
//# sourceMappingURL=MessageEvent.js.map
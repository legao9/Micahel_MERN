"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDisconnectedEvent = void 0;
const enums_1 = require("../enums");
class UserDisconnectedEvent {
    constructor(userId) {
        this.type = enums_1.ChatEventType.UserDisconnected;
        this.userId = userId;
    }
}
exports.UserDisconnectedEvent = UserDisconnectedEvent;
//# sourceMappingURL=UserDisconnectedEvent.js.map
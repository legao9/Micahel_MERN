"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConnectedEvent = void 0;
const enums_1 = require("../enums");
class UserConnectedEvent {
    constructor(userId) {
        this.type = enums_1.ChatEventType.UserConnected;
        this.userId = userId;
    }
}
exports.UserConnectedEvent = UserConnectedEvent;
//# sourceMappingURL=UserConnectedEvent.js.map
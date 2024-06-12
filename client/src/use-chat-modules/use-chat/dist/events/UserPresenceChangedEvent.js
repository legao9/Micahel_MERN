"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPresenceChangedEvent = void 0;
const enums_1 = require("../enums");
class UserPresenceChangedEvent {
    constructor({ userId, presence }) {
        this.type = enums_1.ChatEventType.UserPresenceChanged;
        this.userId = userId;
        this.presence = presence;
    }
}
exports.UserPresenceChangedEvent = UserPresenceChangedEvent;
//# sourceMappingURL=UserPresenceChangedEvent.js.map
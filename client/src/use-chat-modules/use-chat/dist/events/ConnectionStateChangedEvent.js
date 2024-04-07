"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionStateChangedEvent = void 0;
const enums_1 = require("../enums");
class ConnectionStateChangedEvent {
    constructor() {
        this.type = enums_1.ChatEventType.ConnectionStateChanged;
    }
}
exports.ConnectionStateChangedEvent = ConnectionStateChangedEvent;
//# sourceMappingURL=ConnectionStateChangedEvent.js.map
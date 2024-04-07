"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presence = void 0;
const UserStatus_1 = require("./enums/UserStatus");
class Presence {
    constructor({ status = UserStatus_1.UserStatus.Unknown, description = "", }) {
        this.status = UserStatus_1.UserStatus.Unknown;
        this.description = "";
        this.status = status;
        this.description = description;
    }
}
exports.Presence = Presence;
//# sourceMappingURL=Presence.js.map
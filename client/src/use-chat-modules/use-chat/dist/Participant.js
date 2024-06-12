"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participant = void 0;
const _1 = require("./");
class Participant {
    constructor({ id, role = new _1.ConversationRole([]) }) {
        this.id = id;
        this.role = role;
    }
}
exports.Participant = Participant;
//# sourceMappingURL=Participant.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Presence_1 = require("./Presence");
class User {
    constructor({ id, presence = new Presence_1.Presence({}), firstName = "", lastName = "", username = "", email = "", avatar = "", bio = "", data, }) {
        this.presence = new Presence_1.Presence({});
        this.id = id;
        this.presence = presence;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.bio = bio;
        this.data = data;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map
import { ChatEventType } from "../enums";
import { ChatEvent } from "./ChatEvent";
export declare class UserDisconnectedEvent implements ChatEvent<ChatEventType.UserDisconnected> {
    readonly type = ChatEventType.UserDisconnected;
    readonly userId: string;
    constructor(userId: string);
}

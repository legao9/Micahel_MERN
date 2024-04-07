import { UserId } from "./Types";
import { ConversationRole } from "./";
export declare type ParticipantParams = {
    id: UserId;
    role?: ConversationRole;
};
export declare class Participant {
    readonly id: UserId;
    role: ConversationRole;
    constructor({ id, role }: ParticipantParams);
}

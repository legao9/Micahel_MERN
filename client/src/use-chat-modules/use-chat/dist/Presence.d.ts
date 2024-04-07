import { UserStatus } from "./enums/UserStatus";
export declare type PresenceParams = {
    status?: UserStatus;
    description?: string;
};
export declare class Presence {
    status: UserStatus;
    description: string;
    constructor({ status, description, }: PresenceParams);
}

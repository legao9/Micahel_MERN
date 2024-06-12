import { UserId } from "./Types";
import { Presence } from "./Presence";
export declare type UserParams<UserData = any> = {
    readonly id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    presence?: Presence;
    data?: UserData;
};
export declare class User<UserData = any> {
    readonly id: UserId;
    presence: Presence;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    data?: UserData;
    constructor({ id, presence, firstName, lastName, username, email, avatar, bio, data, }: UserParams);
}

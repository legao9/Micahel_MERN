import { TypingUser } from "./TypingUser";
import { UserId } from "./Types";
interface TypingUsersListParams {
    items: Array<TypingUser>;
}
/**
 * List of typing users
 */
export declare class TypingUsersList {
    items: Array<TypingUser>;
    constructor({ items }: TypingUsersListParams);
    get length(): number;
    findIndex(userId: UserId): number;
    /**
     * Ads typing user to collection.
     * If user with this id already exists it will be replaced
     * @param typingUser
     */
    addUser(typingUser: TypingUser): void;
    /**
     * Remove user with specified id from collection
     * @param userId
     */
    removeUser(userId: UserId): void;
}
export {};

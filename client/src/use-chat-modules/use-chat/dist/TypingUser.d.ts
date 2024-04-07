import { UserId } from "./Types";
export interface TypingUserParams {
    readonly userId: UserId;
    readonly content: string;
    readonly isTyping: boolean;
}
export declare class TypingUser {
    readonly userId: UserId;
    readonly content: string;
    readonly isTyping: boolean;
    constructor({ userId, content, isTyping }: TypingUserParams);
}

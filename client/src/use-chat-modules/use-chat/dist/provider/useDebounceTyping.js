"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounceTyping = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const react_1 = require("react");
const useDebounceTyping = (duration, updateState, storage) => {
    const debouncers = (0, react_1.useRef)(new Map());
    const createDebouncer = (0, react_1.useCallback)(() => {
        const subject = new rxjs_1.Subject();
        subject
            .pipe((0, operators_1.debounceTime)(duration))
            .subscribe(({ conversationId, userId }) => {
            // Stop subject
            subject.complete();
            // Remove debouncer from collection
            const deb = debouncers.current;
            const conversationItem = deb.get(conversationId);
            if (conversationItem) {
                conversationItem.delete(userId);
                // Cleanup. Remove conversation if it doesn't contain any users
                if (conversationItem.size === 0) {
                    deb.delete(conversationId);
                }
            }
            // Remove typing user from conversation
            const [conversation] = storage.getConversation(conversationId);
            if (conversation) {
                conversation.removeTypingUser(userId);
                updateState();
            }
        });
        return subject;
    }, [debouncers, duration, updateState, storage]);
    return (conversationId, userId) => {
        const deb = debouncers.current;
        const conversationItem = deb.get(conversationId);
        if (conversationItem) {
            // Conversation exists - searching for user
            const userItem = conversationItem.get(userId);
            if (userItem) {
                // User found - debounce
                userItem.next({ conversationId, userId });
            }
            else {
                // User not found - create a debouncer
                const subject = createDebouncer();
                conversationItem.set(userId, subject);
            }
        }
        else {
            // Conversation not found - create new and a deboucer
            const subject = createDebouncer();
            const newEntry = new Map();
            newEntry.set(userId, subject);
            deb.set(conversationId, newEntry);
            subject.next({ conversationId, userId });
        }
    };
};
exports.useDebounceTyping = useDebounceTyping;
//# sourceMappingURL=useDebounceTyping.js.map
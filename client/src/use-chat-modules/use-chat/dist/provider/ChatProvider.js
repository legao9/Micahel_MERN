"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatProvider = exports.useChat = void 0;
const react_1 = __importStar(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const enums_1 = require("../enums");
const TypingUser_1 = require("../TypingUser");
const useThrottledSendTyping_1 = require("./useThrottledSendTyping");
const useDebounceTyping_1 = require("./useDebounceTyping");
/*const ChatContext = createContext<Partial<ChatContextProps>>({
  conversations: [],
  messages: {},
  users: [],
  currentMessages:[],
  setCurrentUser: user => {},
  addUser: user => false,
  removeUser: userId => false,
  getUser: userId => undefined,
  setActiveConversation: conversationId => {},
  sendMessage: params => {},
  addMessage: (message, conversationId, generateId) => {},
  updateMessage: message => {},
  setDraft: message => {},
  sendTyping: params => {},
  addConversation: conversation => {},
  getConversation: conversationId => undefined,
  resetState: () => {},
});*/
// It can be used to create context in userSpace
const createChatContext = () => (0, react_1.createContext)(undefined);
const ChatContext = (0, react_1.createContext)(undefined);
ChatContext.displayName = "ChatContext";
const useChat = () => {
    const context = (0, react_1.useContext)(ChatContext);
    if (!context) {
        throw new Error("useChat must be within ChatProvider");
    }
    return context;
};
exports.useChat = useChat;
/**
 *
 * @param {IStorage} storage
 * @param {IChatService} service
 * @param setter
 * @param config
 */
const useStorage = (storage, service, setter, { debounceTyping = true, typingDebounceTime = 900, }) => {
    const updateState = (0, react_1.useCallback)(() => {
        setter(storage.getState());
    }, [setter, storage]);
    const debouncedTyping = (0, useDebounceTyping_1.useDebounceTyping)(typingDebounceTime, updateState, storage);
    // Register event handlers
    (0, react_1.useEffect)(() => {
        const onMessage = ({ message, conversationId }) => {
            storage.addMessage(message, conversationId, false);
            const [conversation] = storage.getConversation(conversationId);
            // Increment unread counter
            const { activeConversation } = storage.getState();
            if (conversation &&
                (!activeConversation || activeConversation.id !== conversationId)) {
                storage.setUnread(conversationId, conversation.unreadCounter + 1);
            }
            // Reset typing
            if (conversation) {
                conversation.removeTypingUser(message.senderId);
            }
            updateState();
        };
        const onConnectionStateChanged = () => { };
        const onUserConnected = () => { };
        const onUserDisconnected = () => { };
        const onUserPresenceChanged = ({ userId, presence, }) => {
            storage.setPresence(userId, presence);
        };
        const onUserTyping = ({ conversationId, userId, content, isTyping, }) => {
            const [conversation] = storage.getConversation(conversationId);
            if (conversation) {
                conversation.addTypingUser(new TypingUser_1.TypingUser({
                    userId,
                    content,
                    isTyping,
                }));
                if (debounceTyping) {
                    debouncedTyping(conversationId, userId);
                }
                updateState();
            }
        };
        service.on(enums_1.ChatEventType.Message, onMessage);
        service.on(enums_1.ChatEventType.ConnectionStateChanged, onConnectionStateChanged);
        service.on(enums_1.ChatEventType.UserConnected, onUserConnected);
        service.on(enums_1.ChatEventType.UserDisconnected, onUserDisconnected);
        service.on(enums_1.ChatEventType.UserPresenceChanged, onUserPresenceChanged);
        service.on(enums_1.ChatEventType.UserTyping, onUserTyping);
        return () => {
            service.off(enums_1.ChatEventType.Message, onMessage);
            service.off(enums_1.ChatEventType.ConnectionStateChanged, onConnectionStateChanged);
            service.off(enums_1.ChatEventType.UserConnected, onUserConnected);
            service.off(enums_1.ChatEventType.UserDisconnected, onUserDisconnected);
            service.off(enums_1.ChatEventType.UserPresenceChanged, onUserPresenceChanged);
            service.off(enums_1.ChatEventType.UserTyping, onUserTyping);
        };
    }, [storage, service, updateState, debounceTyping, debouncedTyping]);
};
const useChatSelector = ({ conversations, activeConversation, messages, currentMessages, currentMessage, }) => {
    return {
        conversations,
        currentMessages,
        messages,
        activeConversation,
        currentMessage,
    };
};
/**
 * Provides methods to operate on chat and properties and collections of chat
 * @param children
 * @param {IChatService} service
 * @param {IStorage} storage
 * @constructor
 */
const ChatProvider = ({ serviceFactory, storage, config: { typingThrottleTime = 250, debounceTyping = true, typingDebounceTime = 900, autoDraft = enums_1.AutoDraft.Save | enums_1.AutoDraft.Restore, }, children, }) => {
    const [state, setState] = (0, react_1.useState)(storage.getState());
    const updateState = (0, react_1.useCallback)(() => {
        const newState = storage.getState();
        setState(newState);
    }, [setState, storage]);
    const serviceRef = (0, react_1.useRef)(serviceFactory(storage, updateState));
    useStorage(storage, serviceRef.current, setState, {
        debounceTyping,
        typingDebounceTime,
    });
    const throttledSendTyping = (0, useThrottledSendTyping_1.useThrottledSendTyping)(serviceRef.current, typingThrottleTime);
    const setCurrentUser = (0, react_1.useCallback)((user) => {
        storage.setCurrentUser(user);
        updateState();
    }, [storage, updateState]);
    const addUser = (0, react_1.useCallback)((user) => {
        const result = storage.addUser(user);
        updateState();
        return result;
    }, [storage, updateState]);
    const removeUser = (0, react_1.useCallback)((userId) => {
        const result = storage.removeUser(userId);
        updateState();
        return result;
    }, [storage, updateState]);
    /**
     * Get user by id
     * @param userId
     */
    const getUser = (0, react_1.useCallback)((userId) => storage.getUser(userId)[0], [storage]);
    /**
     * Set active conversation
     * @param {String} conversationId Conversation id
     */
    const setActiveConversation = (0, react_1.useCallback)((conversationId, draftOpt = autoDraft) => {
        var _a;
        const { currentMessage } = storage.getState();
        // Save draft for the current conversation
        if (draftOpt & enums_1.AutoDraft.Save) {
            storage.setDraft(currentMessage);
        }
        storage.setActiveConversation(conversationId);
        // Set current message input value to the draft from current conversation
        // And reset draft
        if (conversationId) {
            const [activeConversation] = storage.getConversation(conversationId);
            if (activeConversation) {
                // Restore draft from new conversation to message input
                if (draftOpt & enums_1.AutoDraft.Restore) {
                    storage.setCurrentMessage((_a = activeConversation.draft) !== null && _a !== void 0 ? _a : "");
                    activeConversation.draft = "";
                }
            }
        }
        updateState();
    }, [storage, updateState]);
    const getConversation = (0, react_1.useCallback)((conversationId) => storage.getConversation(conversationId)[0], [storage]);
    /**
     * Sends message to active conversation
     */
    const sendMessage = (0, react_1.useCallback)(({ message, conversationId, senderId, generateId = storage.messageIdGenerator ? true : false, clearMessageInput = true, }) => {
        const storedMessage = storage.addMessage(message, conversationId, generateId);
        if (clearMessageInput) {
            storage.setCurrentMessage("");
        }
        updateState();
        serviceRef.current.sendMessage({
            message: storedMessage,
            conversationId,
        });
    }, [storage, updateState, serviceRef]);
    /**
     * Adds a message without sending it
     * @param message
     * @param conversationId
     * @param generateId
     */
    const addMessage = (0, react_1.useCallback)((message, conversationId, generateId) => {
        storage.addMessage(message, conversationId, generateId);
        updateState();
    }, [storage, updateState]);
    /**
     * Update message
     * @param message
     * @param index
     */
    const updateMessage = (0, react_1.useCallback)((message) => {
        storage.updateMessage(message);
        updateState();
    }, [storage, updateState]);
    /**
     * Set draft of message in current conversation
     * @param {String} draft
     */
    const setDraft = (0, react_1.useCallback)((draft) => {
        storage.setDraft(draft);
        updateState();
    }, [storage, updateState]);
    /**
     * Add conversation to collection
     * @param c
     */
    const addConversation = (0, react_1.useCallback)((c) => {
        storage.addConversation(c);
        updateState();
    }, [storage, updateState]);
    /**
     * Remove conversation from collection
     * @param conversationId
     */
    const removeConversation = (0, react_1.useCallback)((conversationId, removeMessages = true) => {
        const result = storage.removeConversation(conversationId, removeMessages);
        updateState();
        return result;
    }, [storage, updateState]);
    const resetState = (0, react_1.useCallback)(() => {
        storage.resetState();
        updateState();
    }, [storage, updateState]);
    /**
     * Sends typing to active conversation
     * @param {Object} options Options object
     */
    const sendTyping = (0, react_1.useCallback)(({ content = "", isTyping = true, throttle = true }) => {
        const { activeConversation, currentUser } = storage.getState();
        if (activeConversation && currentUser) {
            const params = {
                content,
                isTyping,
                userId: currentUser.id,
                conversationId: activeConversation.id,
            };
            if (throttle) {
                throttledSendTyping(params);
            }
            else {
                serviceRef.current.sendTyping(params);
            }
        }
    }, [storage, throttledSendTyping, serviceRef]);
    /**
     * Set current  message input value
     * @param message
     */
    const setCurrentMessage = (0, react_1.useCallback)((message) => {
        storage.setCurrentMessage(message);
        updateState();
    }, [storage, updateState]);
    return (react_1.default.createElement(ChatContext.Provider, { value: Object.assign(Object.assign({}, state), { currentMessages: state.activeConversation &&
                state.activeConversation.id in state.messages
                ? state.messages[state.activeConversation.id]
                : [], setCurrentUser,
            addUser,
            removeUser,
            getUser,
            setActiveConversation,
            sendMessage,
            addMessage,
            updateMessage,
            setDraft,
            sendTyping,
            addConversation,
            removeConversation,
            getConversation,
            setCurrentMessage,
            resetState,
            updateState, service: serviceRef.current }) }, children));
};
exports.ChatProvider = ChatProvider;
exports.ChatProvider.defaultProps = {
    config: {
        typingThrottleTime: 250,
        debounceTyping: true,
        typingDebounceTime: 900,
    },
};
exports.ChatProvider.propTypes = {
    children: prop_types_1.default.node,
    service: prop_types_1.default.object,
    storage: prop_types_1.default.object,
    config: prop_types_1.default.object,
};
//# sourceMappingURL=ChatProvider.js.map
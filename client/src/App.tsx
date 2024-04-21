import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import config from "./config/config";
import {
    BasicStorage,
    ChatMessage,
    ChatProvider,
    Conversation,
    ConversationId,
    ConversationRole,
    IStorage,
    MessageContentType,
    Participant,
    Presence,
    TypingUsersList,
    UpdateState,
    User,
    UserStatus,
} from "@chatscope/use-chat";
import { ExampleChatService } from "@chatscope/use-chat/dist/examples";
import { Chat } from "./components/Chat";
import { Auth } from "./components/Auth";
import { nanoid } from "nanoid";
import { Col, Container, Row } from "react-bootstrap";
import { akaneModel, eliotModel, emilyModel, joeModel, users } from "./data/data";
import { AutoDraft } from "@chatscope/use-chat/dist/enums/AutoDraft";
import Cookies from "universal-cookie";
import { useEffect } from "react";
import axios from "axios";

const messageIdGenerator = (message: ChatMessage<MessageContentType>) => nanoid();
const groupIdGenerator = () => nanoid();
const cookies = new Cookies();

const akaneStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
// const eliotStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
// const emilyStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });
// const joeStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });

// Create serviceFactory
const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ExampleChatService(storage, updateState);
};

// const akane = new User({
//     id: akaneModel.name,
//     presence: new Presence({status: UserStatus.Available, description: ""}),
//     firstName: "",
//     lastName: "",
//     username: akaneModel.name,
//     email: "",
//     avatar: akaneModel.avatar,
//     bio: ""
// });
const testUserModel = new User({
    id: '1',
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    firstName: "",
    lastName: "",
    username: cookies.get('username'),
    email: "admin@test.com",
    avatar: 'https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg',
    bio: ""
});


// const chats = [
//     { name: "Akane", storage: akaneStorage },
// ];

// function createConversation(id: ConversationId, name: string): Conversation {
//     return new Conversation({
//         id,
//         participants: [
//             new Participant({
//                 id: name,
//                 role: new ConversationRole([])
//             })
//         ],
//         unreadCounter: 0,
//         typingUsers: new TypingUsersList({ items: [] }),
//         draft: ""
//     });
// }

// Add users and conversations to the states
// chats.forEach(c => {

//     users.forEach(u => {
//         if (u.name !== c.name) {
//             c.storage.addUser(new User({
//                 id: u.name,
//                 presence: new Presence({ status: UserStatus.Available, description: "" }),
//                 firstName: "",
//                 lastName: "",
//                 username: u.name,
//                 email: "",
//                 avatar: u.avatar,
//                 bio: ""
//             }));

//             const conversationId = nanoid();

//             const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
//             if (!myConversation) {

//                 c.storage.addConversation(createConversation(conversationId, u.name));

//                 const chat = chats.find(chat => chat.name === u.name);

//                 if (chat) {

//                     const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
//                     if (!hisConversation) {
//                         chat.storage.addConversation(createConversation(conversationId, c.name));
//                     }

//                 }

//             }

//         }
//     });

// });


const authToken = cookies.get("id");


function App() {

    if (!authToken) return <Auth />;


    return (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: "translateX(0%)",
            opacity: "1",
          }}
        >


            <ChatProvider serviceFactory={serviceFactory} storage={akaneStorage} config={{
                typingThrottleTime: 250,
                typingDebounceTime: 900,
                debounceTyping: true,
                autoDraft: AutoDraft.Save | AutoDraft.Restore
            }}>
                <Chat user={testUserModel} />
            </ChatProvider>


        </div>
    );

}

export default App;

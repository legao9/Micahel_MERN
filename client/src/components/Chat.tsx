import { useMemo, useCallback, useEffect, useState } from "react";
import config from "../config/config";
import { MainContainer, Sidebar, ConversationList, Conversation, Avatar, ChatContainer, ConversationHeader, MessageGroup, Message, MessageList, MessageInput, TypingIndicator, Button, Search } from "@chatscope/chat-ui-kit-react";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from 'universal-cookie'
import {
  useChat,
  ChatMessage,
  MessageContentType,
  MessageDirection,
  MessageStatus
} from "@chatscope/use-chat";
import axios from "axios";
import { MessageContent, TextContent, User } from "@chatscope/use-chat";
import Spinner from "./spinner";
// import { on } from "events";
// import { io, Socket } from "socket.io-client";

export const Chat = ({ user }: { user: User }) => {

  interface tmpMsg {
    keyId:number;
    idxUserId: number;
    sender: string;
    receiver: string;
    recvTm: string;
    sms: string;
    portNum: number;
    hasGet: number;
  }
  interface tmpMsgCollection {
    [sender: string]: tmpMsg[];
  }
  const cookies = new Cookies();
  const id = cookies.get('id');
  const [showSpinner, setShowSpinner] = useState(false);
  const [arrBySender, setArrBySender] = useState<tmpMsgCollection>({});
  const [nowMessages, setNowMessages] = useState<tmpMsg[]>([]);
  const {
    currentMessages, conversations, activeConversation, setActiveConversation, sendMessage, getUser, currentMessage, setCurrentMessage,
    sendTyping, setCurrentUser
  } = useChat();



  const rearrangeBySender = (arr: tmpMsg[]): tmpMsgCollection => {
    let result: tmpMsgCollection = {};
    arr.forEach((item: tmpMsg) => {
      if (!result[item.sender]) {
        result[item.sender] = [];
      }
      result[item.sender].push(item);
    });
    for (let key in result) {
      result[key].reverse();
    }
    return result;
  };
  // const tmp = rearrangeBySender(testStorage);
  // const getSelectedUserMessages = async (sender: string) => {
  //     try {
  //         const response = await axios.post( config.serverUrl + '/chat/getSelectedUserMessages', { id: cookies.get('id'), sender: sender });
  //         console.log('Response :', response.data.messages);
  //         return response.data.message;
  //     } catch (error) {
  //         console.error('Error fetching test messages:', error);
  //         return null; 
  //     }
  // };

  const getUsersAndLastMessages = async () => {
    try {
      const response = await axios.post(config.serverUrl + '/chat/getUsersAndLastMessages', { id: cookies.get('id') });
      const res = response.data.messages;
      return res;
    } catch (error) {
      console.error('Error fetching test messages:', error);
      return null;
    }
  };

  const showSpinnerLimitSeconds = (seconds: number) => {
    setShowSpinner(true);
    setTimeout(() => {
      setShowSpinner(false);
    }, seconds * 1000);
  };

  const initialUsersAndLastMessages = async () => {
    showSpinnerLimitSeconds(7);
    try {
      let data = await getUsersAndLastMessages();
      setShowSpinner(false);
      // console.log(data);
      const tmp = await rearrangeBySender(data);
      // console.log(tmp);
      setArrBySender(tmp);
      localStorage.setItem('arrBySender', JSON.stringify(tmp));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const [currentUserAvatar, currentUserName] = useMemo(() => {

  //   if (activeConversation) {
  //     const participant = activeConversation.participants.length > 0 ? activeConversation.participants[0] : undefined;

  //     if (participant) {
  //       const user = getUser(participant.id);
  //       if (user) {
  //         return [<Avatar src={user.avatar} />, user.username]
  //       }
  //     }
  //   }

  //   return [undefined, undefined];

  // }, [activeConversation, getUser]);

  const handleChange = (value: string) => {
    setCurrentMessage(value);
    if (activeConversation) {
      sendTyping({
        conversationId: activeConversation?.id,
        isTyping: true,
        userId: user.id,
        content: value, // Note! Most often you don't want to send what the user types, as this can violate his privacy!
        throttle: true
      });
    }

  }

  const onSelectLeft = (value: any) => {
    console.log(value.length);
    setNowMessages(value);
  }
  const sendMsg = async (text: string) => {
    let lastRow: tmpMsg | null = (nowMessages.length > 0) ? nowMessages[nowMessages.length - 1] : null;
    if (lastRow)
      lastRow.sms = text;
    // console.log('lastRow:', lastRow);
    const response = await axios.post(config.serverUrl + '/chat/sendMsg', { id, lastRow });
    console.log('send message response:', response.data.result);
  };

  const updateArrBySender = (text: string) => {
    let lastRow: tmpMsg | null = (nowMessages.length > 0) ? nowMessages[nowMessages.length - 1] : null;
    let newRow: tmpMsg | null = null;
    const now = new Date();

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const currentTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    if (lastRow) {
      newRow = {keyId:1, idxUserId: id, sender: lastRow.sender, receiver: lastRow.receiver, recvTm: currentTimeString, portNum: lastRow.portNum, sms: text, hasGet: -1 };
    }
    console.log('newRow:', newRow);
    let tmpNowMessages = nowMessages;
    if (newRow) {
      tmpNowMessages = [...nowMessages, newRow];
      setNowMessages(tmpNowMessages);
    }
  }

  const handleSend = (text: string) => {
    sendMsg(text)
    updateArrBySender(text)

    // const message = new ChatMessage({
    //   id: "", // Id will be generated by storage generator, so here you can pass an empty string
    //   content: text as unknown as MessageContent<TextContent>,
    //   contentType: MessageContentType.TextHtml,
    //   senderId: user.id,
    //   direction: MessageDirection.Outgoing,
    //   status: MessageStatus.Sent
    // });

    // if (activeConversation) {
    //   sendMessage({
    //     message,
    //     conversationId: activeConversation.id,
    //     senderId: user.id,
    //   });
    // }

  };
  //Function to handle logout button
  const handleLogout = () => {
    console.log("Logout clicked");
    cookies.remove("id");
    cookies.remove("token");
    window.location.reload();
  };

  const getTypingIndicator = useCallback(
    () => {

      if (activeConversation) {

        const typingUsers = activeConversation.typingUsers;

        if (typingUsers.length > 0) {

          const typingUserId = typingUsers.items[0].userId;

          // Check if typing user participates in the conversation
          if (activeConversation.participantExists(typingUserId)) {

            const typingUser = getUser(typingUserId);

            if (typingUser) {
              return <TypingIndicator content={`${typingUser.username} is typing`} />
            }

          }

        }

      }


      return undefined;

    }, [activeConversation, getUser],
  );

  const UpdateMsgs = async () => {
    try{
      let lastMsg = nowMessages.length > 0 ? nowMessages[nowMessages.length - 1] : null;
      let res = await axios.post(config.serverUrl + '/chat/UpdateMsgs', {id:id,  lastKeyId : lastMsg?.keyId, lastTbNum : lastMsg?.hasGet }) 
      console.log(2329,res);
    }catch(err) {
      console.error('Error in UpdateMsgs:', err);
    }
  }

  const intervalUpdate = () => {
    UpdateMsgs();
    // setInterval(()=>UpdateMsgs(), 10000); 
  }

  useEffect(() => {
    initialUsersAndLastMessages();
    intervalUpdate();
  }, []);

  return (
    <MainContainer responsive>
      <Sidebar position="left" scrollable>
        <ConversationHeader>
          <Avatar src={user.avatar} />
          <ConversationHeader.Content>
            {user.username}
          </ConversationHeader.Content>

          <ConversationHeader.Actions>
            <Button
              labelPosition="right"
              icon={<FontAwesomeIcon icon={faSignOutAlt} />}
              onClick={handleLogout}
            />
          </ConversationHeader.Actions>
        </ConversationHeader>
        <Search placeholder="Search..." />
        <ConversationList>

          {
            Object.keys(arrBySender).map((sender: string) => {
              const senderMessages: tmpMsg[] = arrBySender[sender];
              const senderData: tmpMsg = senderMessages[0]; // Assuming there is at least one message for each sender

              const [avatar, name] = (() => {
                // You can customize this logic based on your data structure
                return [undefined, senderData.sender];
              })();

              return (
                <Conversation
                  key={sender}
                  name={name}
                  info={senderData.sms}
                  className={(nowMessages.length > 0) && nowMessages[0].sender === sender ? 'cs-conversation--active' : ''}
                  // Additional props can be added here
                  // active={true}
                  // unreadCnt={c.unreadCounter}
                  // className="cs-conversation--active"
                  onClick={() => onSelectLeft(senderMessages)}
                >
                  {avatar}
                </Conversation>
              );
            })
          }
        </ConversationList>
      </Sidebar>

      <ChatContainer>
        {nowMessages.length > 0 && (
          <ConversationHeader>
            {/* {currentUserAvatar} */}
            <ConversationHeader.Content userName={nowMessages[0].sender} />
          </ConversationHeader>
        )}
        <MessageList typingIndicator={getTypingIndicator()}>
          <button onClick={UpdateMsgs}>update</button>
          {nowMessages.length > 0 &&
            Object.keys(nowMessages).map((g, index) => (

              (nowMessages[index].hasGet === -1) ?
                <MessageGroup key={index} direction="outgoing" >
                  <MessageGroup.Messages>
                    <MessageGroup.Messages>
                      <Message
                        model={{
                          message: nowMessages[index].sms,
                          sentTime: "yesterday",
                          sender: "Joe",
                          position: "normal",
                          direction: (nowMessages[index].hasGet === -1) ? "outgoing" : "incoming"
                        }}
                      />
                    </MessageGroup.Messages>
                  </MessageGroup.Messages>
                </MessageGroup>
                :
                <MessageGroup key={index} direction="incoming">
                  <MessageGroup.Messages>
                    <MessageGroup.Messages>
                      <Message
                        model={{
                          message: nowMessages[index].sms,
                          sentTime: "yesterday",
                          sender: "Joe",
                          position: "normal",
                          direction: (nowMessages[index].hasGet === -1) ? "outgoing" : "incoming"
                        }}
                      />
                    </MessageGroup.Messages>
                  </MessageGroup.Messages>
                </MessageGroup>

            ))}
        </MessageList>
        <MessageInput
          value={currentMessage}
          onChange={handleChange}
          onSend={handleSend}
          disabled={!(nowMessages.length > 0)}
          attachButton={false}
          placeholder="Type here..."
        />
      </ChatContainer>
      <Spinner show={showSpinner} />
    </MainContainer>
  );

}
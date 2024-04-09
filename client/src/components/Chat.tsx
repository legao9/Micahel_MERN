import { useMemo, useCallback, useEffect, useState } from "react";

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
import { MessageContent, TextContent, User } from "@chatscope/use-chat";
import { on } from "events";

export const Chat = ({ user }: { user: User }) => {

  // Get all chat related values and methods from useChat hook 
  const {
    currentMessages, conversations, activeConversation, setActiveConversation, sendMessage, getUser, currentMessage, setCurrentMessage,
    sendTyping, setCurrentUser
  } = useChat();

  interface tmpMsg {
    idxUserId: number;
    sender: string;
    recvTm: string;
    sms: string;
  }
  interface tmpMsgCollection {
    [sender: string]: tmpMsg[];
  }

  const rearrangeBySender = (arr: tmpMsg[]): tmpMsgCollection => {
    let result: tmpMsgCollection = {};
    arr.forEach((item: tmpMsg) => {
      if (!result[item.sender]) {
        result[item.sender] = [];
      }
      result[item.sender].push(item);
    });

    return result;
  };

  const initialTestData: tmpMsg[] = [
    {
      "idxUserId": 1,
      "sender": "128",
      "recvTm": "2024-04-02T23:34:55.000Z",
      "sms": "TATE?state=NewAccount;name=19296659705;server=e6.vvm.mstore.msg.t-mobile.com;port=993;pw=oZxgxj8N1G"
    },
    {
      "idxUserId": 1,
      "sender": "128",
      "recvTm": "2024-04-02T23:28:28.000Z",
      "sms": "TATE?state=NewAccount;name=19293955221;server=e6.vvm.mstore.msg.t-mobile.com;port=993;pw=J1eSnEJqql"
    },
    {
      "idxUserId": 1,
      "sender": "128",
      "recvTm": "2024-04-02T23:28:27.000Z",
      "sms": "TATE?state=NewAccount;name=19293955221;server=e6.vvm.mstore.msg.t-mobile.com;port=993;pw=J1eSnEJqql"
    },
    {
      "idxUserId": 1,
      "sender": "13478569248",
      "recvTm": "2024-04-02T23:00:46.000Z",
      "sms": "Hi"
    },
    {
      "idxUserId": 1,
      "sender": "13478569248",
      "recvTm": "2024-04-02T22:59:48.000Z",
      "sms": "Testing"
    },
    {
      "idxUserId": 1,
      "sender": "13478569248",
      "recvTm": "2024-04-02T22:59:39.000Z",
      "sms": "Hi"
    },
    {
      "idxUserId": 1,
      "sender": "13478569248",
      "recvTm": "2024-04-02T22:59:01.000Z",
      "sms": "Hello"
    },
    {
      "idxUserId": 1,
      "sender": "13478569248",
      "recvTm": "2024-04-02T22:58:29.000Z",
      "sms": "Hi"
    },
    {
      "idxUserId": 1,
      "sender": "12174200595",
      "recvTm": "2024-04-02T22:42:43.000Z",
      "sms": "Stop"
    },
    {
      "idxUserId": 1,
      "sender": "128",
      "recvTm": "2024-04-02T22:42:27.000Z",
      "sms": "TATE?state=NewAccount;name=19297097338;server=e6.vvm.mstore.msg.t-mobile.com;port=993;pw=hWUx3K1Iw8"
    },
    {
      "idxUserId": 1,
      "sender": "128",
      "recvTm": "2024-04-02T22:42:04.000Z",
      "sms": "TATE?state=NewAccount;name=19297378325;server=e7.vvm.mstore.msg.t-mobile.com;port=993;pw=mU2tmrS4NS"
    },
    {
      "idxUserId": 1,
      "sender": "128",
      "recvTm": "2024-04-02T22:41:49.000Z",
      "sms": "TATE?state=NotAvailable;"
    },
    {
      "idxUserId": 1,
      "sender": "128",
      "recvTm": "2024-04-02T22:39:59.000Z",
      "sms": "TATE?state=NotAvailable;"
    },
    {
      "idxUserId": 1,
      "sender": "128",
      "recvTm": "2024-04-02T22:39:40.000Z",
      "sms": "TATE?state=NotAvailable;"
    },
    {
      "idxUserId": 1,
      "sender": "128",
      "recvTm": "2024-04-02T22:39:12.000Z",
      "sms": "TATE?state=NotAvailable;"
    }
  ];


  const [testStorage, setTestStorage] = useState<tmpMsg[]>(initialTestData);
  const [arrBySender, setarrBySender] = useState<tmpMsgCollection>({});
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [nowMessages, setNowMessages] = useState<tmpMsg[]>([]);

  const tmp = rearrangeBySender(testStorage);
  useEffect(() => {
    setarrBySender(tmp);
    // console.log('tmp:', tmp, arrBySender);
    console.log('selectedUser:', selectedUser);
  }, [testStorage, selectedUser]);

  const [currentUserAvatar, currentUserName] = useMemo(() => {

    if (activeConversation) {
      const participant = activeConversation.participants.length > 0 ? activeConversation.participants[0] : undefined;

      if (participant) {
        const user = getUser(participant.id);
        if (user) {
          return [<Avatar src={user.avatar} />, user.username]
        }
      }
    }

    return [undefined, undefined];

  }, [activeConversation, getUser]);

  const handleChange = (value: string) => {
    // setNowMessages(v);
    // Send typing indicator to the active conversation
    // You can call this method on each onChange event
    // because sendTyping method can throttle sending this event
    // So typing event will not be send to often to the server
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
    console.log(value);
    setSelectedUser(value[0].sender);
    setNowMessages(value);
    // setCurrentMessage('value');
    // if (activeConversation) {
    //   sendTyping({
    //     conversationId: activeConversation?.id,
    //     isTyping: true,
    //     userId: user.id,
    //     content: value, // Note! Most often you don't want to send what the user types, as this can violate his privacy!
    //     throttle: true
    //   });
    // }
  }

  const handleSend = (text: string) => {

    const message = new ChatMessage({
      id: "", // Id will be generated by storage generator, so here you can pass an empty string
      content: text as unknown as MessageContent<TextContent>,
      contentType: MessageContentType.TextHtml,
      senderId: user.id,
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent
    });

    if (activeConversation) {
      sendMessage({
        message,
        conversationId: activeConversation.id,
        senderId: user.id,
      });
    }

  };
  const cookies = new Cookies();
  //Function to handle logout button
  const handleLogout = () => {
    console.log("Logout clicked");
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
                  className={selectedUser === sender ? 'cs-conversation--active' : ''}
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

          {/* {conversations.map((c) => {
            // Helper for getting the data of the first participant
            const [avatar, name] = (() => {
              const participant =
                c.participants.length > 0 ? c.participants[0] : undefined;

              if (participant) {
                const user = getUser(participant.id);
                if (user) {
                  return [<Avatar src={user.avatar} />, user.username];
                }
              }

              return [undefined, undefined];
            })();

            return (
              <Conversation
                key={c.id}
                name={name}
                info={
                  c.draft
                    ? `Draft: ${c.draft
                      .replace(/<br>/g, "\n")
                      .replace(/&nbsp;/g, " ")}`
                    : ``
                }
                active={activeConversation?.id === c.id}
                unreadCnt={c.unreadCounter}
                onClick={() => setActiveConversation(c.id)}
              >
                {avatar}
              </Conversation>
            );
          })} */}
        </ConversationList>
      </Sidebar>

      <ChatContainer>
        {selectedUser && (
          <ConversationHeader>
            {currentUserAvatar}
            <ConversationHeader.Content userName={selectedUser} />
          </ConversationHeader>
        )}
        <MessageList typingIndicator={getTypingIndicator()}>
          {selectedUser &&
             Object.keys(nowMessages).map((g, index) => (
              <MessageGroup key={index} direction="incoming"
              >
                <MessageGroup.Messages>
                  <MessageGroup.Messages>
                    <Message
                      model={{
                        message: nowMessages[index].sms,
                        sentTime: "just now",
                        sender: "Joe",
                        position: "normal",
                        direction: "incoming"
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
          disabled={!selectedUser}
          attachButton={false}
          placeholder="Type here..."
        />
      </ChatContainer>
      {/* <ChatContainer>
        {activeConversation && (
          <ConversationHeader>
            {currentUserAvatar}
            <ConversationHeader.Content userName='selectedUser' />
          </ConversationHeader>
        )}
        <MessageList typingIndicator={getTypingIndicator()}>
          {activeConversation &&
            currentMessages.map((g) => (
              <MessageGroup key={g.id} direction={g.direction}>
                <MessageGroup.Messages>
                  {g.messages.map((m: ChatMessage<MessageContentType>) => (
                    <Message
                      key={m.id}
                      model={{
                        type: "html",
                        payload: m.content,
                        direction: m.direction,
                        position: "normal",
                      }}
                    />
                  ))}
                </MessageGroup.Messages>
              </MessageGroup>
            ))}
        </MessageList>
        <MessageInput
          value={currentMessage}
          onChange={handleChange}
          onSend={handleSend}
          disabled={!activeConversation}
          attachButton={false}
          placeholder="Type here..."
        />
      </ChatContainer> */}
    </MainContainer>
  );

}
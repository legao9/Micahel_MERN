import { useMemo, useEffect, useState } from "react";
import config from "../config/config";
import { MainContainer, Sidebar, ConversationList, Conversation, Avatar, ChatContainer, ConversationHeader, MessageGroup, Message, MessageList, MessageInput, TypingIndicator, Button, Search } from "@chatscope/chat-ui-kit-react";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from 'universal-cookie'
import {
  useChat,
} from "@chatscope/use-chat";
import axios from "axios";
import {  User } from "@chatscope/use-chat";
import Spinner from "./spinner";

export const Chat = ({ user }: { user: User }) => {
  interface tmpMsg {
    keyId: number;
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
  const [initialRows, setInitialRows] = useState<tmpMsg[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [arrBySender, setArrBySender] = useState<tmpMsgCollection>({});
  const [nowMessages, setNowMessages] = useState<tmpMsg[]>([]);
  const [selSender, setSelSender] = useState<string>('');
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
    return result;
  };

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

  const showSpinnerLimitSeconds = (seconds: any) => {
    setShowSpinner(true);
    setTimeout(() => {
      setShowSpinner(false);
    }, seconds * 1000);
  };

  const initializeMessages = async () => {
    showSpinnerLimitSeconds(10);
    try {
      let data = await getUsersAndLastMessages();
      setShowSpinner(false); // console.log(data);
      setInitialRows(data)
      localStorage.setItem('totalLength', data.length);
      const tmp = await rearrangeBySender(data); //console.log(tmp);
      setArrBySender(tmp);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const orderByRecentSender = (obj: { [key: string]: tmpMsg[] }) => {
    let tmpArrShow: { key: string; recvTm: string }[] = [];
    Object.keys(obj).forEach((key) => {
      tmpArrShow.push({ key, recvTm: obj[key][0]['recvTm'] });
    });
    tmpArrShow.sort((a, b) => new Date(b.recvTm).getTime() - new Date(a.recvTm).getTime());

    let res: string[] = [];
    tmpArrShow.forEach((item) => {
      res.push(item.key);
    });
    // console.log(res);
    return res;
  };

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
    console.log('User selected!', value);
    setNowMessages(value);
  }
  const sendMsg = async (lastRow: tmpMsg) => {
    console.log('sending message!', lastRow);
    const response = await axios.post(config.serverUrl + '/chat/sendMsg', { id, lastRow });
    console.log('saved message response:', response.data.result);
    if (response.data.result[0].keyId > 0) return true;
    else return false;
  };

  const updateArrBySender = async (text: string) => {
    showSpinnerLimitSeconds(7);
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

    if (lastRow?.hasGet === 0) {
      newRow = { keyId: 1, sender: lastRow.receiver, receiver: lastRow.sender, recvTm: currentTimeString, portNum: lastRow.portNum, sms: text, hasGet: -1 };
    }
    if (lastRow?.hasGet === -1) {
      newRow = { keyId: 1, sender: lastRow.sender, receiver: lastRow.receiver, recvTm: currentTimeString, portNum: lastRow.portNum, sms: text, hasGet: -1 };
    }
    if (newRow) {
      let isSaved = await sendMsg(newRow);
      if (isSaved) {
        let tmpInitRows: tmpMsg[] = initialRows;
        let tmpArrRows: tmpMsg[] = [newRow, ...tmpInitRows];
        setInitialRows(tmpArrRows);        // set now messages
        let tmpNowMessages: tmpMsg[] = nowMessages;
        tmpNowMessages = [newRow, ...tmpNowMessages];      // console.log('newNow Msgs:', tmpNowMessages.length);
        let tmpArrBySender = arrBySender;
        if (newRow.hasGet === 0) {
          tmpArrBySender[`${newRow?.sender}`] = tmpNowMessages;
        }
        else if (newRow.hasGet === -1) {
          tmpArrBySender[`${newRow?.receiver}`] = tmpNowMessages;
        }
        setArrBySender(tmpArrBySender);
        setNowMessages(tmpNowMessages);
      }
      else {
        alert('Message not sent');
      }
    }
    setShowSpinner(false);
  }

  const handleSend = (text: string) => {
    updateArrBySender(text)
  };
  //Function to handle logout button
  const handleLogout = () => {
    console.log("Logout clicked");
    cookies.remove("id");
    cookies.remove("token");
    window.location.reload();
  };

  const UpdateMsgs = async () => {
    let data = await getUsersAndLastMessages();
    let totalLength = parseInt(localStorage.getItem('totalLength')!);
    console.log('updated msg cnt : original msg count = ', data.length, ':', totalLength);
    if (data.length > totalLength) {
      setInitialRows(data)
      const tmp = await rearrangeBySender(data);
      localStorage.setItem('totalLength', data.length);
      setArrBySender(tmp);
    }
  }

  const intervalUpdate = (sec: number) => {
    setInterval(() => {
      // console.log('UpdateMsgs started!');
      UpdateMsgs();
    }, sec * 1000);
  }

  const [updating, setupdating] = useState<any>();
  useEffect(() => {
    initializeMessages();
    setTimeout(() => {
      setupdating(intervalUpdate(20));
    }, 30000);
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
            orderByRecentSender(arrBySender).length > 0 &&
            orderByRecentSender(arrBySender).map((sender: string) => {
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
            <ConversationHeader.Content userName={nowMessages[0].hasGet === 0 ? nowMessages[0].receiver : nowMessages[0].sender} />
          </ConversationHeader>
        )}
        <MessageList>
          {nowMessages.length > 0 &&
            Object.keys(nowMessages).map((g, index) => (
              (nowMessages[index].hasGet === -1) ?
                <MessageGroup key={index} direction="outgoing" >
                  <MessageGroup.Messages>
                    <MessageGroup.Messages>
                      <Message
                        model={{
                          message: nowMessages[index].sms,
                          sentTime: nowMessages[index].recvTm,
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
                          sentTime: nowMessages[index].recvTm,
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
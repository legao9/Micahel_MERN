import React, { Children } from "react";
import { useMemo, useEffect, useState, useRef } from "react";
import config from "../config/config";

import {
  MainContainer,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar,
  ChatContainer,
  ConversationHeader,
  MessageGroup,
  Message,
  MessageList,
  MessageInput,
  // TypingIndicator,
  Button,
  Search,
} from "@chatscope/chat-ui-kit-react";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseISO, format, isSameDay, isToday, isThisWeek, isThisYear } from "date-fns";
import Cookies from "universal-cookie";

import { useChat } from "@chatscope/use-chat";
import axios from "axios";
import { User } from "@chatscope/use-chat";
import Spinner from "./spinner";
import deleteIcon from '../assets/deleteIcon.png';
// import { Console } from "console";
// import { clearIntervalAsync } from "set-interval-async";
// import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';


export const Chat = ({ user }: { user: User }) => {

  const useInterval = (callback: () => void, delay: number | null) => {
    // Creating a ref to store the latest callback
    const savedCallback = useRef<() => void>()
    // Remember the latest callback when it changes
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])
    // Set up the interval
    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current()
            }
        }
  
        if (delay !== null) {
            const id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
  }
  
  interface tmpMsg {
    keyId: number;
    sender: string;
    receiver: string;
    recvTm: string;
    sms: string;
    portNum: number;
    hasGet: number;
    displayNumber: string;
    isRead: number;
    isDeleted?: number;
  }
  interface tmpMsgCollection {
    [sender: string]: tmpMsg[];
  }
  interface MesgCountByUser {
    [key: string]: number;
  }

  const cookies = new Cookies();
  const id = cookies.get("id");
  const [initialRows, setInitialRows] = useState<tmpMsg[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [arrBySender, setArrBySender] = useState<tmpMsgCollection>({});
  const [nowMessages, setNowMessages] = useState<tmpMsg[]>([]);
  const [lastSender, setLastSender] = useState<string | null>(null);
  // const [intervalTime, setInitervalTime] = useState<number>(20000);
  const {
    // currentMessages,
    // conversations,
    activeConversation,
    // setActiveConversation,
    // sendMessage,
    // getUser,
    currentMessage,
    setCurrentMessage,
    sendTyping,
    // setCurrentUser,
  } = useChat();

  const messageListRef = useRef<HTMLDivElement>(null);

  // //  to scroll to bottom
  useEffect(() => {
    if (messageListRef.current) {
      const element = messageListRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [nowMessages]);

  //helper method to seperate the messages by day
  const shouldShowDateSeparator = (msg: tmpMsg[], index: number) => {
    
    if (index === msg.length - 1) return true; // Always show for the first message
    const prevMessageDate = parseISO(nowMessages[index + 1].recvTm);
    const currentMessageDate = parseISO(nowMessages[index].recvTm);
    const isNewDay = !isSameDay(prevMessageDate, currentMessageDate);
   // console.log(`Index: ${index}, isNewDay: ${isNewDay}`); // Debug output
    return isNewDay;
  };
  //helper method to add date to the sidebar
  // const formatDateBasedOnRecency = (dateStr: string) => {
  //   const date = parseISO(dateStr);
  //   if (isToday(date)) {
  //     return format(date, "p"); // 'p' for local time format
  //   } else if (isThisWeek(date)) {
  //     return format(date, "iiii"); // 'iiii' for full weekday name
  //   } else if (isThisYear(date)) {
  //     return format(date, "MMM d"); // 'MMM d' for month and day
  //   } else {
  //     return format(date, "MMM d, yyyy"); // 'MMM d, yyyy' for full date
  //   }
  // };

  const rearrangeBySender = (arr: tmpMsg[]): tmpMsgCollection => {
    let result: tmpMsgCollection = {};
    arr.forEach((item: tmpMsg) => {
      const displayNumber = formatPhoneNumber(item.sender);
      const newItem = { ...item, displayNumber }; // Add displayNumber to the message object

      if (!result[item.sender]) {
        result[item.sender] = [];
      }
      result[item.sender].push(newItem);
    });
    return result;
  };

  const changeTimeByMyBrowser = (strTime: string) => {
    const browserTimezone = new Date().getTimezoneOffset(); // Get the browser's timezone offset
    // Convert the timestamp string to a Date object
    const timestamp = new Date(strTime);
    // Add the browser's timezone offset to the timestamp
    timestamp.setTime(timestamp.getTime() - (browserTimezone * 60 * 1000));
    // Format the timestamp as a string
    const formattedTimestamp = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
// console.log(formattedTimestamp,'------------------------------------------');

    return formattedTimestamp;
  }

  const getUsersAndLastMessages = async () => {
    try {
      const response = await axios.post(
        config.serverUrl + "/chat/getUsersAndLastMessages",
        { id: cookies.get("id") }
      );
      const res = response.data.messages;
      return res;
    } catch (error) {
      console.error("Error fetching test messages:", error);
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
    showSpinnerLimitSeconds(7);
    try {
      let data = await getUsersAndLastMessages();
      setShowSpinner(false); // console.log(data);
      setInitialRows(data);
      localStorage.setItem("totalLength", data.length);
      const tmp = await rearrangeBySender(data); //console.log(tmp);
      setMsgCountByUserToLocalStorage(tmp);
      setArrBySender(tmp);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const setMsgCountByUserToLocalStorage = (obj: tmpMsgCollection) => {
    let jsondata:MesgCountByUser = {};
    for (const key in obj) {
      jsondata[key] = obj[key].length; // <--- use key as a string
    }
    let res = JSON.stringify(jsondata);
    localStorage.setItem("mesgCountByUser", res);
  };
  // const getUnreadMsgCounts = (obj: tmpMsgCollection) => {
  //   let jsondata:MesgCountByUser = localStorage.getItem("mesgCountByUser")? JSON.parse(localStorage.getItem("mesgCountByUser")!): {};
  //   for (const key in obj) {
  //     if(obj[key].length > jsondata[key]){
  //       obj[key].isNew = true;
  //       jsondata[key] = obj[key].length;
  //     }
  //   }
  //   let res = JSON.stringify(jsondata);
  //   localStorage.setItem("mesgCountByUser", res);
  // };

  const orderByRecentSender = (obj: { [key: string]: tmpMsg[] }) => {
    let tmpArrShow: { key: string; recvTm: string }[] = [];
    Object.keys(obj).forEach((key) => {
      tmpArrShow.push({ key, recvTm: obj[key][0]["recvTm"] });
    });
    tmpArrShow.sort(
      (a, b) => new Date(b.recvTm).getTime() - new Date(a.recvTm).getTime()
    );

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
        throttle: true,
      });
    }
  };

  const onSelectLeft = (value: any) => {
    setNowMessages(value);
    markConversationRead(getSelectedUserNumber(value), 1);
  };


  const getSelectedUserNumber = (value: any) => {
    let lastRow: tmpMsg  = value[0] ;
    let displayNumber: string = lastRow.hasGet == 0? lastRow.sender : lastRow.receiver;
    console.log(displayNumber + "SELECTED!!!!!!!!!!!!");
    return displayNumber;
  }

  //function to send messages
  const sendMsg = async (lastRow: tmpMsg) => {
    console.log("sendMsg------------------------------------- : ",lastRow);
    
    if (lastRow) {
      const data = {
        sms: lastRow.sms, // message body
        to: lastRow.receiver, // Corrected to use 'receiver' instead of 'sender' for the recipient number
        from: lastRow.portNum, // port number
        tid: "1", // Example tid, adjust as necessary
      };

      // API call to the backend to contact the machine
      try {
        const URL = config.serverUrl;
        const response = await axios.post(`${URL}/sendMsg`, data);
        console.log("API TEST:", response.data);
      } catch (error) {
        console.error("Error in sendMsg:", error);
      }
    }

    const response = await axios.post(config.serverUrl + "/chat/sendMsg", {
      id,
      lastRow,
    });
    console.log("saved message response:", response.data.result);
    if (response.data.result[0].keyId > 0) return true;
    else return false;
  };

  const updateArrBySender = async (text: string) => {
    showSpinnerLimitSeconds(7);

    let lastRow: tmpMsg | null =
      nowMessages.length > 0 ? nowMessages[nowMessages.length - 1] : null;

    let newRow: tmpMsg | null = null;
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");
    const currentTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    if (lastRow?.hasGet == 0) {
      newRow = {
        keyId: 1,
        sender: lastRow.receiver,
        receiver: lastRow.sender,
        recvTm: currentTimeString,
        portNum: lastRow.portNum,
        sms: text,
        hasGet: -1,
        displayNumber: formatPhoneNumber(lastRow.receiver),
        isRead: 0,
      };
    } else if (lastRow?.hasGet === -1) {
      newRow = {
        keyId: 1,
        sender: lastRow.sender,
        receiver: lastRow.receiver,
        recvTm: currentTimeString,
        portNum: lastRow.portNum,
        sms: text,
        hasGet: -1,
        displayNumber: formatPhoneNumber(lastRow.sender),
        isRead: 0,
      };
    } else {
      return;
    }

    if (newRow) {
      let isSaved = await sendMsg(newRow);
      if (isSaved) {
        // Ensure displayNumber is updated correctly before updating state
        const updatedNowMessages = [newRow, ...nowMessages];
        console.log("Updated nowMessages state before backend confirmation:", updatedNowMessages);

        let updatedInitRows = [newRow, ...initialRows];
        setInitialRows(updatedInitRows);
        console.log("Updated initialRows state after backend confirmation:", updatedInitRows);

        // Update arrBySender state
        setArrBySender((prevArrBySender) => {
          let updatedArrBySender = { ...prevArrBySender };
          if (newRow!.hasGet === 0) {
            updatedArrBySender[newRow!.sender] = updatedNowMessages;
          } else if (newRow!.hasGet === -1) {
            updatedArrBySender[newRow!.receiver] = updatedNowMessages;
          }
          // console.log("Updated arrBySender state after backend confirmation:", updatedArrBySender);
          return updatedArrBySender;
        });

        // Force re-render by updating state with a new reference
        setNowMessages((prevMessages) => {
          console.log("Forcing re-render with nowMessages state:", prevMessages);
          return [...updatedNowMessages];
        });
      } else {
        alert("Message not sent");
      }
    }
    setShowSpinner(false);
  };


  //handles the sending of the messages
  const handleSend = (text: string) => {
    updateArrBySender(text);
    setCurrentMessage("");
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
    let totalLength = parseInt(localStorage.getItem("totalLength")!);
    console.log("All msg cnt : original msg count = ", data.length, ":", totalLength + " : " + new Date().toLocaleString());
    // if (data.length > totalLength) {
      setInitialRows(data);
      const tmp = await rearrangeBySender(data);
      localStorage.setItem("totalLength", data.length);
      setArrBySender(tmp);
    // }
  };

  const a =  useInterval(async () => await UpdateMsgs(), 20000);
  const [intervalState, setIntervalState] = useState(a);

   useEffect(() => {

    initializeMessages();
    // changeTimeByMyBrowser("2024-02-05T09:15:55.000Z");

  }, []);

  // Function to format a user's phone number
  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return phoneNumber;
  };

  //function to always display senders number:

  const displayNumber = (message: tmpMsg) => {
    const senderNumber = message.hasGet === -1 ? message.sender : message.receiver;
    return formatPhoneNumber(senderNumber);
  };

  //highlights and copies phone numbers
  const highlightText = (text: string, element: HTMLElement) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text", text);
    const textData = dataTransfer.getData("text");
    navigator.clipboard.writeText(textData);

    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    if (selection != null) {
      selection.removeAllRanges();
      selection.addRange(range);
      // Add these two lines to remove the highlight immediately
      setTimeout(() => {
        selection.removeAllRanges();
      }, 0);
    }

    const copiedMessage = document.getElementById("copied-message");
    if (copiedMessage) {
      const rect = element.getBoundingClientRect();
      copiedMessage.style.top = `${rect.bottom + window.scrollY}px`;
      copiedMessage.style.left = `${rect.left + window.scrollX}px`;
      copiedMessage.classList.add("show");
      setTimeout(() => {
        copiedMessage.classList.remove("show");
      }, 2000); // Show the message for 2 seconds
    }
  };

  //function to check for transition states:
  const getDisplayNumber = (messages: tmpMsg[], lastSender: string | null): string => {
    // Check for a temporary state transition
    if (messages.length > 0) {
      const latestMessage = messages[0];
      if (latestMessage.sender === lastSender || latestMessage.receiver === lastSender) {
        // State is stable, return the display number
        return latestMessage.displayNumber;
      }
    }
    // State is in transition, wait for stability
    return lastSender ?? ''; // Return the last known stable sender number or an empty string
  };

  const handleSelectConversation = (messages: tmpMsg[]) => {
    const latestMessage = messages[0];
    setLastSender(latestMessage.sender);
    setNowMessages(messages);
  };

  const filterJsonBySender = (msgCollection: tmpMsgCollection, sender: string): tmpMsgCollection =>{
    const filteredCollection: tmpMsgCollection = {};
    for (const key in msgCollection) {
      if (key !== sender) {
        filteredCollection[key] = msgCollection[key];
      }
    }
    return filteredCollection;
  }
 
  const SetReadJsonBySender = (msgCollection: tmpMsgCollection, sender: string): tmpMsgCollection =>{
    for (const key in msgCollection[sender] ) {
      msgCollection[sender][key].isRead = 1;
    }
    console.log("SetReadJsonBySender", msgCollection);
    return msgCollection;
    
  }

  const markConversationDeleted = async (phoneNumber: string, isDeleted: number) => {
    let tmpArrBySender: tmpMsgCollection = arrBySender;
    tmpArrBySender = filterJsonBySender(tmpArrBySender, phoneNumber);
    setArrBySender(tmpArrBySender);
    
    try {
      await axios.post(`${config.serverUrl}/conversation/markConversationDeleted`, {
        phoneNumber,
        isDeleted,
      });
      
    } catch (error) {
      console.error("Error marking conversation as deleted:", error);
    }
  };

  const markConversationRead = async (phoneNumber: string, isRead: number) => {
    let tmpArrBySender: tmpMsgCollection = arrBySender;
    tmpArrBySender = SetReadJsonBySender(tmpArrBySender, phoneNumber);
    setArrBySender(tmpArrBySender);
    
    try {
      await axios.post(`${config.serverUrl}/conversation/markConversationRead`, {
        phoneNumber,
        isRead,
      });
      
    } catch (error) {
      console.error("Error marking conversation as deleted:", error);
    }
  };

  // Function to handle delete button click
  const handleDeleteConversation = (phoneNumber: string) => {
    
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete this conversation?")) {
      markConversationDeleted(phoneNumber, 1);
    }
  
  };

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
          {orderByRecentSender(arrBySender).length > 0 &&
            orderByRecentSender(arrBySender).map((sender: string) => {
              const senderMessages: tmpMsg[] = arrBySender[sender];
              const latestMessage: tmpMsg =
                senderMessages[senderMessages.length - 1]; // Use the latest message
              const senderData: tmpMsg = senderMessages[0]; // Assuming there is at least one message for each sender

              if (senderData.isDeleted) {
                return null; // Skip deleted conversations
              }
              const [avatar, name] = [undefined, latestMessage.displayNumber];

              return (
                !senderData.isDeleted && <div key={sender} style={{ position: 'relative' }}>
                  <Conversation
                    name={name}
                    info={senderData.sms}
                    unreadDot={senderData.isRead === 0 && senderData.hasGet === 0}
                    className={ nowMessages.length > 0 && nowMessages[0].displayNumber === latestMessage.displayNumber? "cs-conversation--active" : "" }
                    onClick={() => onSelectLeft(senderMessages)} >
                    {avatar}
                  </Conversation>
                  <div className="cs-conversation__actions">
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="delete_img"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the onClick of the Conversation
                        handleDeleteConversation(senderData.sender);
                      }}
                    />
                  </div>
                  {/* <div className="cs-conversation_time">{format(parseISO(senderData.recvTm), "hh:mm MM/d/yyyy")}</div>  */}
                  <div className="cs-conversation_time">{changeTimeByMyBrowser(senderData.recvTm)}</div> 
                </div>
              );
              
            })}
        </ConversationList>
      </Sidebar>

      <ChatContainer>
        {nowMessages.length > 0 && (
          <ConversationHeader>
            <ConversationHeader.Content
              userName={nowMessages[nowMessages.length - 1].displayNumber} // Use the latest message
              children={
                <span className="hover-highlight">
                  {nowMessages[nowMessages.length - 1].displayNumber}
                  <span>
                    <div id="copied-message" className="copied-message">
                      Number copied to clipboard!
                    </div>
                  </span>
                </span>
              }
              style={{ cursor: "pointer", color: "black" }}
              onClick={(e) =>
                highlightText(
                  nowMessages[nowMessages.length - 1].displayNumber,
                  e.currentTarget
                )
              } // Use the latest message
            />
          </ConversationHeader>
        )}
        <MessageList ref={messageListRef}>
        {/* <MessageList > */}
          {nowMessages.map((msg, index) => (
            <div key={index} className="message-block">
              {shouldShowDateSeparator(nowMessages, index) && (
                <div className="date-separator">
                  {/* {format(parseISO(msg.recvTm), "EEEE, MMMM d, yyyy")} */}
                  {changeTimeByMyBrowser(msg.recvTm)}
                </div>
              )}
              <MessageGroup
                direction={msg.hasGet === -1 ? "outgoing" : "incoming"}
              >
                <MessageGroup.Messages>
                  <Message
                    model={{
                      message: msg.sms,
                      sentTime: changeTimeByMyBrowser(msg.recvTm), //format(parseISO(msg.recvTm), "p"),
                      sender: "---",
                      position: "last",
                      direction: msg.hasGet === -1 ? "outgoing" : "incoming",
                    }}
                  >
                    <Message.Footer>
                      {/* {format(parseISO(msg.recvTm), "p")} */}
                      {changeTimeByMyBrowser(msg.recvTm)}
                    </Message.Footer>
                  </Message>
                </MessageGroup.Messages>
              </MessageGroup>
            </div>
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
};

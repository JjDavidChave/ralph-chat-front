import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { IoSend } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Message received:", data);
      setMessageList((list) => {
        const uniqueMessages = new Set([...list, data]);
        return [...uniqueMessages];
      });
    };
  
    socket.on("receive_message", handleReceiveMessage);
  
    return () => {
      // Limpiar el listener cuando el componente se desmonta
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, messageList]);
  

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div
          style={{
            fontFamily: "fantasy",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: 'grey',
            height: 44
          }}
        >
          <h1>CHAT-LIVE</h1>
        </div>{" "}
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
                key={messageContent.id}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Escribe el mensaje..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          style={{ borderRadius: 10, backgroundColor: "whitesmoke" }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>
          <IoSend />
        </button>
      </div>
    </div>
  );
}

export default Chat;

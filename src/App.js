import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };


  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3 style={{ fontFamily: "fantasy" }}>CHAT-LIVE</h3>
          <p style={{ fontSize: 18 }}>ingresa un usuario</p>
          <input
            type="text"
            placeholder="usuario"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            style={{ textAlign: "center" }}
          />
          <div>
            <p style={{ fontSize: 18 }}>numero de sala</p>
          </div>
          <input
            type="text"
            placeholder="sala"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
            style={{ textAlign: "center" }}
          />
          <button className="button" onClick={joinRoom}>
            <span className="icon">
              <IoChatbubbleEllipsesOutline />
            </span>
            conectar al chat
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;

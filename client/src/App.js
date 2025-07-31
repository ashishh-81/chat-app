// client/src/App.js
//for local storage , which means even on reloading we will be able to see the same username
/*
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css"; // optional, you can style with Tailwind or plain CSS

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let savedUsername = localStorage.getItem("chat-username");
    if (!savedUsername) {
      savedUsername = prompt("Enter your name:");
      if (savedUsername) {
        localStorage.setItem("chat-username", savedUsername);
      }
    }
    setUsername(savedUsername || "Anonymous");
  }, []);

  useEffect(() => {
    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, { ...data, from: "other" }]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = { username, text: input };
    setMessages((prev) => [...prev, { ...message, from: "me" }]);
    socket.emit("chat message", message);
    setInput("");
  };

  return (
    <div className="app-container" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>💬 Welcome, {username}!</h2>

      <div style={{ height: "60vh", overflowY: "auto", border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            textAlign: msg.from === "me" ? "right" : "left",
            marginBottom: "0.5rem"
          }}>
            <strong>{msg.username}</strong>: {msg.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, padding: "0.5rem" }}
          placeholder="Type your message"
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>Send</button>
      </div>
    </div>
  );
}

export default App;
*/



/*
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./index.css"; // TailwindCSS included

const socket = io("http://localhost:5000");

const [isLoggedIn, setIsLoggedIn] = useState(false);

const handleLogin = async () => {
  const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  
  const result = await response.json();
  if (result.success) {
    setIsLoggedIn(true);
  } else {
    alert("Invalid username or password");
  }
};


function App() {
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    // Ask for name once
    const name = prompt("Enter your name:");
    setUsername(name || "Anonymous");
  }, []);

  useEffect(() => {
    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, { ...data, from: "other" }]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      username,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, { ...message, from: "me" }]);
    socket.emit("chat message", message);
    setInput("");
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-[90vh]">
        <div className="bg-blue-600 text-white text-xl font-semibold px-6 py-4">
          Welcome, {username}
        </div>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2 rounded-lg text-sm shadow ${
                msg.from === "me"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-800 self-start mr-auto"
              }`}
            >
              <div className="font-semibold">{msg.username}</div>
              <div>{msg.text}</div>
              <div className="text-xs text-right mt-1">{msg.time}</div>
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-2 border-t">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}




export default App;
*/



import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./index.css"; // TailwindCSS styles

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const socket = io(SERVER_URL);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (result.success) {
        setIsLoggedIn(true);
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      alert("Server not reachable");
    }
  };

  useEffect(() => {
    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, { ...data, from: "other" }]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      username,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, { ...message, from: "me" }]);
    socket.emit("chat message", message);
    setInput("");
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
          <h2 className="text-xl font-semibold text-center">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-[90vh]">
        <div className="bg-blue-600 text-white text-xl font-semibold px-6 py-4">
          Welcome, {username}
        </div>

        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2 rounded-lg text-sm shadow ${
                msg.from === "me"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-800 self-start mr-auto"
              }`}
            >
              <div className="font-semibold">{msg.username}</div>
              <div>{msg.text}</div>
              <div className="text-xs text-right mt-1">{msg.time}</div>
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-2 border-t">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;



/*import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import PublicRoom from "./components/PublicRoom";
import Login from "./components/Login";
import PrivateRoom from "./components/PrivateRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/public" element={<PublicRoom />} />
        <Route path="/login" element={<Login />} />
        <Route path="/private" element={<PrivateRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
*/
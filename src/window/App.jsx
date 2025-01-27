import React, { useState, useEffect } from 'react';

const SERVER_PORT = 8081;

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:${SERVER_PORT}`);
    
    ws.onopen = () => {
      console.log('connected to server');
    };

    ws.onmessage = (event) => {
      const newMsg = event.data;

      console.log('client received message:', newMsg);
      setMessages((prevMsg) => [...prevMsg, newMsg]);
    };

    ws.onclose = () => {
      console.log('connection closed');
    };

    ws.onerror = (error) => {
      console.error('error:', error);
    };

    setWs(ws);

    return () => {
      ws.close();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const message = event.target.value;
        console.log('message:', message);
        ws.send(message);
        event.target.value = '';
      }
  };

  return (
    <div id='home'>
      <h1>Chat App</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="chat-input">Send a message (press Enter to send)</label><br />
        <input type="text" name="chat-input" onKeyUp={handleKeyUp} defaultValue={inputValue} />
      </form>

      <h2>Chat Log</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
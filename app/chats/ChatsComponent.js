// chats/ChatsComponent.js
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { ArrowDropUp, Close } from '@mui/icons-material';

const ChatsComponent = ({ friend, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false); // State to minimize the chat

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'Me', text: input }]);
      setInput('');
      // Logic to send message to the backend can be added here
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        width: minimized ? '300px' : '400px',
        height: minimized ? '40px' : '300px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 0.3s ease',
      }}
    >
      <Box
        sx={{
          padding: '0.5rem',
          backgroundColor: '#0077b5',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1">{friend.fullName}</Typography>
        <Box>
          <IconButton onClick={() => setMinimized(!minimized)} sx={{ color: '#fff' }}>
            {minimized ? <ArrowDropUp /> : <ArrowDropUp style={{ transform: 'rotate(180deg)' }} />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </Box>
      </Box>
      {!minimized && (
        <Box sx={{ flex: 1, padding: '0.5rem', overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <Typography key={index} sx={{ marginBottom: '0.5rem', textAlign: message.sender === 'Me' ? 'right' : 'left' }}>
              <strong>{message.sender}: </strong>{message.text}
            </Typography>
          ))}
        </Box>
      )}
      {!minimized && (
        <Box sx={{ display: 'flex', padding: '0.5rem' }}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
          />
          <Button onClick={handleSendMessage} variant="contained" sx={{ marginLeft: '0.5rem' }}>
            Send
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatsComponent;

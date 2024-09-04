import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { ArrowDropUp, Close, PersonAdd } from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import socket from '../utils/socket'; // Import the socket instance for real-time messaging

const ChatsComponent = ({ friend, onClose }) => {
  const { user: clerkUser } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  
  // Construct chat ID based on usernames and emails
  const chatId = `${[clerkUser.username, friend.username].sort().join('_')}_${[clerkUser.emailAddresses[0].emailAddress, friend.email].sort().join('_')}`;

  useEffect(() => {
    if (!clerkUser || !friend) return;

    // Fetch existing chat messages from Firestore
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`/api/chats?sender=${encodeURIComponent(clerkUser.username)}&receiver=${encodeURIComponent(friend.username)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chat messages');
        }
        const data = await response.json();
        setMessages(data); // Set messages in the state
      } catch (error) {
        console.error('Failed to fetch chat messages:', error);
      }
    };

    fetchChatHistory();

    // Join the chat room for real-time messaging
    socket.emit('joinRoom', { chatId });

    // Listen for incoming messages from Socket.IO
    socket.on('receiveMessage', ({ from, message, timestamp }) => {
      setMessages((prevMessages) => [...prevMessages, { sender: from, text: message, timestamp }]);
    });

    // Cleanup function to leave the room and remove listeners on component unmount
    return () => {
      socket.emit('leaveRoom', { chatId });
      socket.off('receiveMessage');
    };
  }, [clerkUser, friend, chatId]);

  const handleSendMessage = () => {
    if (input.trim()) {
      const message = input.trim();
      const timestamp = new Date().toISOString();

      // Emit the message via Socket.IO to the server
      socket.emit('sendMessage', {
        chatId,
        from: clerkUser.username,
        to: friend.username,
        message,
        timestamp,
      });

      // Send the message to the server to be stored in Firestore
      fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: clerkUser.username,
          receiver: friend.username,
          message,
          timestamp,
        }),
      }).catch((err) => console.error('Failed to store message:', err));

      // Update state with the new message locally
      setMessages((prevMessages) => [...prevMessages, { sender: 'Me', text: message, timestamp }]);
      setInput(''); // Clear the input field
    }
  };

  // Check if the selected friend is already in the user's friends list
  useEffect(() => {
    const checkIfFriend = async () => {
      try {
        const response = await fetch(`/api/friends-list?email=${encodeURIComponent(clerkUser.emailAddresses[0].emailAddress)}&username=${encodeURIComponent(clerkUser.username)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch friends list');
        }
        const data = await response.json();
        const friendDocId = `${friend.username}_${friend.email.replace(/[@.]/g, '_')}`;
        setIsFriend(data.some((f) => f.id === friendDocId));
      } catch (error) {
        console.error('Failed to check friends list:', error);
      }
    };

    checkIfFriend();
  }, [clerkUser, friend]);

  // Add the friend to the current user's friends list
  const handleAddFriend = async () => {
    if (!clerkUser || !friend) return;

    try {
      const response = await fetch(`/api/friends-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUserEmail: clerkUser.emailAddresses[0].emailAddress,
          currentUserUsername: clerkUser.username,
          friendEmail: friend.email,
          friendUsername: friend.username,
        }),
      });

      if (response.ok) {
        setIsFriend(true);
        alert(`${friend.fullName} has been added to your friends list.`);
      } else {
        throw new Error('Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  // If the friend object is not yet loaded, show a loading message
  if (!friend) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          width: '400px',
          height: '100px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <Typography variant="body1" sx={{ color: '#666' }}>
          Loading chat...
        </Typography>
      </Box>
    );
  }

  // Render the chat box with messages
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isFriend && (
            <IconButton onClick={handleAddFriend} sx={{ color: '#fff' }}>
              <PersonAdd />
            </IconButton>
          )}
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
            <Typography
              key={index}
              sx={{
                marginBottom: '0.5rem',
                textAlign: message.sender === 'Me' ? 'right' : 'left',
                color: message.sender === 'Me' ? '#0077b5' : '#333',
              }}
            >
              <strong>{message.sender === 'Me' ? 'You' : message.sender}: </strong>
              {message.text}
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

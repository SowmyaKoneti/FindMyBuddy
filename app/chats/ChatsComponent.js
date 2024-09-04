import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { ArrowDropUp, Close, PersonAdd } from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';

const ChatsComponent = ({ friend, onClose }) => {
  const { user: clerkUser } = useUser(); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false); 
  const [isFriend, setIsFriend] = useState(false); 

  // Log the friend data to verify it is being passed correctly
  console.log('Received friend data:', friend);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'Me', text: input }]);
      setInput('');
      // Logic to send message to the backend can be added here
    }
  };

  useEffect(() => {
    if (!clerkUser || !friend) return; 

    // Check if friend exists
    const checkIfFriend = async () => {
      try {
        // Fetch friends list for the current user
        const response = await fetch(`/api/friends-list?email=${encodeURIComponent(clerkUser.emailAddresses[0].emailAddress)}&username=${encodeURIComponent(clerkUser.username)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch friends list');
        }
        const data = await response.json();
        
        const friendDocId = `${friend.username}_${friend.email.replace(/[@.]/g, '_')}`;
        
        setIsFriend(data.some(f => f.id === friendDocId));
      } catch (error) {
        console.error('Failed to check friends list:', error);
      }
    };

    checkIfFriend();
  }, [clerkUser, friend]);

  // Add friend to friend list in backend database
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

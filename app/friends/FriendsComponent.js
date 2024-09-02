// friends/FriendsComponent.js
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const FriendsComponent = () => {
  const [friends, setFriends] = useState([
    { fullName: 'John Doe' },
    { fullName: 'Jane Smith' },
    // Add more friends as needed
  ]);

  const handleRemoveFriend = (friend) => {
    setFriends((prev) => prev.filter((f) => f !== friend));
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '2rem',
        transform: 'translateY(-50%)',
        width: '300px',
        background: '#f9f9f9',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: '70vh',
        overflowY: 'auto',
      }}
    >
        <Typography
            variant="h6"
            sx={{
            marginBottom: '1rem',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center', // Center the text
            width: '100%', // Ensure it spans the full width
            }}
        >
            Friends List
        </Typography>
      {friends.map((friend, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            marginBottom: '0.5rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="subtitle1">{friend.fullName}</Typography>
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => alert(`Chat with ${friend.fullName}`)}
            >
              Chat
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => handleRemoveFriend(friend)}
            >
              Remove
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default FriendsComponent;

// friends/FriendsComponent.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

const FriendsComponent = ({ onChatClick }) => {
//   const [friends, setFriends] = useState([]);

  const [friends, setFriends] = useState([
    { fullName: 'John Doe' },
    { fullName: 'Jane Smith' },
    { fullName: 'Harsha' },
    { fullName: 'Sowmya' },
    { fullName: 'Pranav' },
    { fullName: 'Shravya' },
    { fullName: 'Akmy' },
    { fullName: 'Sam' },
    { fullName: 'Jo' },

    // Add more friends as needed
  ]);

  const handleRemoveFriend = (friend) => {
    setFriends((prev) => prev.filter((f) => f !== friend));
  };

//   useEffect(() => {
//     // Fetch the friends list from the backend or database
//     const fetchFriends = async () => {
//       try {
//         // Replace with your actual fetch logic
//         const response = await fetch('/api/friends-list'); // Update with your API endpoint
//         const data = await response.json();
//         setFriends(data.friends); // Assuming response contains an array of friends
//       } catch (error) {
//         console.error('Failed to fetch friends:', error);
//       }
//     };

//     fetchFriends();
//     }, []);
  
//   const handleRemoveFriend = async (friend) => {
//     // Logic to remove a friend from the list
//     try {
//       // Send request to remove friend
//       const response = await fetch(`/api/friends-list/${friend.id}`, { // Adjust endpoint and method as needed
//         method: 'DELETE',
//       });
//       if (response.ok) {
//         // Update the state to remove friend from the UI
//         setFriends((prevFriends) => prevFriends.filter((f) => f.id !== friend.id));
//       } else {
//         console.error('Failed to remove friend');
//       }
//     } catch (error) {
//       console.error('Error removing friend:', error);
//     }
//   };

  return (
    <Box
        sx={{
        position: 'absolute',
        top: '50%',
        left: '1rem',
        transform: 'translateY(-50%)',
        width: '350px',
        background: '#f9f9f9',
        padding: '0.9rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto',
        }}
    >
      <Typography variant="h6" sx={{ marginBottom: '1rem', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
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
              onClick={() => onChatClick(friend)}
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

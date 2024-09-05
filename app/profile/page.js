'use client';

import Head from "next/head";
import { useSearchParams } from 'next/navigation'; 
import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import SettingsIcon from '@mui/icons-material/Settings';

import FriendsComponent from '../friends/FriendsComponent';  
import ChatsComponent from '../chats/ChatsComponent';       

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const searchParams = useSearchParams();
  const [chatUser, setChatUser] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSettings, setOpenSettings] = useState(false);
  const [activeChat, setActiveChat] = useState(null); 

  // useEffect to set chatUser once router query is available
  useEffect(() => {
    const email = searchParams.get('email') || '';
    const username = searchParams.get('username') || '';
    console.log('Search params:', { email, username }); 
    if (email && username) {
      setChatUser({ email, username });
      console.log('Set chatUser with:', { email, username });
    } else {
      console.warn('Email or username is missing in search parameters');
    }
  }, [searchParams]);

  // Fetch user data for chatUser 
  useEffect(() => {
    if (chatUser && chatUser.email && chatUser.username) {
      console.log("Fetching data for chatUser:", chatUser);
      fetch(`/api/user-details?email=${encodeURIComponent(chatUser.email)}&username=${encodeURIComponent(chatUser.username)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            console.log("Fetched chat data:", data); 
            setActiveChat(data); 
          } else {
            console.log("No data found for chatUser");
          }
        })
        .catch(err => console.error('Failed to fetch user details for chat:', err));
    }
  }, [chatUser]);

  useEffect(() => {
    console.log("Current activeChat:", activeChat);
  }, [activeChat]);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    location: '',
    bio: '',
    areaOfInterest: '',
    lookingFor: '',
    linkedIn: '',
    github: '',
    instagram: '',
    twitter: '',
  });

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!clerkUser) return;
  
      try {
        const email = clerkUser.emailAddresses[0]?.emailAddress; 
        const username = clerkUser.username;
  
        if (!email || !username) {
          throw new Error('Email or username is missing');
        }

        const response = await fetch(
          `/api/user-details?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`,
          { method: 'GET' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserData(data);
        setFormData({
          fullName: data.fullName || '',
          address: data.address || '',
          location: data.location || '',
          bio: data.bio || '',
          areaOfInterest: data.areaOfInterest || '',
          lookingFor: data.lookingFor || '',
          linkedIn: data.linkedIn || '',
          github: data.github || '',
          instagram: data.instagram || '',
          twitter: data.twitter || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load profile details');
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [clerkUser]);

  const handleNavigation = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleSettingsOpen = () => {
    setOpenSettings(true);
  };

  const handleSettingsClose = () => {
    setOpenSettings(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          username: clerkUser.username,
          email: clerkUser.emailAddresses[0]?.emailAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user details');
      }

      setOpenSettings(false);
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };

  const handleDeleteAccount = async () => {
    signOut()
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Failed to log out:', error);
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(to right, #E0F7FA, #FFFFFF)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(to right, #E0F7FA, #FFFFFF)',
          color: 'red',
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
    <Head>
        <title>Club3 - Profile</title>
        <link rel = "icon"
		          href = "/images/club3-favicon.ico"/>
        <meta name="description" content="Your CLub3 Profile." />
    </Head>
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(to right, #E0F7FA, #FFFFFF)',
        padding: '2rem',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: '100%',  
          display: 'flex',
          justifyContent: 'space-between', 
          alignItems: 'center',           
          padding: '1rem',
          boxSizing: 'border-box',         
          position: 'absolute',          
          top: 0,                         
          left: 0,                         
        }}
      >
        {/* Left Side: Logo and club3 Text */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="../images/club3-custom-logo.svg"  
            alt="Logo"
            style={{ width: '32px', marginRight: '8px' }} 
          />
          <Typography
            variant="h5"
            sx={{
              background: 'linear-gradient(to right, #fcb045, #fd8369)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Club3
          </Typography>
        </Box>
      {/* Top Right: Home Icon and Log Out Button */}
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
      <IconButton
          onClick={() => (window.location.href = '/')}
          sx={{
            fontSize: '32px', 
            padding: '8px',
            background: 'linear-gradient(to right, #4f758f, #449fdb)',  
            WebkitBackgroundClip: 'text',   
            WebkitTextFillColor: 'transparent', 
            '&:hover': {
              background: 'linear-gradient(to right, #3b5f7a, #4a86aa)',  
            },
          }}
        >
          <HomeIcon sx={{ fontSize: '32px' }} />  
        </IconButton>
        <IconButton onClick={handleSettingsOpen} 
        sx={{ 
          fontSize: '32px', 
            padding: '8px',
            background: 'linear-gradient(to right, #4f758f, #449fdb)',  
            WebkitBackgroundClip: 'text',   
            WebkitTextFillColor: 'transparent', 
            '&:hover': {
              background: 'linear-gradient(to right, #3b5f7a, #4a86aa)',  
            }, 
        }}>
          <SettingsIcon sx={{ fontSize: '32px' }} />
        </IconButton>
        <Button
          variant="contained"
            sx={{
              background: 'linear-gradient(to right, #4f758f, #449fdb)',
              color: '#FFFFFF',
              marginLeft: '1rem',
                '&:hover': {
              background: 'linear-gradient(to right, #3b5f7a,  #4a86aa)', 
                  },
            }}
          onClick={() => {
            signOut()
              .then(() => {
                window.location.href = '/';
              })
              .catch((error) => {
                console.error('Failed to log out:', error);
              });
          }}
        >
          Log Out
        </Button>
      </Box>
      </Box>

      {/* Center: User Details */}
      <Box sx={{ textAlign: 'center', marginTop: '5rem' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333333' }}>
          {userData?.fullName || 'User Name'}
        </Typography>
        {clerkUser && (
          <Typography variant="body2" sx={{ color: '#555555' }}>
            @{clerkUser.username || clerkUser.firstName || clerkUser.email}
          </Typography>
        )}
        <Typography variant="body1" sx={{ marginBottom: '1rem', color: '#666666' }}>
          {userData?.bio || 'User Bio'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {userData?.linkedIn && (
            <LinkedInIcon sx={{ color: '#0077b5', cursor: 'pointer' }} onClick={() => handleNavigation(userData.linkedIn)} />
          )}
          {userData?.github && (
            <GitHubIcon sx={{ color: '#333333', cursor: 'pointer' }} onClick={() => handleNavigation(userData.github)} />
          )}
          {userData?.twitter && (
            <TwitterIcon sx={{ color: '#1DA1F2', cursor: 'pointer' }} onClick={() => handleNavigation(userData.twitter)} />
          )}
          {userData?.instagram && (
            <InstagramIcon sx={{ color: '#E1306C', cursor: 'pointer' }} onClick={() => handleNavigation(userData.instagram)} />
          )}
        </Box>
      </Box>

      {/* Friends List Section */}
      <FriendsComponent onChatClick={(friend) => setActiveChat(friend)} />

      {/* Chat Box */}
      {activeChat ? (
        <ChatsComponent
          friend={activeChat}
          onClose={() => {
            console.log('Closing chat component');
            setActiveChat(null);
          }}
        />
      ) : (
        console.log('Chat box is not rendered as activeChat is:', activeChat)
      )}

      {/* Edit Account Details Dialog */}
      <Dialog open={openSettings} onClose={handleSettingsClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Account Details</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.keys(formData).map((key) => (
              <TextField
                key={key}
                name={key}
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                value={formData[key]}
                onChange={handleChange}
                disabled={key === 'email' || key === 'username'}
                sx={{
                  '& .MuiInputLabel-root': { color: '#aaa' }, 
                  '& .MuiInputBase-input': { color: '#333' }, 
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSettingsClose}
            sx={{
              color: '#420050',
              fontWeight: 'bold',
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s',
              '&:hover': { boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)', transform: 'scale(1.05)' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              color: '#4caf50',
              fontWeight: 'bold',
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s',
              '&:hover': { boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)', transform: 'scale(1.05)' },
            }}
          >
            Save
          </Button>
          <Button
            onClick={handleDeleteAccount}
            sx={{
              color: '#d32f2f',
              fontWeight: 'bold',
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s',
              '&:hover': { boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)', transform: 'scale(1.05)' },
            }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}

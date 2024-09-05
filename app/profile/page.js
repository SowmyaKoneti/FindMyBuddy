'use client';

import Head from "next/head";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'; 
import React, { useEffect, useState, Suspense } from 'react';
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

function ProfileContent() {
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
    <>{/* Rest of your component's return JSX */}</>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

'use client';

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

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { user: clerkUser } = useUser();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSettings, setOpenSettings] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    bio: '',
    areaOfInterest: '',
    linkedIn: '',
    github: '',
    instagram: '',
    twitter: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!clerkUser) return;

      try {
        const response = await fetch(
          `/api/user-details?email=${encodeURIComponent(
            clerkUser.emailAddresses[0]?.emailAddress
          )}&username=${encodeURIComponent(clerkUser.username)}`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserData(data);
        setFormData({
          fullName: data.fullName || '',
          location: data.location || '',
          bio: data.bio || '',
          areaOfInterest: data.areaOfInterest || '',
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
        headers: {
          'Content-Type': 'application/json',
        },
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
    // Logic for deleting the account
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
      {/* Top Right: Home Icon and Log Out Button */}
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
        <IconButton
          onClick={() => (window.location.href = '/')}
          sx={{
            color: '#555', // Plain black/grey color
          }}
        >
          <HomeIcon />
        </IconButton>
        <IconButton onClick={handleSettingsOpen} sx={{ color: '#555' }}>
          <SettingsIcon />
        </IconButton>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #4f758f, #449fdb)',
            color: '#ffffff',
            '&:hover': {
              background: 'linear-gradient(to right, #3b5f7a, #307fcc)',
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

      {/* Center: User Name, Bio, Social Icons, and Settings */}
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
            <LinkedInIcon
              sx={{ color: '#0077b5', cursor: 'pointer' }}
              onClick={() => handleNavigation(userData.linkedIn)}
            />
          )}
          {userData?.github && (
            <GitHubIcon
              sx={{ color: '#333333', cursor: 'pointer' }}
              onClick={() => handleNavigation(userData.github)}
            />
          )}
          {userData?.twitter && (
            <TwitterIcon
              sx={{ color: '#1DA1F2', cursor: 'pointer' }}
              onClick={() => handleNavigation(userData.twitter)}
            />
          )}
          {userData?.instagram && (
            <InstagramIcon
              sx={{ color: '#E1306C', cursor: 'pointer' }}
              onClick={() => handleNavigation(userData.instagram)}
            />
          )}
        </Box>
      </Box>

      {/* Edit Account Details Dialog */}
      <Dialog open={openSettings} onClose={handleSettingsClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Account Details</DialogTitle>
        <DialogContent>
          <br></br>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.keys(formData).map((key) => (
              <TextField
                key={key}
                name={key}
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={formData[key]}
                onChange={handleChange}
                disabled={key === 'email' || key === 'username'}
                sx={{
                  '& .MuiInputLabel-root': { color: '#333' }, // Proper label color for better visibility
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
              '&:hover': {
                boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.05)',
              },
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
              '&:hover': {
                boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.05)',
              },
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
              '&:hover': {
                boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.05)',
              },
            }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

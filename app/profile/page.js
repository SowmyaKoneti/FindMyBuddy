'use client'; // Ensures this component is treated as a Client Component

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function ProfilePage() {
  // Hardcoded user details
  const user = {
    name: 'John Doe',
    bio: 'Software Developer with a passion for teaching and learning new technologies.',
    linkedIn: 'https://www.linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    twitter: 'https://twitter.com/johndoe',
    instagram: 'https://www.instagram.com/johndoe',
  };

  const handleNavigation = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff', // White background for the profile page
        padding: '2rem',
      }}
    >
      {/* Top Right: Home and Log Out Buttons */}
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem', display: 'flex', gap: '1rem' }}>
        <Button
          onClick={() => (window.location.href = '/')} // Navigate to landing page
          startIcon={<HomeIcon />}
          sx={{
            background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', // Gradient to match Sign In button on landing page
            color: '#ffffff', // White text color for visibility
            '&:hover': {
              background: 'linear-gradient(45deg, #6a2c70, #c31432, #ff7e5f)', // Slightly darker gradient on hover
            },
            padding: '6px 16px', // Similar padding to the Sign In button
            borderRadius: '4px', // Border radius to match button style
          }}
        >
          Home
        </Button>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', // Gradient to match Sign In button on landing page
            color: '#ffffff', // White text color for visibility
            '&:hover': {
              background: 'linear-gradient(45deg, #6a2c70, #c31432, #ff7e5f)', // Slightly darker gradient on hover
            },
          }}
          onClick={() => {
            // Handle log out - Redirect to landing page
            window.location.href = '/';
          }}
        >
          Log Out
        </Button>
      </Box>

      {/* Center: User Name, Bio, and Social Icons */}
      <Box sx={{ textAlign: 'center', marginTop: '5rem' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333333' }}>
          {user.name}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '1rem', color: '#666666' }}>
          {user.bio}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {user.linkedIn && (
            <LinkedInIcon
              sx={{ color: '#0077b5', cursor: 'pointer' }}
              onClick={() => handleNavigation(user.linkedIn)}
            />
          )}
          {user.github && (
            <GitHubIcon
              sx={{ color: '#333333', cursor: 'pointer' }}
              onClick={() => handleNavigation(user.github)}
            />
          )}
          {user.twitter && (
            <TwitterIcon
              sx={{ color: '#1DA1F2', cursor: 'pointer' }}
              onClick={() => handleNavigation(user.twitter)}
            />
          )}
          {user.instagram && (
            <InstagramIcon
              sx={{ color: '#E1306C', cursor: 'pointer' }}
              onClick={() => handleNavigation(user.instagram)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

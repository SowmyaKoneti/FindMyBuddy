
'use client'; // Mark this as a Client Component

import React, { createContext } from 'react';
import Head from "next/head";
import MapComponent from "./maps/MapComponent";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Container, Button, TextField, InputAdornment } from '@mui/material';




export default function Home() {
  const handleSignIn = () => {
    window.location.href = '/profile'; // Correct path to profile page
  };

  return (

    <>
      <Head>
        <title>Third Place - Home</title>
        <meta name="description" content="Connect with others based on your interests and location." />
      </Head>
    <Box 
      sx={{ 
        width: '100%', // Full width of the viewport
        minHeight: '100vh', // Full height of the viewport
        display: 'flex', // Center content horizontally and vertically
        flexDirection: 'column', // Align items vertically
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', // White background
        padding: '2rem'
      }}
    >
      {/* Static Label at Top Left */}
      <Typography 
        variant="subtitle2" 
        sx={{ 
          position: 'fixed', // Fixed positioning to keep it static
          top: '1rem', 
          left: '1rem',
          background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', // Gradient for the subtitle
          WebkitBackgroundClip: 'text', // Clip the background to the text
          WebkitTextFillColor: 'transparent', // Make the text transparent to show the gradient
          fontWeight: 'medium',
          fontFamily: 'sans-serif',
          zIndex: 1000, // Ensure it stays on top
        }}
      >
        &lt; Third Place &gt;
      </Typography>

      {/* Sign In and Sign Up Buttons */}
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem', display: 'flex', gap: '1rem' }}>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', // Gradient for the buttons
            color: '#ffffff', // White text color for visibility
            '&:hover': {
              background: 'linear-gradient(45deg, #6a2c70, #c31432, #ff7e5f)', // Slightly darker gradient on hover
            }
          }}
          onClick={handleSignIn} // Correctly set onClick to navigate
        >
          Sign In
        </Button>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', // Gradient for the buttons
            color: '#ffffff', // White text color for visibility
            '&:hover': {
              background: 'linear-gradient(45deg, #6a2c70, #c31432, #ff7e5f)', // Slightly darker gradient on hover
            }
          }}
        >
          Sign Up
        </Button>
      </Box>

      {/* Page Heading */}
      <Typography 
        variant="h2" 
        sx={{ 
          textAlign: 'center', 
          marginBottom: '1rem', 
          fontWeight: 'bold', 
          background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', // Instagram-like gradient
          WebkitBackgroundClip: 'text', // Clip the background to the text
          WebkitTextFillColor: 'transparent', // Make the text transparent to show the gradient
        }}
      >
        Third Place
      </Typography>
        
      {/* Page Description */}
      <Typography 
        variant="body1" 
        sx={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          color: '#fcb045', // Orange from the gradient for consistency
        }}
      >
        This app allows you to create your own social community based on your interests and location. <br />
        Connect with others to share knowledge, teach, learn, and grow together in a collaborative environment.
      </Typography>

      {/* Search Field */}
      <Box 
        sx={{ 
          maxWidth: 900, // Match previous width settings
          width: '100%', // Ensure the box is responsive
          margin: '0 auto', 
          padding: '0.5rem', 
          border: '1px solid #833ab4', // Border color from the Instagram gradient
          borderRadius: '8px', // Rounded corners
          position: 'relative', // Allows positioning of the icon
          backgroundColor: '#ffffff', // Match the app background
          display: 'flex', // Flexbox for alignment
          alignItems: 'center', // Center vertically
        }}
      > 
        <TextField
          variant="outlined"
          placeholder="Area of Interest"
          fullWidth
          InputProps={{
            sx: {
              color: '#000000', // Black text color for visibility on white background
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent', // Removes default border
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#833ab4', // Border on hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#833ab4', // Border when focused
              },
            },
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: '#833ab4' }} /> {/* Search icon with color matching the gradient */}
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: '#ffffff', // Match the app background
            borderRadius: '8px', // Match the parent box
          }}
        />
      </Box>
    </Box>
    <Container>
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Maps
        </Typography>

      </Box>
      <Box sx={{ height: 400 }}>
        <MapComponent />
      </Box>
    </Container>
   </>
  );

}

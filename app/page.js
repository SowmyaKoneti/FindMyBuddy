'use client'; // Mark this as a Client Component

import React from 'react';
import Head from "next/head";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import MapComponent from "./maps/MapComponent";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Button, TextField, InputAdornment, Container } from '@mui/material';

export default function Home() {
  const handleSignIn = () => {
    window.location.href = '/sign-in'; // path to sign-in page
  };

  const handleSignUp = () => {
    window.location.href = '/sign-up'; // path to sign-up page
  }

  return (
    <>
      <Head>
        <title>club3 - Home</title>
        <meta name="description" content="Connect with others based on your interests and location." />
      </Head>

      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(to right, #E0F7FA, #FFFFFF)', // Gradient background
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
          <Typography
            variant="h4"
            sx={{
              background: 'linear-gradient(to right, #4f758f, #449fdb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            club3
          </Typography>
          <Box>
            <SignedOut>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #4f758f, #449fdb)', // Gradient for button
                  color: '#FFFFFF',
                  '&:hover': {
                    background: 'linear-gradient(to right, #3b5f7a, #307fcc)', // Darker gradient on hover
                  }
                }}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #4f758f, #449fdb)', // Gradient for button
                  color: '#FFFFFF',
                  marginLeft: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(to right, #3b5f7a, #307fcc)', // Darker gradient on hover
                  }
                }}
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton showName />
            </SignedIn>
          </Box>
        </Box>

        {/* Main Content */}
        <Container sx={{ textAlign: 'center', padding: '2rem' }}>
          <Typography
            variant="h2"
            sx={{
              marginBottom: '1rem',
              fontWeight: 'bold',
              fontFamily: 'Poppins, sans-serif',
              // wordSpacing: '2px',
              letterSpacing: '1.2px',
              color: '#3996d4',
            }}
          >
            Unite with Like-Minded People
          </Typography>

          <Typography
            variant="body1"
            sx={{

              textAlign: 'center',
              color: '#000000', // Subheading color
              maxWidth: '600px',
              fontSize: '15px',
              margin: '0 auto',
              marginBottom: '2em',
            }}
          >
            A place to create your own social community based on your interests and location. <br />
            Connect with others to share knowledge, teach, learn, and grow together in a collaborative environment.
          </Typography>

          {/* Search Field */}
          <Box
            sx={{
              maxWidth: 600,
              margin: '0 auto',
              // padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              // borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow for a realistic feel
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search for nearby companions"
              fullWidth
              InputProps={{
                sx: {
                  color: '#000000', // Text color
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent', // Remove default border
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent', // Keep border transparent on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent', // Keep border transparent when focused
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: '#000000' }} /> {/* Dark icon color for contrast */}
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: '#FFFFFF', // White background for the input
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  padding: '8px 12px', // Adequate padding inside the input
                },
                '& .MuiInputBase-input': {
                  padding: '8px 12px', // Padding for input text
                },
              }}
            />
          </Box>

        </Container>

        {/* Map Section */}
        <Container sx={{ padding: '2rem' }}>
          <Box sx={{ height: 400 }}>
            <MapComponent />
          </Box>
        </Container>
      </Box >
    </>
  );
}

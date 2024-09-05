'use client'; // Mark this as a Client Component

import React, { useState, useCallback } from 'react';
import Head from "next/head";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import MapComponent from "./maps/MapComponent";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Button, TextField, InputAdornment, Container, Avatar, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

export default function Home() {
  const router = useRouter(); // Initialize the router for navigation
  const { signOut } = useClerk(); // To handle sign out if needed
  const { user } = useUser(); // Fetch the current user details from Clerk
  const [location, setLocation] = useState('');
  const [interest, setInterest] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);

  // Load the Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Callback for when the Autocomplete component is loaded
  const onLoad = useCallback((autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  // Callback for when a place is selected
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setLocation(place.formatted_address || '');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('api/user-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, interest }),
      })
      if (response.ok) {
        const data = await response.json();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = () => {
    router.push('/sign-in'); // Navigate to sign-in page
  };

  const handleSignUp = () => {
    router.push('/sign-up'); // Navigate to sign-up page
  };

  // Custom Profile Button Logic
  const handleProfileRedirect = () => {
    router.push('/profile'); // Navigate to profile page
  };

  // State for menu anchor element
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Use Gravatar or a similar service to get a circular avatar if no profile image is available
  const avatarUrl = user?.profileImageUrl || `https://robohash.org/${user?.username || 'default'}.png?size=50x50&set=set4`; 

  return (
    <>
      <Head>
        <title>Club3 - Home</title>
        <link rel = "icon"
		          href = "/images/club3-favicon.ico"/>
        <meta name="description" content="Your community, Your connections." />
      </Head>
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',  // Ensures full viewport height initially
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(to right, #E0F7FA, #FFFFFF, #E0F7FA)', // Gradient background
          justifyContent: 'flex-start',
          backgroundRepeat: 'no-repeat',  
          backgroundSize: 'absolute', 
          boxSizing: 'border-box',  
          // overflow: 'hidden', 
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
          <Typography
            variant="h4"
            sx={{
              background: 'linear-gradient(to right, #fcb045, #fd8369)',  
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Club3
          </Typography>
          <Box>
            <SignedOut>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #4f758f, #449fdb)',  
                  color: '#FFFFFF',
                  '&:hover': {
                    background: 'linear-gradient(to right, #3b5f7a, #4a86aa)',  // Darker gradient on hover with similar shades
                  },
                  boxShadow: 'none',  // Removes the default button shadow for a cleaner look
                }}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
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
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </SignedOut>

            <SignedIn>
              {/* Custom Profile Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenuOpen}>
                <Typography sx={{ marginRight: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  {user?.username || 'User'}
                </Typography>
                <Avatar
                  src={avatarUrl}
                  alt={user?.username || 'User'}
                  sx={{ width: 40, height: 40, borderRadius: '50%' }} 
                />
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    color: '#4f758f',  
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',  
                    borderRadius: '0px', 
                  },
                  '& .MuiMenuItem-root': {
                    '&:hover': {
                      backgroundColor: '#fcb045', 
                      color: '#FFFFFF',  
                    },
                  },
                }}
              >
                <MenuItem onClick={handleProfileRedirect}>Profile</MenuItem>
                <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
              </Menu>
            </SignedIn>
          </Box>
        </Box>

        {/* Main Content */}
        <Container sx={{ textAlign: 'center', padding: '2rem' }}>
          <img
            src="/images/club3-custom-logo.svg"  // Replace with the actual path to your logo
            alt="Logo"
            style={{ width: '150px', marginBottom: '1rem' }}  // Adjust size and spacing as needed
          />
          <Typography
            variant="h2"
            sx={{
              marginBottom: '0.5rem',
              fontWeight: 700,
              fontSize: '40px',
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '1.2px',
              background: 'linear-gradient(to right, #4f758f, #449fdb)',  // Gradient effect
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
              marginBottom: '1rem',
            }}
          >
            A place to create your own social community based on your interests and location. <br />
            Connect with others to share knowledge, teach, learn, and grow together in a collaborative environment.
          </Typography>

          {/* Search Field */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center', // Horizontally center items
              alignItems: 'center',
              gap: '16px', // Space between the items
              padding: '16px',
            }}
          >
            {/* Location Search Bar */}
            {isLoaded && (
              <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <TextField
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  variant="outlined"
                  placeholder="Search by Location  Eg: New York"
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
                    // endAdornment: (
                    //   <InputAdornment position="end">
                    //     <SearchIcon sx={{ color: '#000000' }} /> {/* Dark icon color for contrast */}
                    //   </InputAdornment>
                    // ),
                  }}
                  sx={{
                    backgroundColor: '#FFFFFF', // White background for the input
                    borderRadius: '0px',
                    width: '300px', // Set width for consistency
                    '& .MuiOutlinedInput-root': {
                      padding: '8px 12px', // Adequate padding inside the input
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px 12px', // Padding for input text
                    },
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                />
              </Autocomplete>
            )}

            {/* Nearby Companions Search Bar */}
            <TextField
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              variant="outlined"
              placeholder="Search by Interests  Eg: Dance"
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
                // endAdornment: (
                //   <InputAdornment position="end">
                //     <SearchIcon sx={{ color: '#000000' }} /> {/* Dark icon color for contrast */}
                //   </InputAdornment>
                // ),
              }}
              sx={{
                backgroundColor: '#FFFFFF', // White background for the input
                borderRadius: '0px',
                width: '450px', // Set width for consistency
                '& .MuiOutlinedInput-root': {
                  padding: '8px 12px', // Adequate padding inside the input
                },
                '& .MuiInputBase-input': {
                  padding: '8px 12px', // Padding for input text
                },
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            />

            {/* Search Button */}
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(to right, #4f758f, #449fdb)',  
                color: '#FFFFFF', 
                height: '40px',  
                padding: '0 15px',
                fontSize: '18px',
                textTransform: 'none',  
                boxShadow: 'none',  
                '&:hover': {
                  background: 'linear-gradient(to right, #3b5f7a, #4a86aa)',  
                },
              }}
              onClick={handleSubmit}
            >
              Search
            </Button>
          </Box>
        </Container>

        {/* Map Section */}
        <Container sx={{ 
            padding: '1rem',
            maxWidth: '100% !important',         
          }}>
          <Box sx={{ 
              height: '400' ,
            }}>
            {isLoaded ? (
              <MapComponent />
            ) : (
              <div>Loading Map...</div>
            )}
          </Box>
        </Container>
      </Box >
    </>
  );
}

'use client'; // Mark this as a Client Component

import React, { useState, useRef, useEffect } from 'react';
import Head from "next/head";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import MapComponent from './maps/MapComponent';
import MapComponent2 from "./maps/MapComponent2";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Button, TextField, InputAdornment, Container, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
// import { useUser } from '@clerk/clerk-react'


  


export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [defaultLocation, setDefaultLocation] = useState({ lat: 38.627003, lng: -90.199402 }); // Initial default coordinates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);


  const router = useRouter(); // Initialize the router for navigation
  const { signOut } = useClerk(); // To handle sign out if needed
  // const { user } = useUser(); // Fetch the current user details from Clerk

  useEffect(() => {
    const fetchUserData = async () => {
        if (!user) return;
        try {
            const response = await fetch(
                `/api/user-details?email=${encodeURIComponent(
                    user.emailAddresses[0]?.emailAddress
                )}&username=${encodeURIComponent(user.username)}`,
                {
                    method: 'GET',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const data = await response.json();
            // Update default location with the fetched lat/lng
            if (data.lat && data.lng) {
                setDefaultLocation({ lat: data.lat, lng: data.lng });
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to load profile details');
            setLoading(false);
        }
    };

    fetchUserData();
}, [user]); // Depend on clerkUser to refetch if user changes

const handleSearch = () => {
    // Trigger search and pass the searchTerm to the MapComponent
    console.log('Searching for:', searchValue);
    setSearchTerm(searchValue)
    // setSearchTerm(searchTerm)
    // Here you can also trigger any additional logic or state updates
};

const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
};

if (loading) {
    return <div>Loading...</div>;
}

if (error) {
    return <div>{error}</div>;
}

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


  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Use Gravatar or a similar service to get a circular avatar if no profile image is available
  const avatarUrl = user?.profileImageUrl || `https://robohash.org/${user?.username || 'default'}.png?size=50x50&set=set4`; // Use set4 for circular avatars if supported

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
              {/* Custom Profile Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenuOpen}>
                <Typography sx={{ marginRight: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                  {user?.username || 'User'}
                </Typography>
                <Avatar 
                  src={avatarUrl} 
                  alt={user?.username || 'User'} 
                  sx={{ width: 40, height: 40, borderRadius: '50%' }} // Ensuring the avatar is circular
                />
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleProfileRedirect}>Profile</MenuItem>
                <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
              </Menu>
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
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow for a realistic feel
            }}
          >
            {/* <TextField
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
                  {/* </InputAdornment>
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
            /> */} 
            <TextField
                variant="outlined"
                placeholder="Search for nearby companions"
                fullWidth
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
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
                            <IconButton onClick={handleSearch}>
                                <SearchIcon sx={{ color: '#000000' }} /> {/* Dark icon color for contrast */}
                            </IconButton>
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
            {searchTerm && searchTerm.trim() ? (
              // Render MapComponent when searchTerm is present
              <MapComponent2 searchTerm={searchTerm} defaultLocation={defaultLocation} />
            ) : (
              // Render MapComponent2 when searchTerm is not present
              <MapComponent defaultLocation = {defaultLocation} />
            )}
          </Box>
        </Container>
      </Box >
    </>
  );
}

'use client'; // Mark this as a Client Component

import React, { useState, useCallback, useEffect } from 'react';
import Head from "next/head";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import MapComponent from "./maps/MapComponent";
import MapComponent2 from './maps/MapComponent2';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Button, TextField, InputAdornment, Container, Avatar, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import GoogleAnalytics from "./GoogleAnalytics";

const libraries = ['places'];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [defaultLocation, setDefaultLocation] = useState({ lat: 38.627003, lng: -90.199402 }); // Initial default coordinates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const router = useRouter(); // Initialize the router for navigation
  const { signOut } = useClerk(); // To handle sign out if needed
  const { user } = useUser(); // Fetch the current user details from Clerk
  const [location, setLocation] = useState('');
  const [interest, setInterest] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);

  <GoogleAnalytics />

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
            console.log("data in fetch user data",data)
            console.log("data.lat in fetch user data",data.lat)
            console.log("data.lng in fetch user data",data.lng)
            if (data.lat && data.lng) {
              setDefaultLocation({ lat: data.lat, lng: data.lng });
            }
            console.log("default location", defaultLocation)
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to load profile details');
            setLoading(false);
        }
    };

    fetchUserData();
}, [user]);

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

  const handleSearch = async () => {
    // Trigger search and pass the searchTerm to the MapComponent
    console.log('Searching for:', searchValue);
    setSearchTerm(searchValue)

    try {
      const response = await fetch('/api/llm-data', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "input": searchValue }),
      })
        .then(function(response){
          console.log("inside axios post response", response)
          if (response.ok) {
            console.log("ok response from llm",response.json())
          } else {
            
            console.log("inside axios post after NOT ok",response);
          }
        });
    } catch (error) {
      console.error('Error submitting user details:', error);
    }
    // setSearchTerm(searchTerm)
    // Here you can also trigger any additional logic or state updates
};

  const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
          handleSearch();
      }
  };

  // const handleSubmit = async () => {
  //   try {
  //     const response = await fetch('api/user-details', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ location, interest }),
  //     })
  //     if (response.ok) {
  //       const data = await response.json();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
  // const [anchorEl, setAnchorEl] = React.useState(null);

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
          background: 'linear-gradient(to right, #E0F7FA, #FFFFFF, #E0F7FA)', // Gradient background
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
              fontWeight: 700,
              fontSize: '45px',
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
              display: 'flex',
              justifyContent: 'center', // Horizontally center items
              alignItems: 'center',
              gap: '16px', // Space between the items
              padding: '16px',
            }}
          >
            {/* Location Search Bar */}
            {/* {isLoaded && (
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
                      {/* </InputAdornment> */}
                     {/* ), */}
                  {/* }} */}
                  {/* sx={{ */}
                    {/* backgroundColor: '#FFFFFF', // White background for the input
                    borderRadius: '0px',
                    width: '300px', // Set width for consistency
                    '& .MuiOutlinedInput-root': {
                      padding: '8px 12px', // Adequate padding inside the input
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px 12px', // Padding for input text
                    },
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', */}
                  {/* }}
                />
              </Autocomplete>
            )}  */}

            {/* Nearby Companions Search Bar */}
            <TextField
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
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
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: '#000000' }} /> {/* Dark icon color for contrast */}
                  </InputAdornment>
                ),
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
              color="primary"
              sx={{
                height: '40px', // Same height as the text fields
                borderRadius: '0px',
                padding: '0 15px',
                fontSize: '12px',
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Box>
        </Container>

        {/* Map Section */}
        <Container sx={{ padding: '2rem' }}>
          <Box sx={{ height: 400 }}>
            {/*searchTerm && searchTerm.trim() ? (
              // Render MapComponent when searchTerm is present
              <MapComponent2 searchTerm={searchTerm} defaultLocation={defaultLocation} />
            ) : ( 
              // Render MapComponent2 when searchTerm is not present 
              <MapComponent defaultLocation={defaultLocation} />
            )*/}
            {loading
              ? (<div>Loading...</div>)
              : searchTerm && searchTerm.trim() ? (
                // Render MapComponent when searchTerm is present
                <MapComponent2 searchTerm={searchTerm} defaultLocation={defaultLocation} />
              )
              : <MapComponent defaultLocation={defaultLocation} />
            }
          </Box>
        </Container>
      </Box >
    </>
  );
}


<<<<<<< HEAD
// 'use client'; // Mark this as a Client Component


import Head from "next/head";
import MapComponent from "./maps/MapComponent";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Container, Button, TextField, InputAdornment } from '@mui/material';
import Header from './components/Header';


export default function Home() {
 
=======
import React from 'react';
import Head from "next/head";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import MapComponent from "./maps/MapComponent";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, Button, TextField, InputAdornment, Container, Avatar, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter(); // Initialize the router for navigation
  const { signOut } = useClerk(); // To handle sign out if needed
  const { user } = useUser(); // Fetch the current user details from Clerk

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
  const avatarUrl = user?.profileImageUrl || `https://robohash.org/${user?.username || 'default'}.png?size=50x50&set=set4`; // Use set4 for circular avatars if supported
>>>>>>> parent of ed60408 (search)

  return (

    <>
      <Head>
        <title>Third Place - Home</title>
        <meta name="description" content="Connect with others based on your interests and location." />
      </Head>
      <Header/>
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

<<<<<<< HEAD
        </Box>
        <Box sx={{ height: 400 }}>
          <MapComponent />
        </Box>
      </Container>
   </>
=======
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
>>>>>>> parent of ed60408 (search)
  );

}

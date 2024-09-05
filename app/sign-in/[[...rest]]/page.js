// sign-in/[[...rest]]/page.js
'use client';
import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import { Box, Container, Typography, IconButton } from '@mui/material';
import Head from 'next/head';
import HomeIcon from '@mui/icons-material/Home';

export default function SignInPage() {
  return (
    <>
    <Head>
        <title>Club3 - Sign In</title>
        <link rel="icon" href="../images/club3-favicon.ico" />
        <meta name="description" content="Sign Into your Club3 account" />
      
    </Head>
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',  // Centers the main content only
        background: 'linear-gradient(to right, #E0F7FA, #FFFFFF, #E0F7FA)',  
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
          <Image
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

        {/* Right Side: Home Icon */}
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
      </Box>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}> 
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 4, boxShadow: 3 }} 
        >
          <Box width="100%">
            <SignIn 
              routing="path"
              path="/sign-in" 
              afterSignInUrl="/profile" 
            />
          </Box>
        </Box>
      </Container>
    </Box>
    </>
  );
}

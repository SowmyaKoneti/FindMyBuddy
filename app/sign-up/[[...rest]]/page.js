// sign-up/[[...rest]]/page.js
'use client';
import { SignUp } from '@clerk/nextjs';
import { Box, Container } from '@mui/material';
import Head from 'next/head';

export default function SignUpPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #E0F7FA, #FFFFFF)', // Gradient background
        padding: 3,
      }}
    >
      <Head>
        <title>Sign Up - Club3</title>
        <meta name="description" content="Sign up for your Club3 account" />
        <link href="https://fonts.googleapis.com/css2?family=Lobster&family=Dancing+Script&display=swap" rel="stylesheet" />
      </Head>
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 4, boxShadow: 3 }} // Centering and adding shadow
        >
          <Box width="100%">
            <SignUp 
              routing="path" 
              path="/sign-up" 
              afterSignUpUrl="/user-details" // Redirect to /user-details after successful sign-up
              
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

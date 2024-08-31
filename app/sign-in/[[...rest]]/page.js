// sign-in/[[...rest]]/page.js
'use client';
import { SignIn } from '@clerk/nextjs';
import { Box, Container } from '@mui/material';
import Head from 'next/head';

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', // Gradient background matching the landing page theme
        padding: 3,
      }}
    >
      <Head>
        <title>Sign In - Club3</title>
        <meta name="description" content="Sign in to your Club3 account" />
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
            <SignIn 
              routing="path"
              path="/sign-in" // Correctly set path for the catch-all route
              afterSignInUrl="/profile" // Redirect to /profile after successful sign-in
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

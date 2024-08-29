// import Image from "next/image";
'use client'
import React, { createContext } from "react";
import MapComponent from "./maps/MapComponent";
import { Typography, Container, Box } from "@mui/material";
export default function Home() {
  return (
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
  )
}

"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import GoogleAnalytics from "./GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <GoogleAnalytics />
        <body className={inter.className}>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
    
  )
}



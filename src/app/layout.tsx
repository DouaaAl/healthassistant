"use client"
import "./globals.css";
import Nav from "@/components/navbar/nav";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Nav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

import React from 'react'
import NavBar from '@/components/NavBar'
import { StyledHomeBox, HomeContent } from './HomePage.styled'
import { auth } from '@/firebase/auth'
import { signOut } from 'firebase/auth'
import { Typography } from '@mui/material'

const HomePage: React.FC = () => {
  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <StyledHomeBox>
      <NavBar onLogout={handleLogout} />
      <HomeContent>
        <Typography variant="h4" sx={{ textAlign: 'center', mt: 4 }}>
          Welcome to the Car Listings App
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          Use the navigation bar to create or browse car listings.
        </Typography>
      </HomeContent>
    </StyledHomeBox>
  )
}

export default HomePage

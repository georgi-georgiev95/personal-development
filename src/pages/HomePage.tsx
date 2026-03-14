import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useAuth } from '../components/AuthProvider'
import { auth } from '../firebase/auth'
import { signOut } from 'firebase/auth'

const HomePage: React.FC = () => {
  const { user } = useAuth()

  const handleLogout = async () => {
    await signOut(auth)
    // Redirect handled by route guard
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="95vh"
    >
      <Typography variant="h4" mb={2}>
        Welcome, {user?.email || 'User'}!
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  )
}

export default HomePage

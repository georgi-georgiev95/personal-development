import React from 'react'
import { Typography } from '@mui/material'
import NavBar from '../components/NavBar'
import { StyledHomeBox } from './HomePage.styled'
import { useAuth } from '../components/AuthProvider'
import { auth } from '../firebase/auth'
import { signOut } from 'firebase/auth'

const HomePage: React.FC = () => {
  const { user } = useAuth()

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleLogout = async () => {
    await signOut(auth)
    // Redirect handled by route guard
  }

  // Motivational quote state
  const [motivationalQuote, setMotivationalQuote] =
    React.useState<string>('Loading...')

  React.useEffect(() => {
    fetch('https://api.quotable.io/random?tags=motivational')
      .then((res) => res.json())
      .then((data) => setMotivationalQuote(data.content))
      .catch(() =>
        setMotivationalQuote('Stay positive, work hard, make it happen.')
      )
  }, [])

  return (
    <StyledHomeBox>
      <NavBar onLogout={handleLogout} />
      <Typography variant="h4" mb={2}>
        {getGreeting()}, {user?.email || 'User'}!
      </Typography>
      <Typography variant="subtitle1" mb={3} color="text.secondary">
        "{motivationalQuote}"
      </Typography>
    </StyledHomeBox>
  )
}

export default HomePage

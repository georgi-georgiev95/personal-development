import React, { useState } from 'react'
import { Button, TextField, Grid, Alert, InputAdornment } from '@mui/material'
import {
  StyledRegisterBox,
  StyledRegisterCard,
  StyledTitle,
} from './RegisterPage.styled'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import { createUserProfile } from '../services/userService'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await createUserProfile(userCredential.user.uid, email, username)
      navigate('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Registration failed')
    }
  }

  return (
    <StyledRegisterBox>
      <Grid container justifyContent="center">
        <Grid>
          <StyledRegisterCard>
            <StyledTitle>Register</StyledTitle>
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontWeight: 'bold' }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                type="text"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, fontWeight: 'bold', fontSize: 18 }}
              >
                Register
              </Button>
            </form>
            <Button
              component={Link}
              to="/login"
              color="secondary"
              fullWidth
              sx={{ mt: 2, fontWeight: 'bold' }}
            >
              Already have an account? Login
            </Button>
          </StyledRegisterCard>
        </Grid>
      </Grid>
    </StyledRegisterBox>
  )
}

export default RegisterPage

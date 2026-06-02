import React, { useState } from 'react'
import { Button, TextField, Grid, Alert, InputAdornment } from '@mui/material'
import {
  StyledLoginBox,
  StyledLoginCard,
  StyledTitle,
} from './LoginPage.styled'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/shared/config/firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/home')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Login failed')
    }
  }

  return (
    <StyledLoginBox>
      <Grid container justifyContent="center">
        <Grid>
          <StyledLoginCard>
            <StyledTitle>Login</StyledTitle>
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontWeight: 'bold' }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
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
                Login
              </Button>
            </form>
            <Button
              component={Link}
              to="/register"
              color="secondary"
              fullWidth
              sx={{ mt: 2, fontWeight: 'bold' }}
            >
              Don't have an account? Register
            </Button>
          </StyledLoginCard>
        </Grid>
      </Grid>
    </StyledLoginBox>
  )
}

export default LoginPage

import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  Grid,
  Alert,
  InputAdornment,
} from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/auth'
import { Link } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // TODO: Redirect to home page after successful registration
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <Box
      minHeight="95vh"
      sx={{
        background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Grid container justifyContent="center">
        <Grid>
          <Card elevation={6} sx={{ p: 4, width: 380, borderRadius: 3 }}>
            <Typography variant="h4" mb={3} align="center" color="primary">
              Register
            </Typography>
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RegisterPage

import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/shared/config/firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { createUserProfile } from '@/shared/services/userService'
import { getAuthErrorMessage } from '@/shared/utils/authErrors'
import {
  StyledRegisterBox,
  StyledRegisterCard,
  StyledTitle,
  StyledForm,
  InputWrapper,
  InputIcon,
  StyledInput,
  StyledButton,
  StyledLink,
  ErrorMessage,
} from './RegisterPage.styled'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    if (!username.trim()) {
      setError('Username is required')
      return false
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return false
    }
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!password) {
      setError('Password is required')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validate()) return

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await createUserProfile(userCredential.user.uid, email, username.trim())
      navigate('/home')
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledRegisterBox>
      <StyledRegisterCard>
        <StyledTitle>Register</StyledTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <StyledForm onSubmit={handleSubmit}>
          <InputWrapper>
            <InputIcon>👤</InputIcon>
            <StyledInput
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <InputIcon>✉</InputIcon>
            <StyledInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <InputIcon>🔒</InputIcon>
            <StyledInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputWrapper>
          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </StyledButton>
        </StyledForm>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <StyledLink>Already have an account? Login</StyledLink>
        </Link>
      </StyledRegisterCard>
    </StyledRegisterBox>
  )
}

export default RegisterPage

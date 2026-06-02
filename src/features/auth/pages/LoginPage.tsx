import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/shared/config/firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '@/shared/utils/authErrors'
import {
  StyledLoginBox,
  StyledLoginCard,
  StyledTitle,
  StyledForm,
  InputWrapper,
  InputIcon,
  StyledInput,
  StyledButton,
  StyledLink,
  ErrorMessage,
} from './LoginPage.styled'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
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
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/home')
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledLoginBox>
      <StyledLoginCard>
        <StyledTitle>Login</StyledTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <StyledForm onSubmit={handleSubmit}>
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
            {loading ? 'Logging in...' : 'Login'}
          </StyledButton>
        </StyledForm>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <StyledLink>Don't have an account? Register</StyledLink>
        </Link>
      </StyledLoginCard>
    </StyledLoginBox>
  )
}

export default LoginPage

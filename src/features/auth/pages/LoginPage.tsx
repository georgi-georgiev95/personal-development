import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/shared/config/firebase/auth'
import { useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '@/shared/utils/authErrors'
import {
  StyledLoginBox,
  StyledLoginCard,
  TitleBlock,
  Eyebrow,
  StyledTitle,
  StyledForm,
  InputWrapper,
  InputIcon,
  StyledInput,
  StyledButton,
  BottomText,
  StyledLink,
  ErrorMessage,
  FormContent,
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
        <FormContent>
          <TitleBlock>
            <Eyebrow>// login</Eyebrow>
            <StyledTitle>Login</StyledTitle>
          </TitleBlock>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <StyledForm onSubmit={handleSubmit}>
            <InputWrapper>
              <InputIcon>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </InputIcon>
              <StyledInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <InputIcon>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 018 0v4" />
                </svg>
              </InputIcon>
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
          <BottomText>
            Don&apos;t have an account?{' '}
            <StyledLink to="/register">Register</StyledLink>
          </BottomText>
        </FormContent>
      </StyledLoginCard>
    </StyledLoginBox>
  )
}

export default LoginPage

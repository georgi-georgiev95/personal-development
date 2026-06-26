import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/shared/config/firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { createUserProfile } from '@/entities/user'
import { getAuthErrorMessage } from '@/shared/utils/authErrors'
import { GlowingOrb } from '@/shared/components/GlowingOrb'
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
  Row,
  StyledSelect,
  OrbContainer,
  FormContent,
} from './RegisterPage.styled'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    if (!firstName.trim()) {
      setError('First name is required')
      return false
    }
    if (!lastName.trim()) {
      setError('Last name is required')
      return false
    }
    if (!username.trim()) {
      setError('Username is required')
      return false
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return false
    }
    if (!day || !month || !year) {
      setError('Please complete your date of birth')
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
      const age = new Date().getFullYear() - Number(year)
      await createUserProfile(
        userCredential.user.uid,
        email,
        username.trim(),
        firstName.trim(),
        lastName.trim(),
        age
      )
      navigate('/home')
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const personIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )

  const emailIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  )

  const lockIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )

  return (
    <StyledRegisterBox>
      <StyledRegisterCard>
        <OrbContainer>
          <GlowingOrb />
        </OrbContainer>
        <FormContent>
          <StyledTitle>Register</StyledTitle>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <StyledForm onSubmit={handleSubmit}>
            <Row>
              <InputWrapper>
                <InputIcon>{personIcon}</InputIcon>
                <StyledInput
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <InputIcon>{personIcon}</InputIcon>
                <StyledInput
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </InputWrapper>
            </Row>
            <InputWrapper>
              <InputIcon>{personIcon}</InputIcon>
              <StyledInput
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </InputWrapper>
            <Row>
              <StyledSelect
                value={day}
                onChange={(e) => setDay(e.target.value)}
                required
              >
                <option value="" disabled>
                  Day
                </option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </StyledSelect>
              <StyledSelect
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
              >
                <option value="" disabled>
                  Month
                </option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </StyledSelect>
              <StyledSelect
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="" disabled>
                  Year
                </option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </StyledSelect>
            </Row>
            <InputWrapper>
              <InputIcon>{emailIcon}</InputIcon>
              <StyledInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <InputIcon>{lockIcon}</InputIcon>
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
        </FormContent>
      </StyledRegisterCard>
    </StyledRegisterBox>
  )
}

export default RegisterPage

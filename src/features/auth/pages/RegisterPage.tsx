import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/shared/config/firebase/auth'
import { useNavigate } from 'react-router-dom'
import { createUserProfile } from '@/entities/user'
import { getAuthErrorMessage } from '@/shared/utils/authErrors'
import {
  StyledRegisterBox,
  StyledRegisterCard,
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
  Row,
  StyledSelect,
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  )

  const emailIcon = (
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
  )

  const lockIcon = (
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
  )

  return (
    <StyledRegisterBox>
      <StyledRegisterCard>
        <FormContent>
          <TitleBlock>
            <Eyebrow>// register</Eyebrow>
            <StyledTitle>Create account</StyledTitle>
          </TitleBlock>
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
          <BottomText>
            Already have an account? <StyledLink to="/login">Login</StyledLink>
          </BottomText>
        </FormContent>
      </StyledRegisterCard>
    </StyledRegisterBox>
  )
}

export default RegisterPage

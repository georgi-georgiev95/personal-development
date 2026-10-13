import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'

const { register, createProfile } = vi.hoisted(() => ({
  register: vi.fn(),
  createProfile: vi.fn(),
}))
vi.mock('firebase/auth', () => ({ createUserWithEmailAndPassword: register }))
vi.mock('@/shared/config/firebase/auth', () => ({ auth: {} }))
vi.mock('@/entities/user', () => ({ createUserProfile: createProfile }))

it('rejects mismatched passwords before creating an account and allows a corrected confirmation', async () => {
  const user = userEvent.setup()
  register.mockResolvedValue({ user: { uid: 'test-user' } })
  createProfile.mockResolvedValue(undefined)
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  )
  await user.type(screen.getByLabelText('First name'), 'Test')
  await user.type(screen.getByLabelText('Last name'), 'User')
  await user.type(screen.getByLabelText('Username'), 'testuser')
  await user.selectOptions(screen.getByLabelText('Day of birth'), '1')
  await user.selectOptions(screen.getByLabelText('Month of birth'), '1')
  await user.selectOptions(screen.getByLabelText('Year of birth'), '2000')
  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.type(
    screen.getByLabelText('Password', { exact: true }),
    'test-password'
  )
  await user.type(
    screen.getByLabelText('Repeat password'),
    'different-password'
  )
  await user.click(screen.getByRole('button', { name: 'Register' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match')
  expect(register).not.toHaveBeenCalled()
  expect(createProfile).not.toHaveBeenCalled()
  await user.clear(screen.getByLabelText('Repeat password'))
  await user.type(screen.getByLabelText('Repeat password'), 'test-password')
  await user.click(screen.getByRole('button', { name: 'Register' }))
  expect(register).toHaveBeenCalledOnce()
  expect(register).toHaveBeenCalledWith({}, 'test@example.com', 'test-password')
  expect(createProfile).toHaveBeenCalledOnce()
})

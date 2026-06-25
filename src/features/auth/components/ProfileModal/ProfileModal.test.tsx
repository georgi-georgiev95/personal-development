import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockUpdateUserProfile = vi.fn()
const mockGetUserProfile = vi.fn()
vi.mock('@/entities/user', () => ({
  updateUserProfile: (...args: unknown[]) => mockUpdateUserProfile(...args),
  getUserProfile: (...args: unknown[]) => mockGetUserProfile(...args),
}))

const mockUseAuth = vi.fn()
vi.mock('@/features/auth/components/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

import { ProfileModal } from '.'

const sampleProfile = {
  uid: 'uid-1',
  email: 'test@example.com',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  age: 25,
  photoURL: undefined,
  createdAt: null,
  lastLogin: null,
  postCount: 0,
  commentCount: 0,
}

describe('ProfileModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: { uid: 'uid-1', email: 'test@example.com', displayName: 'John' },
      loading: false,
      signOut: vi.fn(),
    })
    mockGetUserProfile.mockResolvedValue(sampleProfile)
  })

  it('is closed by default', () => {
    render(<ProfileModal />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens when the trigger button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProfileModal />)
    await user.click(
      screen.getByRole('button', { name: /open profile settings/i })
    )
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('fetches the user profile on open', async () => {
    const user = userEvent.setup()
    render(<ProfileModal />)
    await user.click(
      screen.getByRole('button', { name: /open profile settings/i })
    )
    await screen.findByRole('dialog')
    expect(mockGetUserProfile).toHaveBeenCalledWith('uid-1')
  })

  it('pre-fills all fields from the profile', async () => {
    const user = userEvent.setup()
    render(<ProfileModal />)
    await user.click(
      screen.getByRole('button', { name: /open profile settings/i })
    )
    await screen.findByRole('dialog')
    expect(await screen.findByLabelText(/first name/i)).toHaveValue('John')
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe')
    expect(screen.getByLabelText(/username/i)).toHaveValue('johndoe')
    expect(screen.getByLabelText(/age/i)).toHaveValue(25)
  })

  it('disables save when unchanged', async () => {
    const user = userEvent.setup()
    render(<ProfileModal />)
    await user.click(
      screen.getByRole('button', { name: /open profile settings/i })
    )
    await screen.findByRole('dialog')
    expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled()
  })

  it('enables save when a field changes', async () => {
    const user = userEvent.setup()
    render(<ProfileModal />)
    await user.click(
      screen.getByRole('button', { name: /open profile settings/i })
    )
    await screen.findByRole('dialog')
    const input = await screen.findByLabelText(/first name/i)
    await user.clear(input)
    await user.type(input, 'Jane')
    expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled()
  })

  it('calls updateUserProfile with all fields on save', async () => {
    const user = userEvent.setup()
    mockUpdateUserProfile.mockResolvedValue(undefined)
    render(<ProfileModal />)
    await user.click(
      screen.getByRole('button', { name: /open profile settings/i })
    )
    await screen.findByRole('dialog')
    const input = await screen.findByLabelText(/first name/i)
    await user.clear(input)
    await user.type(input, 'Jane')
    await user.click(screen.getByRole('button', { name: /save changes/i }))
    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalledWith('uid-1', {
        firstName: 'Jane',
        lastName: 'Doe',
        username: 'johndoe',
        age: 25,
      })
    })
  })

  it('closes after a successful save', async () => {
    const user = userEvent.setup()
    mockUpdateUserProfile.mockResolvedValue(undefined)
    render(<ProfileModal />)
    await user.click(
      screen.getByRole('button', { name: /open profile settings/i })
    )
    await screen.findByRole('dialog')
    const input = await screen.findByLabelText(/first name/i)
    await user.clear(input)
    await user.type(input, 'Jane')
    await user.click(screen.getByRole('button', { name: /save changes/i }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('closes when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<ProfileModal />)
    await user.click(
      screen.getByRole('button', { name: /open profile settings/i })
    )
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when the overlay is clicked', async () => {
    const user = userEvent.setup()
    render(<ProfileModal />)
    await user.click(
      screen.getByRole('button', { name: /open profile settings/i })
    )
    await screen.findByRole('dialog')
    await user.click(screen.getByTestId('modal-overlay'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders nothing to the DOM when closed (portal cleanup)', () => {
    const { container } = render(<ProfileModal />)
    expect(container.querySelector('[data-modal]')).not.toBeInTheDocument()
  })
})

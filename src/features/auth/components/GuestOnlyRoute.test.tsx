import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute'

vi.mock('@/features/auth/components/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'signed-in-user' }, loading: false }),
}))

it('preserves the guest draft when auth updates before the login form redirects', async () => {
  function Planner() {
    const { state } = useLocation()
    return <p>{state?.resumePlan?.draft.objective}</p>
  }

  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/login',
          state: {
            resumePlan: { draft: { objective: 'Edited guest draft' } },
          },
        },
      ]}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <p>Login</p>
            </GuestOnlyRoute>
          }
        />
        <Route path="/" element={<p>Home</p>} />
        <Route path="/workspace/tasks/new" element={<Planner />} />
      </Routes>
    </MemoryRouter>
  )

  expect(await screen.findByText('Edited guest draft')).toBeInTheDocument()
})

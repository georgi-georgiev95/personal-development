import React from 'react'
import NavBar from '@/components/NavBar'
import { CreateListing } from '@/components/CreateListing'
import { auth } from '@/firebase/auth'
import { signOut } from 'firebase/auth'
import styled from 'styled-components'
import { theme } from '@/theme'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${theme.colors.background};
`

const PageContent = styled.main`
  flex: 1;
  padding: calc(56px + ${theme.spacing.lg}) ${theme.spacing.md}
    ${theme.spacing.lg};

  @media (max-width: 768px) {
    padding: calc(48px + ${theme.spacing.md}) ${theme.spacing.sm}
      ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: calc(48px + ${theme.spacing.sm}) ${theme.spacing.xs}
      ${theme.spacing.sm};
  }
`

const CreateListingPage: React.FC = () => {
  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <PageContainer>
      <NavBar onLogout={handleLogout} />
      <PageContent>
        <CreateListing />
      </PageContent>
    </PageContainer>
  )
}

export default CreateListingPage

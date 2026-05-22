import React from 'react'
import { OptimusRobot } from '@/components/OptimusRobot'
import { PageWrapper, NavBar, AppTitle } from './PlaygroundPage.styles'
import { Link } from 'react-router-dom'

const OptimusPage: React.FC = () => {
  return (
    <PageWrapper>
      <NavBar>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <AppTitle>Home</AppTitle>
        </Link>
      </NavBar>
      <main style={{ padding: '24px' }}>
        <OptimusRobot />
      </main>
    </PageWrapper>
  )
}

export default OptimusPage

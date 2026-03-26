import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useViewModel } from '@/core/hooks'
import { TOKENS } from '@/core/di'
import { useAuth } from '@/components/useAuth'
import type { NavigationWidgetVM } from './NavigationWidget.viewmodel'
import type {
  NavigationWidgetState,
  NavigationWidgetProps,
} from './NavigationWidget.types'
import {
  NavBar,
  AppTitle,
  NavActions,
  AuthStatus,
  NavButton,
  CataloguePanel,
  CatalogueItem,
  CatalogueItemLabel,
  CatalogueItemDesc,
} from './NavigationWidget.styles'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/auth'

export const NavigationWidget: React.FC<NavigationWidgetProps> = ({
  appTitle = 'Widget Playground',
}) => {
  const vm = useViewModel<NavigationWidgetVM>(TOKENS.NavigationWidgetViewModel)
  const { user } = useAuth()
  const [state, setLocalState] = useState<NavigationWidgetState>(vm.getState())

  useEffect(() => {
    const unsubscribe = vm.subscribe(() => {
      setLocalState({ ...vm.getState() })
    })
    return () => {
      unsubscribe()
      vm.dispose()
    }
  }, [vm])

  const handleLogout = async (): Promise<void> => {
    await signOut(auth)
  }

  return (
    <NavBar>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <AppTitle>{appTitle}</AppTitle>
      </Link>

      <NavActions>
        {user && <AuthStatus>{user.displayName ?? user.email}</AuthStatus>}

        <NavButton onClick={() => vm.toggleCatalogue()}>+ Add Widget</NavButton>

        {user ? (
          <NavButton onClick={handleLogout}>Logout</NavButton>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <NavButton as="span">Login</NavButton>
          </Link>
        )}
      </NavActions>

      {state.catalogueOpen && (
        <CataloguePanel>
          {vm.catalogue
            .filter((entry) => !entry.requiresAuth || !!user)
            .map((entry) => (
              <CatalogueItem
                key={entry.id}
                onClick={() => vm.addWidget(entry.id)}
              >
                <CatalogueItemLabel>{entry.label}</CatalogueItemLabel>
                <CatalogueItemDesc>{entry.description}</CatalogueItemDesc>
              </CatalogueItem>
            ))}
        </CataloguePanel>
      )}
    </NavBar>
  )
}

import React from 'react'
import { NavBarContainer, NavBarLeft, NavBarRight } from './NavBar.styled'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { IconButton, Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useProfile } from './ProfileProvider'

interface NavBarProps {
  onLogout: () => void
}

const NavBar: React.FC<NavBarProps> = ({ onLogout }) => {
  const navigate = useNavigate()
  const { photoURL } = useProfile()

  return (
    <NavBarContainer>
      <NavBarLeft>
        <IconButton
          color="primary"
          onClick={() => navigate('/')}
          aria-label="Home"
        >
          <HomeIcon />
        </IconButton>
      </NavBarLeft>
      <NavBarRight>
        <IconButton
          color="primary"
          onClick={() => navigate('/profile')}
          aria-label="Profile"
        >
          {photoURL ? (
            <Avatar
              src={photoURL}
              alt="Profile"
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <PersonIcon />
          )}
        </IconButton>
        <IconButton color="secondary" onClick={onLogout} aria-label="Logout">
          <LogoutIcon />
        </IconButton>
      </NavBarRight>
    </NavBarContainer>
  )
}

export default NavBar

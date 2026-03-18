import React from 'react'
import { NavBarContainer, NavBarLeft, NavBarRight } from './NavBar.styled'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import { IconButton, Avatar, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useProfile } from './useProfile'

interface NavBarProps {
  onLogout: () => void
}

const NavBar: React.FC<NavBarProps> = ({ onLogout }) => {
  const navigate = useNavigate()
  const { photoURL } = useProfile()

  return (
    <NavBarContainer>
      <NavBarLeft>
        <Tooltip title="Home">
          <IconButton
            color="primary"
            onClick={() => navigate('/')}
            aria-label="Home"
          >
            <HomeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="All Listings">
          <IconButton
            color="primary"
            onClick={() => navigate('/listings')}
            aria-label="All Listings"
          >
            <DirectionsCarIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Create Listing">
          <IconButton
            color="primary"
            onClick={() => navigate('/create-listing')}
            aria-label="Create Listing"
          >
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      </NavBarLeft>
      <NavBarRight>
        <Tooltip title="Profile">
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
        </Tooltip>
        <Tooltip title="Logout">
          <IconButton color="secondary" onClick={onLogout} aria-label="Logout">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </NavBarRight>
    </NavBarContainer>
  )
}

export default NavBar

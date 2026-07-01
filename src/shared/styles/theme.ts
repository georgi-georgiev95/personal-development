// Custom Theme type for direct usage
export type Theme = {
  colors: {
    primary: string
    secondary: string
    background: string
    gradient: string
    gradientAlt: string
    text: string
    textSecondary: string
    textInverse: string
    textOnAccent: string
    navbar: string
    icon: string
    border: string
    cardBg: string
    error: string
    success: string
    accent: string
    accentHover: string
    muted: string
    overlay: string
    spinner: string
    surface: string
    starPrimary: string
    starSecondary: string
    starGlow: string
    heroText: string
    heroTagline: string
    errorBg: string
  }
  fontSizes: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  boxShadow: {
    sm: string
    md: string
    card: string
  }
  layout: {
    navHeight: string
    navHeightTablet: string
    navHeightMobile: string
    cardMaxWidth: string
    containerMaxWidth: string
  }
  font: {
    family: string
    familyMono: string
  }
  letterSpacing: {
    tight: string
    normal: string
    wide: string
  }
  lineHeight: {
    tight: string
    normal: string
    relaxed: string
  }
  transition: {
    fast: string
    normal: string
  }
  breakpoint: {
    tablet: string
    mobile: string
  }
  zIndex: {
    nav: string
    overlay: string
  }
}

export const theme: Theme = {
  colors: {
    primary: '#2dd4bf',
    secondary: '#a78bfa',
    background: '#030304',
    gradient: 'linear-gradient(120deg, #2dd4bf 0%, #0f766e 100%)',
    gradientAlt: 'linear-gradient(135deg, #2dd4bf 0%, #0f766e 100%)',
    text: '#f5f5f4',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    textInverse: '#f5f5f4',
    textOnAccent: '#04201c',
    navbar: 'rgba(3, 3, 4, 0.9)',
    icon: '#2dd4bf',
    border: 'rgba(255, 255, 255, 0.15)',
    cardBg: '#0a0d0f',
    error: '#f87171',
    success: '#4ade80',
    accent: '#2dd4bf',
    accentHover: '#5eead4',
    muted: 'rgba(255, 255, 255, 0.4)',
    overlay: 'rgba(3, 3, 4, 0.8)',
    spinner: '#2dd4bf',
    surface: '#0a0d0f',
    starPrimary: '#ffffff',
    starSecondary: '#fbbf24',
    starGlow: 'rgba(45, 212, 191, 0.4)',
    heroText: '#f5f5f4',
    heroTagline: 'rgba(255, 255, 255, 0.75)',
    errorBg: 'rgba(248, 113, 113, 0.08)',
  },
  fontSizes: {
    xs: '0.625rem',
    sm: '0.6875rem',
    md: '0.71875rem',
    lg: '1.125rem',
    xl: '1.3125rem',
    xxl: '1.3125rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '2px',
    md: '3px',
    lg: '6px',
    xl: '8px',
    full: '50%',
  },
  boxShadow: {
    sm: '0 1px 4px rgba(0, 0, 0, 0.4)',
    md: '0 4px 16px rgba(0, 0, 0, 0.5)',
    card: '0 2px 12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
  },
  layout: {
    navHeight: '88px',
    navHeightTablet: '72px',
    navHeightMobile: '60px',
    cardMaxWidth: '380px',
    containerMaxWidth: '1200px',
  },
  font: {
    family: "'JetBrains Mono', ui-monospace, monospace",
    familyMono: "'JetBrains Mono', ui-monospace, monospace",
  },
  letterSpacing: {
    tight: '-0.21px',
    normal: '0',
    wide: '1.54px',
  },
  lineHeight: {
    tight: '1',
    normal: '1.25',
    relaxed: '1.5',
  },
  transition: {
    fast: '0.2s ease',
    normal: '0.3s ease-out',
  },
  breakpoint: {
    tablet: '768px',
    mobile: '480px',
  },
  zIndex: {
    nav: '100',
    overlay: '10',
  },
}

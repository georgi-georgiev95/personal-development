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
    primary: '#f97316',
    secondary: '#FF6584',
    background: '#000000',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    gradientAlt: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
    text: '#22223b',
    textSecondary: '#4a4e69',
    textInverse: '#e5e7eb',
    navbar: '#ffffff',
    icon: '#f97316',
    border: '#e0e0e0',
    cardBg: '#ffffff',
    error: '#f44336',
    success: '#4caf50',
    accent: '#f97316',
    accentHover: '#ea580c',
    muted: '#9ca3af',
    overlay: 'rgba(0, 0, 0, 0.6)',
    spinner: '#fbbf24',
    surface: '#111827',
    starPrimary: '#f97316',
    starSecondary: '#fbbf24',
    starGlow: '#ea580c',
    heroText: '#ffffff',
    heroTagline: 'rgba(255, 255, 255, 0.7)',
    errorBg: '#fef2f2',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '50%',
  },
  boxShadow: {
    sm: '0 2px 8px rgba(31, 38, 135, 0.1)',
    md: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
    card: '0 4px 24px rgba(0, 0, 0, 0.12)',
  },
  layout: {
    navHeight: '64px',
    navHeightTablet: '56px',
    navHeightMobile: '48px',
    cardMaxWidth: '380px',
    containerMaxWidth: '1200px',
  },
  font: {
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    familyMono: "'SF Mono', 'Fira Code', 'Fira Mono', monospace",
  },
  letterSpacing: {
    tight: '-0.5px',
    normal: '0',
    wide: '0.5px',
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

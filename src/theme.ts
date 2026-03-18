// Custom Theme type for direct usage
export type Theme = {
  colors: {
    primary: string
    secondary: string
    background: string
    gradient: string
    text: string
    textSecondary: string
    navbar: string
    icon: string
    border: string
    cardBg: string
    error: string
    success: string
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
  borderRadius: string
  boxShadow: {
    sm: string
    md: string
  }
}

export const theme: Theme = {
  colors: {
    primary: '#6C63FF',
    secondary: '#FF6584',
    background: '#f5f6fa',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    text: '#22223b',
    textSecondary: '#4a4e69',
    navbar: '#fff',
    icon: '#6C63FF',
    border: '#e0e0e0',
    cardBg: '#ffffff',
    error: '#f44336',
    success: '#4caf50',
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
  borderRadius: '8px',
  boxShadow: {
    sm: '0 2px 8px rgba(31, 38, 135, 0.1)',
    md: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
}

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
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    background: 'var(--color-background)',
    gradient: 'var(--color-gradient)',
    gradientAlt: 'var(--color-gradient-alt)',
    text: 'var(--color-text)',
    textSecondary: 'var(--color-text-secondary)',
    textInverse: 'var(--color-text-inverse)',
    textOnAccent: 'var(--color-text-on-accent)',
    navbar: 'var(--color-navbar)',
    icon: 'var(--color-icon)',
    border: 'var(--color-border)',
    cardBg: 'var(--color-card-bg)',
    error: 'var(--color-error)',
    success: 'var(--color-success)',
    accent: 'var(--color-accent)',
    accentHover: 'var(--color-accent-hover)',
    muted: 'var(--color-muted)',
    overlay: 'var(--color-overlay)',
    spinner: 'var(--color-spinner)',
    surface: 'var(--color-surface)',
    starPrimary: 'var(--color-star-primary)',
    starSecondary: 'var(--color-star-secondary)',
    starGlow: 'var(--color-star-glow)',
    heroText: 'var(--color-hero-text)',
    heroTagline: 'var(--color-hero-tagline)',
    errorBg: 'var(--color-error-bg)',
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
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    full: '50%',
  },
  boxShadow: {
    sm: '0 1px 3px rgba(36, 29, 23, 0.08)',
    md: '0 8px 24px rgba(36, 29, 23, 0.12)',
    card: '0 12px 36px rgba(36, 29, 23, 0.1)',
  },
  layout: {
    navHeight: '80px',
    navHeightTablet: '72px',
    navHeightMobile: '68px',
    cardMaxWidth: '380px',
    containerMaxWidth: '1200px',
  },
  font: {
    family:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    familyMono: "'JetBrains Mono', ui-monospace, monospace",
  },
  letterSpacing: {
    tight: '-0.03em',
    normal: '0',
    wide: '0.08em',
  },
  lineHeight: {
    tight: '1.08',
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

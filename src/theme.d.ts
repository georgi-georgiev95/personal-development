import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string
      secondary: string
      background: string
      gradient: string
      text: string
      textSecondary: string
      navbar: string
      icon: string
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
    }
    boxShadow: {
      sm: string
      md: string
    }
  }
}

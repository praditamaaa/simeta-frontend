export const theme = {
  colors: {
    primary: '#0D1131', // Dark blue from mockup
    secondary: '#D99131', // Orange from mockup
    accent: '#D99131',
    background: '#0D1131', // Most screens have dark background
    surface: '#D99131', // Used for cards/containers in برخی screens
    text: {
      primary: '#FFFFFF',
      secondary: '#BDC1CA',
      inverse: '#0D1131',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    border: 'rgba(255, 255, 255, 0.1)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  roundness: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  fonts: {
    thin: 'Poppins-Thin',
    extraLight: 'Poppins-ExtraLight',
    light: 'Poppins-Light',
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    extraBold: 'Poppins-ExtraBold',
    black: 'Poppins-Black',
  },
  typography: {
    h1: {
      fontSize: 32,
      fontFamily: 'Poppins-Bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Poppins-SemiBold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      lineHeight: 24,
    },
    bodySemiBold: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      lineHeight: 24,
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
    },
  },
};

export type Theme = typeof theme;

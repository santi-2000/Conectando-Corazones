import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Dimensiones de pantalla
export const ScreenDimensions = {
  width,
  height,
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 414,
  isLargeDevice: width >= 414,
};

// Breakpoints para responsive design PWA
export const Breakpoints = {
  mobile: 320,    // iPhone SE
  mobileLarge: 375, // iPhone 12/13/14
  mobileXL: 414,   // iPhone Plus
  tablet: 768,     // iPad
  tabletLarge: 1024, // iPad Pro
  desktop: 1200,   // Desktop
  largeDesktop: 1440
};

// Espaciado consistente
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Tamaños de fuente responsive
export const FontSizes = {
  xs: ScreenDimensions.isSmallDevice ? 12 : 14,
  sm: ScreenDimensions.isSmallDevice ? 14 : 16,
  md: ScreenDimensions.isSmallDevice ? 16 : 18,
  lg: ScreenDimensions.isSmallDevice ? 18 : 20,
  xl: ScreenDimensions.isSmallDevice ? 20 : 24,
  xxl: ScreenDimensions.isSmallDevice ? 24 : 28,
};

// Alturas de componentes
export const ComponentHeights = {
  button: Platform.OS === 'ios' ? 50 : 48,
  input: Platform.OS === 'ios' ? 50 : 48,
  header: Platform.OS === 'ios' ? 44 : 56,
};

// Border radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

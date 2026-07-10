import { useWindowDimensions } from "react-native";

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  // Define breakpoints
  const isDesktop = width >= 1200;
  const isTablet = width >= 768 && width < 1200;
  const isMiniTab = width >= 500 && width < 768;
  const isMobile = width < 500;

  return {
    width,
    height,
    isDesktop,
    isTablet,
    isMiniTab,
    isMobile,
  };
}

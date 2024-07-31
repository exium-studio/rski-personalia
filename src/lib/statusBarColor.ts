import { useColorMode } from "@chakra-ui/react";

export default function useStatusBarColor(
  lightColor: string,
  darkColor: string
) {
  const { colorMode } = useColorMode();

  const setStatusBarColor = () => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        colorMode === "dark" ? darkColor : lightColor
      );
    } else {
      console.error('Elemen <meta name="theme-color"> tidak ditemukan.');
    }
  };

  return setStatusBarColor;
}

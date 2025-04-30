import { useColorModeValue } from "@chakra-ui/react";

export const useContentBgColor = () => {
  return useColorModeValue("#f8f8f8", "#151515");
};

export const useTableStripedColor = () => {
  return useColorModeValue("#fbfbfb", "#161616");
};

export const useBodyColor = () => {
  return useColorModeValue("white", "#191919");
};

export const useWhiteDarkColor = () => {
  return useColorModeValue("white", "dark");
};

export const useLightDarkColor = () => {
  return useColorModeValue("white", "#191919");
};

export const useDarkLightColor = () => {
  return useColorModeValue("dark", "white");
};

export const useErrorColor = () => {
  return useColorModeValue("#E53E3E", "#FC8181");
};

export const useWarningColor = () => {
  return useColorModeValue("#C05621", "#FBD38D");
};

export const useErrorAlphaColor = () => {
  return useColorModeValue("red.50", "rgba(254, 178, 178, 0.12)");
};

export const useWarningAlphaColor = () => {
  return useColorModeValue(
    "rgba(251, 211, 141, 0.12)",
    "rgba(251, 211, 141, 0.12)"
  );
};

export const statusKaryawanColorScheme = {
  tetap: "orange",
  Tetap: "orange",
  kontrak: "purple",
  Kontrak: "purple",
  magang: "green",
  Magang: "green",
  training: "green",
  Training: "green",
};

export const colorSchemes = [
  "orange",
  "purple",
  "green",
  "pink",
  "teal",
  "blue",
  "pink",
  "red",
];

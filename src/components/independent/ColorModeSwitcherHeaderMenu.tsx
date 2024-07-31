import {
  Box,
  HStack,
  Icon,
  IconButtonProps,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiMoonLine } from "@remixicon/react";
import * as React from "react";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeSwitcherHeaderMenu: React.FC<ColorModeSwitcherProps> = (
  props
) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");

  return (
    <HStack
      h={"45px"}
      px={4}
      w={"100%"}
      className="btn"
      cursor={"pointer"}
      justify={"flex-start"}
      fontWeight={400}
      onClick={toggleColorMode}
    >
      <Icon as={RiMoonLine} fontSize={18} />
      <Text>Mode Gelap</Text>
      <Box
        w={"6px"}
        h={"6px"}
        borderRadius={"full"}
        bg={text === "dark" ? "var(--divider2)" : "green.400"}
        ml={"auto"}
      />
    </HStack>
  );
};

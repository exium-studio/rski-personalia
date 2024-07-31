import { Box, BoxProps } from "@chakra-ui/react";

export default function Skeleton(props?: BoxProps) {
  return (
    <Box
      className={"skeleton"}
      w={"100%"}
      h={"50px"}
      bg={"var(--divider2)"}
      borderRadius={8}
      {...props}
    />
  );
}

import { useColorModeValue } from "@chakra-ui/react";

export default function RequiredForm() {
  const color = useColorModeValue("#E53E3E", "#FC8181");

  return <span style={{ color: color, marginLeft: 2 }}>*</span>;
}

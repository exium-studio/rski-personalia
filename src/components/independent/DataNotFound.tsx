import { Text, TextProps } from "@chakra-ui/react";

interface Props extends TextProps {}

export default function DataNotFound({ ...props }: Props) {
  return (
    <Text textAlign={"center"} opacity={0.6} {...props}>
      Data tidak ditemukan
    </Text>
  );
}

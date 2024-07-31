import { Icon, StackProps, Text, VStack } from "@chakra-ui/react";
import { RiSearchLine } from "@remixicon/react";

interface Props extends StackProps {
  label?: string;
}

export default function NotFound({ label, ...props }: Props) {
  return (
    <VStack flex={1} justify={"center"} opacity={0.2} {...props}>
      <Icon as={RiSearchLine} fontSize={80} />
      <Text textAlign={"center"} fontWeight={600}>
        {label || "Data tidak ditemukan"}
      </Text>
    </VStack>
  );
}

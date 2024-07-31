import { Button, ButtonProps, Icon, Text, VStack } from "@chakra-ui/react";
import { RiErrorWarningLine, RiRefreshLine } from "@remixicon/react";

interface Props extends ButtonProps {
  loading: boolean;
  retry: () => void;
}

export default function Retry({ loading, retry, ...props }: Props) {
  return (
    <VStack p={4}>
      <Icon opacity={0.2} as={RiErrorWarningLine} fontSize={80} />
      <Text opacity={0.2} textAlign={"center"} fontWeight={600} mb={2}>
        Maaf, data gagal dimuat
      </Text>

      <Button
        className="btn-solid clicky"
        isLoading={loading}
        onClick={retry}
        leftIcon={<Icon as={RiRefreshLine} />}
        {...props}
      >
        Muat Ulang
      </Button>
    </VStack>
  );
}

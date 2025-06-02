import { Center, HStack, Icon, Text } from "@chakra-ui/react";
import { RiArrowDownLine, RiArrowUpLine } from "@remixicon/react";
import formatTime from "../../lib/formatTime";

const JadwalItem = (props: any) => {
  // Props
  const { jam_from, jam_to } = props;

  return (
    <HStack gap={4}>
      <HStack>
        <Center borderRadius={"full"} bg={"var(--p500a4)"} p={1}>
          <Icon as={RiArrowUpLine} color={"p.500"} />
        </Center>
        <Text>{formatTime(jam_from)}</Text>
      </HStack>

      <HStack>
        <Center borderRadius={"full"} bg={"var(--reda)"} p={1}>
          <Icon as={RiArrowDownLine} color={"red.400"} />
        </Center>
        <Text>{formatTime(jam_to)}</Text>
      </HStack>
    </HStack>
  );
};

export default JadwalItem;

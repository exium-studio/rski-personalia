import { HStack, Text, Th } from "@chakra-ui/react";
import { addDays } from "date-fns";
import formatDate from "../../lib/formatDate";

interface Props {
  range_tgl: {
    from: Date;
    to: Date;
  };
}

export default function JadwalTabelHeader({ range_tgl }: Props) {
  const headers = [];
  let currentDate = range_tgl.from;

  while (currentDate <= range_tgl.to) {
    headers.push(
      <Th
        key={currentDate.toISOString()}
        whiteSpace={"nowrap"}
        borderBottom={"none !important"}
        p={0}
      >
        <HStack
          borderBottom={"1px solid var(--divider3)"}
          px={4}
          py={3}
          h={"52px"}
        >
          <Text>
            {formatDate(currentDate.toISOString(), {
              weekday: "short",
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </Text>
        </HStack>
      </Th>
    );
    currentDate = addDays(currentDate, 1);
  }

  return <>{headers}</>;
}

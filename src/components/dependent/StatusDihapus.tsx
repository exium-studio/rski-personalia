import { Box, Text, Tooltip } from "@chakra-ui/react";
import formatDate from "../../lib/formatDate";
import BooleanBadge from "./BooleanBadge";
import { useErrorColor } from "../../constant/colors";

interface Props {
  data: Date | string;
}
export default function StatusDihapus({ data }: Props) {
  // SX
  const errorColor = useErrorColor();

  return (
    <Tooltip
      openDelay={500}
      label={
        <>
          <Text>Dihapus {formatDate(data)}</Text>

          <Text opacity={0.4} mt={2}>
            Data yang dihapus tidak akan muncul di daftar opsi, namun akan tetap
            menjadi legacy data
          </Text>
        </>
      }
      placement="right"
    >
      <Box>
        <BooleanBadge
          w={"100px"}
          data={!!data}
          trueValue="Dihapus"
          falseValue=""
          color={data ? errorColor : ""}
          bg={"var(--divider)"}
        />
      </Box>
    </Tooltip>
  );
}

import { BadgeProps } from "@chakra-ui/react";
import BooleanBadge from "./BooleanBadge";

interface Props extends BadgeProps {
  data: boolean | number | null;
}

export default function StatusAktifBadge({ data, ...props }: Props) {
  // SX

  return (
    <BooleanBadge
      data={data}
      borderRadius={"full"}
      textAlign={"center"}
      trueValue="Aktif"
      nullValue="Belum Aktif"
      falseValue="Tidak Aktif"
      colorScheme={data ? "green" : data === null ? "gray" : "red"}
      {...props}
    />
  );
}

import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: boolean | number | null;
}

export default function StatusAktifBadge({ data, ...props }: Props) {
  // SX

  return (
    <Badge
      borderRadius={"full"}
      textAlign={"center"}
      colorScheme={data ? "green" : data === 0 ? "gray" : "red"}
      {...props}
    >
      {data ? "Aktif" : data === 0 ? "Belum Aktif" : "Tidak Aktif"}
    </Badge>
  );
}

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
      colorScheme={data === 2 ? "green" : data === 1 ? "orange" : "red"}
      {...props}
    >
      {data === 2 ? "Aktif" : data === 1 ? "Belum Aktif" : "Tidak Aktif"}
    </Badge>
  );
}

import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: number;
}

export default function StatusApprovalBadge({ data, ...props }: Props) {
  return (
    <Badge
      colorScheme={data === 1 ? "orange" : data === 2 ? "green" : "red"}
      borderRadius={"full"}
      textAlign={"center"}
      {...props}
    >
      {data === 1 ? "Menunggu" : data === 2 ? "Disetujui" : "Ditolak"}
    </Badge>
  );
}

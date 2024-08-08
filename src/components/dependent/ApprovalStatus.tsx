import { Badge } from "@chakra-ui/react";

interface Props {
  data: number;
}

export default function ApprovalStatus({ data }: Props) {
  return (
    <Badge
      colorScheme={data === 1 ? "orange" : data === 2 ? "green" : "red"}
      borderRadius={"full"}
    >
      {data === 1 ? "Menunggu" : data === 2 ? "Disetujui" : "Ditolak"}
    </Badge>
  );
}

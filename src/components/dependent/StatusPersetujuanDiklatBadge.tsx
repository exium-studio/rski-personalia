import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
}

export default function StatusPersetujuanDiklatBadge({
  data,
  ...props
}: Props) {
  let colorScheme;
  // let label = "";
  switch (data.id) {
    case 1:
      colorScheme = "orange";
      // label = "Menunggu Disetujui 1";
      break;
    case 2:
      colorScheme = "green";
      // label = "Disetujui 1";
      break;
    case 3:
      colorScheme = "red";
      // label = "Ditolak 1";
      break;
    case 4:
      colorScheme = "green";
      // label = "Disetujui 2";
      break;
    case 5:
      colorScheme = "red";
      // label = "Ditolak 2";
      break;
  }

  return (
    <Badge
      colorScheme={colorScheme}
      borderRadius={"full"}
      textAlign={"center"}
      {...props}
    >
      {data.label || "Invalid"}
    </Badge>
  );
}

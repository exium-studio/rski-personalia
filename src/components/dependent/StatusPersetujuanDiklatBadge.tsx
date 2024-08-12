import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
}

export default function StatusPersetujuanDiklatBadge({
  data,
  ...props
}: Props) {
  let colorScheme;
  switch (data.id) {
    case 1:
      colorScheme = "orange";
      break;
    case 2:
    case 4:
      colorScheme = "green";
      break;
    case 3:
    case 5:
      colorScheme = "red";
  }

  return (
    <Badge
      colorScheme={colorScheme}
      borderRadius={"full"}
      textAlign={"center"}
      {...props}
    >
      {data?.label || "Invalid"}
    </Badge>
  );
}

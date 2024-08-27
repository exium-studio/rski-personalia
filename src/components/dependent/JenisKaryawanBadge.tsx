import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: boolean | number;
}

export default function JenisKaryawanBadge({ data, ...props }: Props) {
  // SX

  return (
    <Badge
      borderRadius={"full"}
      textAlign={"center"}
      colorScheme={data === 1 ? "cyan" : data === 0 ? "orange" : ""}
      {...props}
    >
      {data === 1 ? "Shift" : data === 0 ? "Non-Shift" : ""}
    </Badge>
  );
}

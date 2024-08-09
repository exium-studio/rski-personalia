import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
}

export default function StatusPermintaanCutiBadge({ data, ...props }: Props) {
  return (
    <Badge
      colorScheme={data.id === 1 ? "orange" : data.id === 2 ? "green" : "red"}
      borderRadius={"full"}
      textAlign={"center"}
      {...props}
    >
      {data.label}
    </Badge>
  );
}

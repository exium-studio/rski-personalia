import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
}

export default function JenisProfesiBadge({ data, ...props }: Props) {
  return (
    <Badge
      textAlign={"center"}
      borderRadius={"full"}
      colorScheme={data ? "p" : "gray"}
      {...props}
    >
      {data ? "Medis" : "Non-Medis"}
    </Badge>
  );
}

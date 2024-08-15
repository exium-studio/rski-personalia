import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
}

export default function StatusPublikasiPenggajian({ data, ...props }: Props) {
  return (
    <Badge
      colorScheme={data.id === 2 ? "green" : "red"}
      borderRadius={"full"}
      textAlign={"center"}
      {...props}
    >
      {data.label}
    </Badge>
  );
}

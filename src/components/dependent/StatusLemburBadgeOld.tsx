import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
}

export default function StatusLemburBadgeOld({ data, ...props }: Props) {
  return (
    <Badge
      colorScheme={
        data?.id === 1 ? "orange" : data?.id === 2 ? "green" : "gray"
      }
      borderRadius={"full"}
      textAlign={"center"}
      {...props}
    >
      {data?.label || "INVALID"}
    </Badge>
  );
}

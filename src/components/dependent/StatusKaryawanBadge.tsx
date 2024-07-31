import { Badge, BadgeProps } from "@chakra-ui/react";
import { statusKaryawanColorScheme } from "../../constant/colors";

interface Props extends BadgeProps {
  data: string;
}

export default function StatusKaryawanBadge({ data, ...props }: Props) {
  return (
    <Badge
      textAlign={"center"}
      borderRadius={"full"}
      colorScheme={
        //@ts-ignore
        statusKaryawanColorScheme[data]
      }
      {...props}
    >
      {data}
    </Badge>
  );
}

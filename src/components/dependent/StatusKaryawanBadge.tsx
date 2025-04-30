import { Badge, BadgeProps } from "@chakra-ui/react";
import { colorSchemes } from "../../constant/colors";

interface Props extends BadgeProps {
  data: any;
}

export default function StatusKaryawanBadge({ data, ...props }: Props) {
  return (
    data && (
      <Badge
        textAlign={"center"}
        borderRadius={"full"}
        colorScheme={colorSchemes[data?.id % colorSchemes.length]}
        {...props}
      >
        {data?.label}
      </Badge>
    )
  );
}

import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
}

export default function StatusKaryawanBadge({ data, ...props }: Props) {
  let colorScheme;
  switch (data?.id) {
    case 1:
      colorScheme = "purple";
      break;
    case 2:
      colorScheme = "blue";
      break;
    case 3:
      colorScheme = "green";
      break;
  }

  return (
    data && (
      <Badge
        textAlign={"center"}
        borderRadius={"full"}
        colorScheme={colorScheme}
        {...props}
      >
        {data?.label}
      </Badge>
    )
  );
}

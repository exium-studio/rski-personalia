import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data?: any;
}
export default function StatusTagihanBadge({ data, ...props }: Props) {
  const color = () => {
    switch (data.id) {
      case 1:
        return "orange";
      case 2:
        return "red";
      case 3:
        return "green";
    }
  };
  return (
    <Badge
      colorScheme={color()}
      borderRadius={"full"}
      textAlign={"center"}
      {...props}
    >
      {data?.label}
    </Badge>
  );
}

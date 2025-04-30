import { Badge, BadgeProps } from "@chakra-ui/react";
import { colorSchemes } from "../../constant/colors";

interface Props extends BadgeProps {
  data: any;
}
const KategoriStatusKaryawanBadge = (props: Props) => {
  // Props
  const { data, ...restProps } = props;

  return (
    <Badge
      // w={"120px"}
      borderRadius={"full"}
      textAlign={"center"}
      colorScheme={colorSchemes[data?.id % colorSchemes.length]}
      {...restProps}
    >
      {data?.label || "Kosong"}
    </Badge>
  );
};

export default KategoriStatusKaryawanBadge;

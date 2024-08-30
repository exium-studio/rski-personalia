import { BoxProps, Tooltip, TooltipProps } from "@chakra-ui/react";
import CContainer from "./CContainer";

interface Props extends TooltipProps {
  children: any;
  permission?: boolean;
  boxProps?: BoxProps;
}

export default function PermissionTooltip({
  children,
  permission,
  boxProps,
  ...props
}: Props) {
  return (
    <Tooltip label={!permission && "Tidak ada akses"} {...props}>
      <CContainer {...boxProps}>{children}</CContainer>
    </Tooltip>
  );
}

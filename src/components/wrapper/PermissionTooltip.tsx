import { Box, BoxProps, Tooltip, TooltipProps } from "@chakra-ui/react";

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
      <Box {...boxProps}>{children}</Box>
    </Tooltip>
  );
}

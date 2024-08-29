import { Box, Tooltip, TooltipProps } from "@chakra-ui/react";

interface Props extends TooltipProps {
  children: any;
  permission?: boolean;
}

export default function PermissionTooltip({
  children,
  permission,
  ...props
}: Props) {
  return (
    <Tooltip label={!permission && "Tidak ada akses"} {...props}>
      <Box>{children}</Box>
    </Tooltip>
  );
}

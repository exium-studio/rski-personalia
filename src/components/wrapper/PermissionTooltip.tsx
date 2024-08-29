import { Box, Tooltip } from "@chakra-ui/react";

interface Props {
  children?: any;
  permission?: boolean;
}

export default function PermissionTooltip({ children, permission }: Props) {
  return (
    <Tooltip label={!permission && "Tidak ada akses"}>
      <Box>{children}</Box>
    </Tooltip>
  );
}

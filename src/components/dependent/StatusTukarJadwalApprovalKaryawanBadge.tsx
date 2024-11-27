import { Badge, BadgeProps, Box } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
  alasan?: string;
}

export default function StatusTukarJadwalApprovalKaryawanBadge({
  data,
  alasan,
  ...props
}: Props) {
  const colorScheme = () => {
    switch (data) {
      default:
        return {
          colorScheme: "green",
          label: "Disetujui",
        };
      case 1:
        return {
          colorScheme: "orange",
          label: "Menunggu",
        };
      case 3:
        return {
          colorScheme: "red",
          label: "Ditolak",
        };
    }
  };

  return (
    <Box>
      <Badge
        colorScheme={colorScheme().colorScheme}
        borderRadius={"full"}
        textAlign={"center"}
        {...props}
      >
        {colorScheme().label}
      </Badge>
    </Box>
  );
}

import { Badge, BadgeProps, Box, Text, Tooltip } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
  alasan?: string;
}

export default function StatusVerifikasiBadge({
  data,
  alasan,
  ...props
}: Props) {
  const colorScheme = () => {
    switch (data?.id) {
      default:
        return "green";
      case 1:
        return "orange";
      case 3:
        return "red";
    }
  };

  return (
    <Tooltip
      label={
        alasan && (
          <>
            <Text>Alasan Ditolak</Text>

            <Text opacity={0.4} mt={2}>
              {alasan}
            </Text>
          </>
        )
      }
      placement="right"
    >
      <Box>
        <Badge
          colorScheme={colorScheme()}
          borderRadius={"full"}
          textAlign={"center"}
          {...props}
        >
          {data?.label}
        </Badge>
      </Box>
    </Tooltip>
  );
}

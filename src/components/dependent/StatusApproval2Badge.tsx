import { Badge, BadgeProps, Box, Text, Tooltip } from "@chakra-ui/react";

interface Props extends BadgeProps {
  data: any;
  alasan?: string;
}

export default function StatusApproval2Badge({
  data,
  alasan,
  ...props
}: Props) {
  const colorScheme = () => {
    switch (data.id) {
      default:
        return "green";
      case 1:
      case 2:
        return "orange";
      case 3:
      case 5:
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
          {data.label}
        </Badge>
      </Box>
    </Tooltip>
  );
}

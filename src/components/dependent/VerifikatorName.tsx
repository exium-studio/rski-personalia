import { HStack, Icon, Text, Tooltip } from "@chakra-ui/react";
import { RiShieldCheckFill } from "@remixicon/react";
import { iconSize } from "../../constant/sizes";
import { ReactNode } from "react";

interface Props {
  nama?: string;
  verification?: boolean | null;
  icon?: ReactNode;
  label?: string;
}
export default function VerifikatorName({
  verification,
  nama,
  icon,
  label,
}: Props) {
  return (
    <Tooltip
      label={
        label ||
        `${
          verification === null
            ? ""
            : verification
            ? "Diverifikasi oleh"
            : "Ditolak oleh"
        } ${nama || "Super Admin"}`
      }
      openDelay={500}
    >
      <HStack maxW={"86px"}>
        {icon || (
          <Icon
            as={RiShieldCheckFill}
            fontSize={iconSize}
            color={
              verification === null
                ? "var(--divider-text)"
                : verification
                ? "green.400"
                : "red.400"
            }
          />
        )}
        <Text className="noofline-1" opacity={verification === null ? 0.4 : 1}>
          {nama || "Super Admin"}
        </Text>
      </HStack>
    </Tooltip>
  );
}

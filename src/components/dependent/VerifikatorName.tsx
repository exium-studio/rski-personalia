import { HStack, Icon, Text, Tooltip } from "@chakra-ui/react";
import { RiShieldCheckFill } from "@remixicon/react";
import { iconSize } from "../../constant/sizes";

interface Props {
  nama?: string;
  verification?: boolean | null;
}
export default function VerifikatorName({ verification, nama }: Props) {
  return (
    <Tooltip
      label={`${
        verification === null
          ? ""
          : verification
          ? "Diverifikasi oleh"
          : "Ditolak oleh"
      } ${nama || "Verifikator"}`}
      openDelay={500}
    >
      <HStack maxW={"80px"}>
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
        <Text className="noofline-1" opacity={verification === null ? 0.4 : 1}>
          {nama || "Verifikator"}
        </Text>
      </HStack>
    </Tooltip>
  );
}

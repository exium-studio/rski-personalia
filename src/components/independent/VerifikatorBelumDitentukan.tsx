import { HStack, Icon, Text, Tooltip } from "@chakra-ui/react";
import { RiShieldKeyholeLine } from "@remixicon/react";
import { iconSize } from "../../constant/sizes";

export default function VerifikatorBelumDitentukan() {
  return (
    <Tooltip label={"Verifikator Belum Ditentukan"} openDelay={500}>
      <HStack opacity={0.4}>
        <Icon as={RiShieldKeyholeLine} fontSize={iconSize} />
        <Text className="noofline-1">{"Kosong"}</Text>
      </HStack>
    </Tooltip>
  );
}

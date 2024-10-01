import { Center, Icon, Tooltip } from "@chakra-ui/react";
import { RiShieldKeyholeLine } from "@remixicon/react";

export default function VerifikatorBelumDitentukan() {
  return (
    <Tooltip label={"Verifikator Belum Ditentukan"}>
      <Center>
        <Icon as={RiShieldKeyholeLine} fontSize={24} />
      </Center>
    </Tooltip>
  );
}

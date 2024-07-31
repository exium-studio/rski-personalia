import { HStack, Icon, Image, Text } from "@chakra-ui/react";
import { RiFileLine } from "@remixicon/react";
import { Link } from "react-router-dom";
import { iconSize } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import ViewPhotoModalDisclosure from "./ViewPhotoModalDisclosure";

export default function PerubahanDataRender({ column, data }: any) {
  switch (column) {
    default:
      return <Text>{data}</Text>;
    case "foto_profil":
      return (
        <ViewPhotoModalDisclosure src={data}>
          <Image
            maxW={"32px"}
            src={data}
            aspectRatio={1}
            objectFit={"cover"}
            borderRadius={"full"}
          />
        </ViewPhotoModalDisclosure>
      );
    case "tgl_lahir":
      return <Text whiteSpace={"nowrap"}>{formatDate(data)}</Text>;
    case "golongan_darah":
    case "agama":
      return <Text whiteSpace={"nowrap"}>{data.label}</Text>;
    case "tinggi_badan":
      return <Text whiteSpace={"nowrap"}>{formatNumber(data)} cm</Text>;
    case "ktp":
    case "bpjsksh":
    case "bpjsktk":
    case "ijazah":
    case "sertifikat_kompetensi":
      return (
        <Link to={data}>
          <HStack p={4} borderRadius={8} align={"center"}>
            <Icon as={RiFileLine} fontSize={iconSize} />
            <Text fontSize={12} mt={2} noOfLines={1} opacity={0.4}>
              {data}
            </Text>
          </HStack>
        </Link>
      );
  }
}

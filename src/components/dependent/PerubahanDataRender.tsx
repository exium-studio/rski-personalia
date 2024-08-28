import {
  Button,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiFileLine } from "@remixicon/react";
import { Link } from "react-router-dom";
import { iconSize } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import ViewPhotoModalDisclosure from "./ViewPhotoModalDisclosure";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";
import useBackOnClose from "../../hooks/useBackOnClose";

interface Props {
  data: any;
  index: number;
}

const ListKeluargaModal = ({ data, index }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`anggota-keluarga-modal-${index}`, isOpen, onOpen, onClose);

  return (
    <>
      <Button colorScheme="ap" variant={"ghost"} className="clicky">
        Lihat
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Anggota Keluarga"} />
          </ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button className="btn-solid clicky">Mengerti</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function PerubahanDataRender({ column, data, index }: any) {
  switch (column) {
    default:
      return <Text>Invalid</Text>;
    case "keluarga":
      return <ListKeluargaModal data={data} index={index} />;
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

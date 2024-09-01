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
import CContainer from "../wrapper/CContainer";
import FlexLine from "../independent/FlexLine";

interface Props {
  data: any;
  index: number;
}

const ListKeluargaModal = ({ data, index }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`anggota-keluarga-modal-${index}`, isOpen, onOpen, onClose);

  return (
    <>
      <Button
        colorScheme="ap"
        variant={"ghost"}
        className="clicky"
        onClick={onOpen}
      >
        Lihat
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Anggota Keluarga"} />
          </ModalHeader>
          <ModalBody className="scrollY">
            {data?.map((anggota: any, i: number) => (
              <CContainer
                key={i}
                borderBottom={
                  i !== data?.length - 1 ? "1px solid var(--divider)" : ""
                }
                pt={i !== 0 ? 4 : 0}
                pb={i !== data?.length - 1 ? 4 : 0}
                gap={2}
              >
                <Text fontWeight={600}>{anggota?.nama_keluarga}</Text>
                <HStack>
                  <Text opacity={0.4}>Hubungan Keluarga</Text>
                  <FlexLine />
                  <Text>{anggota.hubungan}</Text>
                </HStack>
                <HStack>
                  <Text opacity={0.4}>Status Hidup</Text>
                  <FlexLine />
                  <Text>{anggota.status_hidup ? "Hidup" : "Meniggal"}</Text>
                </HStack>
                <HStack>
                  <Text opacity={0.4}>Pekerjaan</Text>
                  <FlexLine />
                  <Text>{anggota.pekerjaan}</Text>
                </HStack>
                <HStack>
                  <Text opacity={0.4}>Nomor Telepon</Text>
                  <FlexLine />
                  <Text>{anggota.no_hp}</Text>
                </HStack>
                <HStack>
                  <Text opacity={0.4}>Email</Text>
                  <FlexLine />
                  <Text>{anggota.email}</Text>
                </HStack>
              </CContainer>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button className="btn-solid clicky" w={"100%"}>
              Mengerti
            </Button>
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
    case "data keluarga":
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
    case "jenis_kelamin":
      return (
        <Text whiteSpace={"nowrap"}>{data ? "Laki - laki" : "Perempuan"}</Text>
      );
    case "golongan_darah":
    case "agama":
      return <Text whiteSpace={"nowrap"}>{data.label}</Text>;
    case "tinggi_badan":
    case "berat_badan":
      return <Text whiteSpace={"nowrap"}>{formatNumber(data)} cm</Text>;
    case "tempat_lahir":
    case "no_hp":
    case "nik_ktp":
    case "no_kk":
    case "alamat":
    case "no_ijazah":
    case "tahun_lulus":
    case "gelar_depan":
      return <Text>{typeof data === "string" ? data : "Invalid"}</Text>;
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

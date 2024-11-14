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
import TabelElipsisText from "./TabelElipsisText";
import NoData from "../independent/NoData";
import BooleanBadge from "./BooleanBadge";

interface DatakeluargaProps {
  data: any;
  index: number;
}
const ListKeluargaModal = ({ data, index }: DatakeluargaProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`anggota-keluarga-modal-${index}`, isOpen, onOpen, onClose);

  // console.log(data);

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
          <ModalBody className="scrollY" gap={4}>
            {data?.length > 0 && (
              <>
                {data?.map((anggota: any, i: number) => (
                  <CContainer
                    key={i}
                    borderBottom={
                      i !== data?.length - 1 ? "1px solid var(--divider)" : ""
                    }
                    // pt={i !== 0 ? 4 : 0}
                    // pb={i !== data?.length - 1 ? 4 : 0}
                    p={4}
                    borderRadius={8}
                    gap={2}
                    bg={"var(--divider)"}
                  >
                    <Text fontWeight={600}>{anggota?.nama_keluarga}</Text>
                    <HStack>
                      <Text opacity={0.4}>Hubungan Keluarga</Text>
                      <FlexLine />
                      <Text textAlign={"right"}>{anggota?.hubungan}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Status Hidup</Text>
                      <FlexLine />
                      <Text>
                        {anggota?.status_hidup ? "Hidup" : "Meninggal"}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Pendidikan Terakhir</Text>
                      <FlexLine />
                      <Text textAlign={"right"}>
                        {anggota?.pendidikan_terakhir?.label}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Pekerjaan</Text>
                      <FlexLine />
                      <Text textAlign={"right"}>{anggota.pekerjaan}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Nomor Telepon</Text>
                      <FlexLine />
                      <Text textAlign={"right"}>{anggota.no_hp}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Email</Text>
                      <FlexLine />
                      <Text textAlign={"right"}>{anggota.email}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Tanggungan BPJS</Text>
                      <FlexLine />
                      <BooleanBadge
                        data={anggota.is_bpjs}
                        trueValue="Ditanggung"
                        falseValue="Tidak Ditanggung"
                      />
                    </HStack>
                  </CContainer>
                ))}
              </>
            )}

            {(!data || data?.length === 0) && <NoData minH={"300px"} />}
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-solid clicky"
              w={"100%"}
              onClick={backOnClose}
            >
              Mengerti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function PerubahanDataRender({ column, data, index }: any) {
  // console.log(column, data);
  switch (column) {
    default:
      return <Text>Invalid</Text>;
    case "pendidikan_terakhir":
      return <Text>{data ? data?.label : "-"}</Text>;
    case "data keluarga":
    case "Data Keluarga":
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
      return <Text whiteSpace={"nowrap"}>{data ? formatDate(data) : "-"}</Text>;
    case "jenis_kelamin":
      return (
        <Text whiteSpace={"nowrap"}>{data ? "Laki - laki" : "Perempuan"}</Text>
      );
    case "alamat":
    case "asal_sekolah":
      return <TabelElipsisText data={data} textAlign={"center"} />;
    case "golongan_darah":
    case "agama":
      return <Text whiteSpace={"nowrap"}>{data.label}</Text>;
    case "tinggi_badan":
      return <Text whiteSpace={"nowrap"}>{formatNumber(data)} cm</Text>;
    case "berat_badan":
      return <Text whiteSpace={"nowrap"}>{formatNumber(data)} kg</Text>;
    case "tempat_lahir":
    case "no_hp":
    case "nik_ktp":
    case "no_kk":
    case "no_ijazah":
    case "tahun_lulus":
    case "gelar_depan":
    case "gelar_belakang":
    case "riwayat_penyakit":
      return (
        <Text>
          {typeof data === "string" || typeof data === "number" ? data : "-"}
        </Text>
      );
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

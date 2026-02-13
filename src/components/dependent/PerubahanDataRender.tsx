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
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatNumber from "../../lib/formatNumber";
import FlexLine from "../independent/FlexLine";
import NoData from "../independent/NoData";
import CContainer from "../wrapper/CContainer";
import BooleanBadge from "./BooleanBadge";
import DisclosureHeader from "./DisclosureHeader";
import TabelElipsisText from "./TabelElipsisText";
import ViewPhotoModalDisclosure from "./ViewPhotoModalDisclosure";

interface DatakeluargaProps {
  data: any;
  dataCompare?: any;
  index: number;
}
const ListKeluargaModal = ({ data, dataCompare, index }: DatakeluargaProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`anggota-keluarga-modal-${index}`, isOpen, onOpen, onClose);

  const fields = [
    { label: "Hubungan Keluarga", get: (a: any) => a?.hubungan },
    {
      label: "Status Hidup",
      get: (a: any) => (a?.status_hidup ? "Aktif" : "Tidak Aktif"),
    },
    {
      label: "Jenis Kelamin",
      get: (a: any) => (a?.jenis_kelamin ? "Laki-laki" : "Perempuan"),
    },
    { label: "Tempat Lahir", get: (a: any) => a?.tempat_lahir },
    {
      label: "Tanggal Lahir",
      get: (a: any) => formatDate(a?.tgl_lahir),
    },
    {
      label: "Pendidikan Terakhir",
      get: (a: any) => a?.pendidikan_terakhir?.label,
    },
    {
      label: "Agama",
      get: (a: any) =>
        a?.agama?.label ||
        a?.kategori_agama?.label ||
        a?.kategori_agama_id?.label,
    },
    {
      label: "Golongan Darah",
      get: (a: any) =>
        a?.darah?.label ||
        a?.kategori_darah?.label ||
        a?.kategori_darah_id?.label,
    },
    { label: "Pekerjaan", get: (a: any) => a?.pekerjaan },
    { label: "Nomor Telepon", get: (a: any) => a?.no_hp },
    { label: "Email", get: (a: any) => a?.email },
    { label: "No. Rekam Medis", get: (a: any) => a?.no_rm },
    { label: "Tanggungan BPJS", get: (a: any) => a?.is_bpjs },
    { label: "Sudah Menikah", get: (a: any) => a?.is_menikah },
  ];

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
            {data?.length > 0 &&
              data.map((anggota: any, i: number) => {
                const compare = dataCompare?.[i];

                return (
                  <CContainer
                    key={i}
                    borderBottom={
                      i !== data.length - 1 ? "1px solid var(--divider)" : ""
                    }
                    p={4}
                    borderRadius={8}
                    gap={2}
                    bg={"var(--divider)"}
                  >
                    <Text fontWeight={600}>{anggota?.nama_keluarga}</Text>

                    {fields.map((field, idx) => {
                      const value = field.get(anggota);
                      const compareValue = field.get(compare);
                      const isDiff = compare && value !== compareValue;

                      const isBooleanField =
                        field.label === "Tanggungan BPJS" ||
                        field.label === "Sudah Menikah";

                      return (
                        <HStack key={idx}>
                          <Text
                            fontWeight={isDiff ? "semibold" : "normal"}
                            opacity={isDiff ? 1 : 0.4}
                          >
                            {field.label}
                          </Text>

                          <FlexLine />

                          {isBooleanField ? (
                            <BooleanBadge
                              data={value}
                              trueValue={
                                field.label === "Tanggungan BPJS"
                                  ? "Ditanggung"
                                  : "Menikah"
                              }
                              falseValue={
                                field.label === "Tanggungan BPJS"
                                  ? "Tidak Ditanggung"
                                  : "Belum Menikah"
                              }
                            />
                          ) : (
                            <Text
                              color={isDiff ? "p.500" : ""}
                              fontWeight={isDiff ? "semibold" : "normal"}
                            >
                              {value}
                            </Text>
                          )}
                        </HStack>
                      );
                    })}
                  </CContainer>
                );
              })}

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

export default function PerubahanDataRender({
  column,
  data,
  dataCompare,
  index,
}: any) {
  // console.log(column, data);
  switch (column) {
    default:
      return <Text>Invalid</Text>;
    case "pendidikan_terakhir":
      return <Text>{data ? data?.label : "-"}</Text>;
    case "data keluarga":
    case "Data Keluarga":
      return (
        <ListKeluargaModal
          data={data}
          dataCompare={dataCompare}
          index={index}
        />
      );
    case "foto_profil":
      return (
        <ViewPhotoModalDisclosure src={data?.path}>
          <Image
            w={"32px"}
            h={"32px"}
            src={data?.path}
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
      return <TabelElipsisText data={data || "-"} textAlign={"center"} />;
    case "golongan_darah":
    case "agama":
      return <Text whiteSpace={"nowrap"}>{data?.label || "-"}</Text>;
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

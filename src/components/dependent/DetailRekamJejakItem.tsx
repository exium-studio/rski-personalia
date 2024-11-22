import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RiArrowRightLine, RiCircleFill } from "@remixicon/react";
import { useState } from "react";
import perubahanDataKolom from "../../constant/perubahanDataKolom";
import formatDate from "../../lib/formatDate";
import CContainer from "../wrapper/CContainer";
import BooleanBadge from "./BooleanBadge";
import PerubahanDataRender from "./PerubahanDataRender";
import SmallLink from "./SmallLink";

const PerubahanDataItem = ({ data }: { data: any }) => {
  return (
    <CContainer gap={4}>
      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Kolom
        </Text>
        {/* @ts-ignore */}
        <Text fontWeight={500}>{perubahanDataKolom[data?.kolom]}</Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Tanggal Diproses
        </Text>
        <Text fontWeight={500}>{formatDate(data?.updated_at)}</Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Data Pengajuan
        </Text>

        <HStack>
          <Box flex={1}>
            <PerubahanDataRender
              column={data?.kolom}
              data={data?.original_data}
            />
          </Box>

          <Icon as={RiArrowRightLine} mx={2} />

          <Box flex={1}>
            <PerubahanDataRender
              column={data?.kolom}
              data={data?.updated_data}
            />
          </Box>
        </HStack>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Status
        </Text>
        <BooleanBadge
          data={data?.status_perubahan}
          trueValue="Disetujui"
          falseValue="Ditolak"
        />
      </HStack>
    </CContainer>
  );
};

const TransferKaryanItem = ({ data }: { data: any }) => {
  return (
    <CContainer gap={4}>
      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Tanggal Mulai
        </Text>
        <Text fontWeight={500}>{formatDate(data?.tgl_mulai)}</Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Unit Kerja Asal
        </Text>
        <Text fontWeight={500}>{data?.unit_kerja_asal?.nama_unit}</Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Unit Kerja Tujuan
        </Text>
        <Text fontWeight={500}>
          {data?.unit_kerja_tujuan?.nama_unit || "-"}
        </Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Jabatan Asal
        </Text>
        <Text fontWeight={500}>{data?.jabatan_asal?.nama_jabatan}</Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Jabatan Tujuan
        </Text>
        <Text fontWeight={500}>
          {data?.jabatan_tujuan?.nama_jabatan || "-"}
        </Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Hak Akses (Role) Asal
        </Text>
        <Text fontWeight={500}>{data?.role_asal?.name}</Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Hak Akses (Role) Tujuan
        </Text>
        <Text fontWeight={500}>{data?.role_tujuan?.name || "-"}</Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Kelompok Gaji Asal
        </Text>
        <Text fontWeight={500}>{data?.kelompok_gaji_asal?.nama_kelompok}</Text>
      </HStack>

      <HStack>
        <Text minW={"200px"} opacity={0.6}>
          Kelompok Gaji Tujuan
        </Text>
        <Text fontWeight={500}>
          {data?.kelompok_gaji_tujuan?.nama_kelompok || "-"}
        </Text>
      </HStack>

      <HStack align={"start"}>
        <Text minW={"200px"} opacity={0.6}>
          Alasan
        </Text>
        <Text fontWeight={500}>{data?.alasan}</Text>
      </HStack>

      <HStack align={"start"}>
        <Text minW={"200px"} opacity={0.6}>
          Dokumen
        </Text>
        <SmallLink to={data?.dokumen} className="btn-apa">
          Lihat
        </SmallLink>
      </HStack>
    </CContainer>
  );
};

interface Props {
  dataList: any[];
  data: any;
  index: number;
}

export default function DetailRekamJejakItem({ dataList, data, index }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 1 Perubahan Data
  // 2 Mutasi Karyawan
  // 3 Promosi Karyawan
  // 4 Feedback

  return (
    <HStack align={"stretch"} gap={8}>
      {/* The Line */}
      <VStack>
        <Box h={"16px"} w={"1px"} bg={"var(--divider3)"} />

        <Center p={1} borderRadius={"full"} bg={"var(--p500a3)"}>
          <Icon as={RiCircleFill} color={"p.500"} />
        </Center>

        <Box
          flex={1}
          w={"1px"}
          bg={"var(--divider3)"}
          opacity={index === dataList?.length - 1 ? 0 : 1}
        />
      </VStack>

      {/* Content */}
      <Box
        w={"100%"}
        transition={"200ms"}
        pt={2}
        pb={index === data.length - 1 ? 0 : 2}
      >
        <Accordion allowMultiple>
          <AccordionItem
            border={"none"}
            borderRadius={8}
            bg={"var(--divider)"}
            overflow={"clip"}
          >
            <AccordionButton
              as={HStack}
              cursor={"pointer"}
              justify={"space-between"}
              py={4}
              px={6}
              className="btn"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              // _expanded={{ bg: "var(--divider) !important" }}
            >
              <HStack>
                <Text fontWeight={600} fontSize={18}>
                  {data.kategori_rekam_jejak.label}
                </Text>
                <Text>-</Text>
                <Text>{formatDate(data.created_at)}</Text>
              </HStack>
              <AccordionIcon ml={4} />
            </AccordionButton>

            <AccordionPanel px={6} py={5}>
              {data.kategori_rekam_jejak.id === 1 && (
                <PerubahanDataItem data={data.content} />
              )}

              {(data.kategori_rekam_jejak.id === 2 ||
                data.kategori_rekam_jejak.id === 3) && (
                <TransferKaryanItem data={data.content} />
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </HStack>
  );
}

import {
  Avatar,
  Box,
  BoxProps,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import NoData from "../independent/NoData";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import JenisKaryawanBadge from "./JenisKaryawanBadge";
import Retry from "./Retry";
import TabelDetailAktivitasKaryawan from "./TabelDetailAktivitasKaryawan";
import PeriodPickerForDatePickerModal from "./input/PeriodPickerForDatePickerModal";
import SearchComponent from "./input/SearchComponent";
import ExportModal from "./ExportModal";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

interface Props extends BoxProps {
  karyawan_id: number;
  children?: any;
}
export default function DetailAktivitasKaryawanModalDisclosure({
  karyawan_id,
  children,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
  });

  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());

  useBackOnClose(
    `detail-aktivitas-karyawan-modal-${karyawan_id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/karyawan/detail-karyawan-presensi/${karyawan_id}`,
    payload: {
      month: month + 1,
      year: year,
    },
    dependencies: [month, year],
    conditions: !!(isOpen && karyawan_id),
  });

  // Permission
  const { userPermissions } = useAuth();
  // TODO Ganti id permission
  const exportPermissions = isHasPermissions(userPermissions, [9]);

  return (
    <>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        cursor={"pointer"}
        {...props}
      >
        {children}
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        size={"full"}
        scrollBehavior="inside"
        allowPinchZoom
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={"Detail Presensi Karyawan"} />
          </ModalHeader>
          <ModalBody>
            {error && (
              <>
                {notFound && <NoData minH={"300px"} />}

                {!notFound && (
                  <Center my={"auto"} minH={"300px"}>
                    <Retry loading={loading} retry={retry} />
                  </Center>
                )}
              </>
            )}

            {!error && (
              <>
                {loading && (
                  <CContainer flex={1}>
                    <Wrap
                      spacing={responsiveSpacing}
                      mb={responsiveSpacing}
                      align={"center"}
                    >
                      <Skeleton w={"55px"} h={"55px"} borderRadius={"full"} />

                      <VStack align={"stretch"}>
                        <Skeleton w={"100px"} h={"16px"} />
                        <Skeleton w={"100px"} h={"16px"} />
                      </VStack>

                      <VStack align={"stretch"}>
                        <Skeleton w={"100px"} h={"16px"} />
                        <Skeleton w={"100px"} h={"16px"} />
                      </VStack>

                      <VStack align={"stretch"}>
                        <Skeleton w={"100px"} h={"16px"} />
                        <Skeleton w={"100px"} h={"16px"} />
                      </VStack>
                    </Wrap>

                    <CContainer
                      flex={1}
                      gap={responsiveSpacing}
                      pb={responsiveSpacing}
                    >
                      <HStack>
                        <Skeleton h={"40px"} flex={1} />
                      </HStack>

                      <Skeleton flex={1} w={"100%"} />
                    </CContainer>
                  </CContainer>
                )}

                {!loading && (
                  <>
                    {(data || (data && data.length > 0)) && (
                      <CContainer
                        overflowY={"auto"}
                        overflowX={"clip"}
                        className="scrollY"
                        borderRadius={12}
                        flex={1}
                        pb={6}
                      >
                        <Wrap
                          spacing={responsiveSpacing}
                          mb={responsiveSpacing}
                          align={"center"}
                        >
                          <Avatar
                            size={"md"}
                            w={"55px"}
                            h={"55px"}
                            src={data.user.foto_profil}
                            name={data.user.nama}
                          />

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Nama Karyawan
                            </Text>
                            <Text fontWeight={500}>{data.user.nama}</Text>
                          </VStack>

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Unit Kerja
                            </Text>
                            <Text fontWeight={500}>
                              {data.unit_kerja.nama_unit}
                            </Text>
                          </VStack>

                          <VStack align={"stretch"}>
                            <Text fontSize={14} opacity={0.6}>
                              Jenis Karyawan
                            </Text>
                            <JenisKaryawanBadge
                              data={data.unit_kerja.jenis_karyawan}
                            />
                          </VStack>
                        </Wrap>

                        {/* Filters */}
                        <HStack mb={responsiveSpacing}>
                          <SearchComponent
                            name="search"
                            onChangeSetter={(input) => {
                              setFilterConfig((ps) => ({
                                ...ps,
                                search: input,
                              }));
                            }}
                            inputValue={filterConfig.search}
                            placeholder="kategori presensi"
                          />

                          <PeriodPickerForDatePickerModal
                            id="periode-picker-for-export-presensi"
                            name="periode export presensi"
                            bulan={month}
                            setBulan={setMonth}
                            tahun={year}
                            setTahun={setYear}
                            minW={"200px"}
                          />

                          {/* TODO ganti url ke export detail presensi by kary */}
                          <ExportModal
                            url={`/api/rski/dashboard/karyawan/detail-karyawan-presensi/${data.user.data_karyawan_id}/export`}
                            title={`Export Presensi ${data.user.nama}`}
                            downloadFileName={`Export Presensi ${data.user.nama}`}
                            payload={{
                              month: month + 1,
                              year: year,
                            }}
                            isDisabled={!exportPermissions}
                          />
                        </HStack>

                        {(!data ||
                          (data && data.list_presensi?.length === 0)) && (
                          <NoData />
                        )}

                        <TabelDetailAktivitasKaryawan
                          data={data.list_presensi}
                          filterConfig={filterConfig}
                        />
                      </CContainer>
                    )}
                  </>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

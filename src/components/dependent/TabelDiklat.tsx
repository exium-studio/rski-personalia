import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiDeleteBinLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { iconSize } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatDuration from "../../lib/formatDuration";
import isHasPermissions from "../../lib/isHasPermissions";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import StatusVerifikasiBadge2 from "./StatusVerifikasiBadge2";
import TabelFooterConfig from "./TabelFooterConfig";
import VerifikasiModal from "./VerifikasiModal";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import req from "../../lib/req";
import formatTime from "../../lib/formatTime";
import TabelElipsisText from "./TabelElipsisText";
import SearchComponent from "./input/SearchComponent";

const KonfirmasiDeleteUser = ({ peserta, dataDiklat }: any) => {
  // api/rski/dashboard/perusahaan/diklat/{diklatId}/delete-peserta-diklat/{userId}
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `konfirmasi-delete-${peserta.user.id}`,
    isOpen,
    onOpen,
    onClose
  );

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  function deleteUser() {
    setLoading(true);
    req
      .delete(
        `/api/rski/dashboard/perusahaan/diklat/${dataDiklat.id}/delete-peserta-diklat/${peserta.user.id}`
      )
      .then((r) => {
        if (r.status === 200) {
          setRt(!rt);
          backOnClose();
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Maaf terjadi kesalahan pada sistem",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const { userPermissions } = useAuth();
  const vearif2Permission = isHasPermissions(userPermissions, [11]);

  return (
    <>
      <PermissionTooltip permission={vearif2Permission}>
        <IconButton
          aria-label="delete"
          icon={<Icon as={RiDeleteBinLine} fontSize={iconSize} />}
          variant={"ghost"}
          colorScheme="red"
          onClick={onOpen}
          isDisabled={!vearif2Permission}
        />
      </PermissionTooltip>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Hapus Karyawan Dari Peserta Diklat"} />
          </ModalHeader>
          <ModalBody>
            <Text>
              Apakah anda yakin akan menghapus <b>{peserta.user.nama}</b> dari
              peserta Diklat?
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={backOnClose}
              isDisabled={loading}
            >
              Tidak
            </Button>
            <Button
              w={"100%"}
              className="clicky"
              colorScheme="red"
              onClick={deleteUser}
              isLoading={loading}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const PesertaModal = ({ data }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`peserta-diklat-modal-${data.id}`, isOpen, onOpen, onClose);

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
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Peserta Diklat"} />
          </ModalHeader>
          <ModalBody className="scrollY">
            <CContainer gap={2}>
              {data?.list_peserta?.length === 0 && <NoData minH={"300px"} />}

              {data?.list_peserta?.length > 0 && (
                <>
                  {data.list_peserta?.map((peserta: any, i: number) => (
                    <HStack
                      key={i}
                      justifyContent={"space-between"}
                      p={4}
                      bg={"var(--divider)"}
                      borderRadius={8}
                    >
                      <AvatarAndNameTableData
                        data={{
                          id: peserta?.user?.id,
                          nama: peserta?.user?.nama,
                          foto_profil: peserta?.user?.foto_profil,
                        }}
                        // noDetail
                        w={"fit-content"}
                        maxW={"fit-content"}
                      />

                      {/* {data?.status_diklat?.id !== 4 && (
                        <KonfirmasiDeleteUser
                          dataDiklat={data}
                          peserta={peserta}
                        />
                      )} */}
                    </HStack>
                  ))}
                </>
              )}
            </CContainer>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={backOnClose}
              w={"100%"}
              className="btn-solid clicky"
            >
              Mengerti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const KonfirmasiPublikasiSertifikat = ({ data }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `konfirmasi-publikasi-modal-${data.id}`,
    isOpen,
    onOpen,
    onClose
  );

  const [countDown, setCountDown] = useState(10);
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCountDown((prevCount) => {
          if (prevCount > 0) {
            return prevCount - 1;
          } else {
            clearInterval(interval);
            return prevCount;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCountDown(5);
    }
  }, [isOpen]);

  const [search, setSearch] = useState("");
  const fd = data.list_peserta.filter((item: any) => {
    const searchTerm = search.toLowerCase();

    const matches1 = item.user.nama.toLowerCase().includes(searchTerm);

    return matches1;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();
  function handlePublish() {
    setLoading(true);
    req
      .post(`/api/rski/dashboard/perusahaan/diklat/${data.id}/certificates`)
      .then((r) => {
        if (r.status === 200) {
          setRt(!rt);
          backOnClose();
          toast({
            status: "success",
            title: r?.data?.message,
            position: "bottom-right",
            isClosable: true,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Maaf terjadi kesalahan pada sistem",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const { userPermissions } = useAuth();
  const publikasiPermission = isHasPermissions(userPermissions, [121]);

  return (
    <>
      {!data.certificate_published && (
        <PermissionTooltip
          permission={publikasiPermission}
          boxProps={{ flex: 1 }}
        >
          <Button
            w={"100%"}
            colorScheme="ap"
            variant={"outline"}
            className="clicky"
            onClick={onOpen}
            isDisabled={!publikasiPermission}
          >
            Publikasi
          </Button>
        </PermissionTooltip>
      )}

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Konfirmasi Publikasi Sertifikat"} />
          </ModalHeader>
          <ModalBody className="scrollY" px={0}>
            <CContainer px={6}>
              <Alert alignItems={"start"} status="warning" mb={4}>
                <AlertIcon />
                <AlertDescription>
                  Sebelum publikasi sertifikat, pastikan peserta yang tidak
                  hadir telah dihapus untuk memastikan sertifikat hanya
                  diberikan kepada yang hadir.
                </AlertDescription>
              </Alert>

              <SearchComponent
                name="search_peserta_diklat"
                onChangeSetter={(input) => {
                  setSearch(input);
                }}
                inputValue={search}
                mb={4}
              />
            </CContainer>

            <CContainer
              gap={2}
              px={6}
              flex={1}
              overflowY={"auto"}
              className="scrollY"
            >
              {fd?.length === 0 && <NotFound minH={"300px"} />}

              {fd?.length > 0 && (
                <>
                  {fd?.map((peserta: any, i: number) => (
                    <HStack
                      key={i}
                      justifyContent={"space-between"}
                      p={4}
                      bg={"var(--divider)"}
                      borderRadius={8}
                    >
                      <AvatarAndNameTableData
                        data={{
                          id: peserta?.user?.id,
                          nama: peserta?.user?.nama,
                          foto_profil: peserta?.user?.foto_profil,
                        }}
                        // noDetail
                        w={"fit-content"}
                        maxW={"fit-content"}
                      />

                      {data?.status_diklat?.id === 4 && (
                        <KonfirmasiDeleteUser
                          dataDiklat={data}
                          peserta={peserta}
                        />
                      )}
                    </HStack>
                  ))}
                </>
              )}
            </CContainer>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handlePublish}
              w={"100%"}
              colorScheme="ap"
              className="btn-ap clicky"
              isLoading={loading}
              isDisabled={countDown !== 0}
            >
              {countDown !== 0 ? `Tunggu ${countDown} detik` : "Publikasi"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface Props {
  filterConfig: any;
}

export default function TabelDiklat({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/perusahaan/get-diklat-internal?page=${pageConfig}`,
      payload: {
        ...filterConfig,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, filterConfig],
    });

  const { userPermissions } = useAuth();
  const verif1Permission = isHasPermissions(userPermissions, [10]);
  const verif2Permission = isHasPermissions(userPermissions, [11]);

  const formattedHeader = [
    {
      th: "Nama Acara",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 3,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "Status Verifikasi",
      isSortable: true,
      props: {
        zIndex: 2,
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Deskripsi",
      props: {
        zIndex: 2,
      },
    },
    {
      th: "Kuota",
      isSortable: true,
      props: {
        zIndex: 2,
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Tanggal Mulai",
      isSortable: true,
      props: {
        zIndex: 2,
      },
    },
    {
      th: "Tanggal Selesai",
      isSortable: true,
      props: {
        zIndex: 2,
      },
    },
    {
      th: "Jam Mulai",
      isSortable: true,
      props: {
        zIndex: 2,
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Jam Selesai",
      isSortable: true,
      props: {
        zIndex: 2,
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Durasi",
      isSortable: true,
      props: {
        zIndex: 2,
      },
    },
    {
      th: "Peserta",
      props: {
        zIndex: 2,
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Kategori Acara",
      isSortable: true,
      props: {
        zIndex: 2,
      },
    },
    {
      th: "Tempat",
      isSortable: true,
      props: {
        zIndex: 2,
      },
    },
    {
      th: "Verif. 1",
      props: {
        position: "sticky",
        right: 0,
        zIndex: 4,
        w: "122px",
      },
      cProps: {
        justify: "center",
        borderLeft: "1px solid var(--divider3)",
        borderRight: "1px solid var(--divider3)",
        w: "122px",
      },
    },
    {
      th: "Verif. 2",
      props: {
        // position: "sticky",
        right: 0,
        zIndex: 3,
        w: "122px",
      },
      cProps: {
        justify: "center",
        // borderLeft: "1px solid var(--divider3)",
        borderRight: "1px solid var(--divider3)",
        w: "122px",
      },
    },
    {
      th: "Publikasi Sertifikat",
      props: {
        // position: "sticky",
        right: 0,
        zIndex: 1,
        w: "122px",
      },
      cProps: {
        justify: "center",
        // borderLeft: "1px solid var(--divider3)",
        // w: "122px",
      },
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.nama_diklat,
        td: item.nama_diklat,
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
          w: "243px",
        },
      },
      {
        value: item.status_diklat.label,
        td: <StatusVerifikasiBadge2 data={item.status_diklat} w={"180px"} />,
      },
      {
        value: item.deskripsi,
        td: <TabelElipsisText data={item.deskripsi} />,
      },
      {
        value: item.kuota,
        td: item.kuota,
        cProps: { justify: "center" },
      },
      {
        value: item.tgl_mulai,
        td: formatDate(item.tgl_mulai),
        isDate: true,
      },
      {
        value: item.tgl_selesai,
        td: formatDate(item.tgl_selesai),
        isDate: true,
      },
      {
        value: item.jam_mulai,
        td: formatTime(item.jam_mulai),
        isTime: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.jam_selesai,
        td: formatTime(item.jam_selesai),
        isTime: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.durasi,
        td: formatDuration(item.durasi),
        isTime: true,
      },
      {
        value: item.peserta,
        td: <PesertaModal data={item} />,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.kategori_diklat?.label,
        td: item.kategori_diklat?.label,
      },
      {
        value: item.lokasi,
        td: item.lokasi,
      },
      {
        value: "",
        td: item?.status_diklat?.id === 1 && (
          <PermissionTooltip permission={verif1Permission}>
            <VerifikasiModal
              aria-label={`perubahan-data-verif-1-button-${item.id}"`}
              id={`verifikasi-diklat-modal-${item.id}`}
              submitUrl={`/api/rski/dashboard/perusahaan/diklat/${item.id}/verifikasi-step-1`}
              approvePayloadKey="verifikasi_pertama_disetujui"
              disapprovePayloadKey="verifikasi_pertama_ditolak"
              isDisabled={!verif1Permission}
            />
          </PermissionTooltip>
        ),
        props: {
          position: "sticky",
          right: 0,
          zIndex: 2,
        },
        cProps: {
          justify: "center",
          borderLeft: "1px solid var(--divider3)",
          borderRight: "1px solid var(--divider3)",
        },
      },
      {
        value: "",
        td: item?.status_diklat?.id === 2 && (
          <PermissionTooltip permission={verif2Permission}>
            <VerifikasiModal
              aria-label={`perubahan-data-verif-2-button-${item.id}"`}
              id={`verifikasi-diklat-modal-2-${item.id}`}
              submitUrl={`/api/rski/dashboard/perusahaan/diklat/${item.id}/verifikasi-step-2`}
              approvePayloadKey="verifikasi_kedua_disetujui"
              disapprovePayloadKey="verifikasi_kedua_ditolak"
              isDisabled={!verif2Permission}
            />
          </PermissionTooltip>
        ),
        props: {
          // position: "sticky",
          right: 0,
          zIndex: 1,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
          justify: "center",
          // borderLeft: "1px solid var(--divider3)",
        },
      },
      {
        value: "",
        td: item.status_diklat.id === 4 && (
          <KonfirmasiPublikasiSertifikat data={item} />
        ),
        props: {
          // position: "sticky",
          right: 0,
          zIndex: 1,
        },
        cProps: {
          justify: "center",
          // borderLeft: "1px solid var(--divider3)",
        },
      },
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(filterConfig, ["tahun"]) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(filterConfig, ["tahun"]) && (
            <NotFound minH={"300px"} />
          )}

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
            <>
              <Skeleton minH={"300px"} flex={1} mx={"auto"} />
            </>
          )}
          {!loading && (
            <>
              {!formattedData && <NoData minH={"300px"} />}

              {formattedData && (
                <>
                  <CustomTableContainer>
                    <CustomTable
                      formattedHeader={formattedHeader}
                      formattedData={formattedData}
                    />
                  </CustomTableContainer>
                </>
              )}
            </>
          )}
        </>
      )}

      <TabelFooterConfig
        limitConfig={limitConfig}
        setLimitConfig={setLimitConfig}
        pageConfig={pageConfig}
        setPageConfig={setPageConfig}
        paginationData={paginationData}
      />
    </>
  );
}

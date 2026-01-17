import {
  Button,
  Center,
  Icon,
  MenuItem,
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
import { RiEditLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { iconSize } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import useGetUserData from "../../hooks/useGetUserData";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatDuration from "../../lib/formatDuration";
import formatTime from "../../lib/formatTime";
import isHasPermissions from "../../lib/isHasPermissions";
import isObjectEmpty from "../../lib/isObjectEmpty";
import req from "../../lib/req";
import EditDiklatInternal from "../independent/EditDiklatEksternal";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import VerifikatorBelumDitentukan from "../independent/VerifikatorBelumDitentukan";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import StatusVerifikasiBadge2 from "./StatusVerifikasiBadge2";
import TabelElipsisText from "./TabelElipsisText";
import TabelFooterConfig from "./TabelFooterConfig";
import VerifikasiModal from "./VerifikasiModal";
import VerifikatorName from "./VerifikatorName";

interface Props {
  filterConfig: any;
}

const DeleteConfirmation = ({ rowData }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `delete-diklat-eksternal-confirmation-${rowData?.id}`,
    isOpen,
    onOpen,
    onClose,
  );
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();
  const [deleteCutiLoading, setDeleteCutiLoading] = useState(false);
  function handleDeleteCuti(rowData: any) {
    setDeleteCutiLoading(true);
    req
      .delete(
        `/api/rski/dashboard/perusahaan/delete-diklat-eksternal/${rowData?.id}`,
      )
      .then((r) => {
        if (r?.status === 200) {
          toast({
            status: "success",
            title: r.data.message,
            isClosable: true,
            position: "bottom-right",
          });
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
            "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
          isClosable: true,
          position: "bottom-right",
        });
      })
      .finally(() => {
        setDeleteCutiLoading(false);
      });
  }

  return (
    <>
      <MenuItem color={"red.400"} onClick={onOpen}>
        Delete...
      </MenuItem>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Delete/Batalkan Diklat Eksternal"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.4}>
              Apakah anda yakin akan menghapus data diklat eksternal yang
              dipilih?
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              onClick={backOnClose}
              className="clicky btn-solid"
              isDisabled={deleteCutiLoading}
              w={"50%"}
            >
              Cancel
            </Button>
            <Button
              w={"50%"}
              className="clicky"
              colorScheme="red"
              onClick={() => {
                handleDeleteCuti(rowData);
              }}
              isLoading={deleteCutiLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function TabelDiklatEksternal({ filterConfig }: Props) {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any[]>({
      initialData: undefined,
      url: `/api/rski/dashboard/perusahaan/get-diklat-eksternal?page=${pageConfig}`,
      payload: {
        ...filterConfig,
      },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, filterConfig],
    });

  useEffect(() => {
    setPageConfig(1);
  }, [filterConfig]);

  const userData = useGetUserData();

  // Contexts
  const { userPermissions } = useAuth();

  // States
  const editPermission = isHasPermissions(userPermissions, [154]);

  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditDiklatInternal rowData={rowData} jenisDiklat="eksternal">
          <PermissionTooltip permission={editPermission} placement="left">
            <MenuItem isDisabled={!editPermission}>
              <Text>Edit</Text>
              <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </EditDiklatInternal>
      );
    },
    (rowData: any) => {
      return <DeleteConfirmation rowData={rowData} />;
    },
  ];

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
      th: "Karyawan Pengajuan",
      isSortable: true,
    },
    {
      th: "Status Verifikasi",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Sertifikat",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Deskripsi",
    },
    // {
    //   th: "Kuota",
    //   isSortable: true,
    //   cProps: {
    //     justify: "center",
    //   },
    // },
    {
      th: "Tanggal Mulai",
      isSortable: true,
    },
    {
      th: "Tanggal Selesai",
      isSortable: true,
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
    },
    // {
    //   th: "Kategori Acara",
    //   isSortable: true,
    // },
    {
      th: "Tempat",
      isSortable: true,
    },
    {
      th: "Verif. 1",
      props: {
        position: "sticky",
        right: "40px",
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
        w: "122px",
      },
    },
    {
      th: "Verif. 3",
      props: {
        // position: "sticky",
        right: 0,
        zIndex: 3,
        w: "122px",
      },
      cProps: {
        justify: "center",
        // borderLeft: "1px solid var(--divider3)",
        w: "122px",
      },
    },
  ];
  const formattedData = data?.map((item: any) => {
    // const verif1Permission =
    //   item?.relasi_verifikasi?.[0]?.verifikator?.id === userData?.id ||
    //   userData?.id === 1;
    // const verif2Permission =
    //   item?.relasi_verifikasi?.[1]?.verifikator?.id === userData?.id ||
    //   userData?.id === 1;

    const verif1Permission = true;
    const verif2Permission = true;
    const verif3Permission = true;

    return {
      id: item.id,
      originalData: item,
      columnsFormat: [
        {
          value: item.nama_diklat,
          td: <TabelElipsisText data={item.nama_diklat} />,
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
          value: item?.list_peserta?.[0].user.nama,
          td: (
            <AvatarAndNameTableData
              detailKaryawanId={item.id}
              data={{
                id: item?.list_peserta?.[0].user.id,
                nama: item?.list_peserta?.[0].user.nama,
                foto_profil: item?.list_peserta?.[0].user?.foto_profil?.path,
              }}
            />
          ),
        },
        {
          value: item.status_diklat.label,
          td: <StatusVerifikasiBadge2 data={item.status_diklat} w={"180px"} />,
        },
        {
          value: item.path,
          td: (
            <Button
              colorScheme="ap"
              variant={"ghost"}
              className="clicky"
              as={Link}
              target="_blank"
              to={item.path}
            >
              Lihat
            </Button>
          ),
          cProps: {
            justify: "center",
          },
        },
        {
          value: item.deskripsi,
          td: <TabelElipsisText data={item.deskripsi} />,
        },
        // {
        //   value: item.kuota,
        //   td: item.kuota,
        //   cProps: { justify: "center" },
        // },
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
        // {
        //   value: item.kategori_diklat?.label,
        //   td: item.kategori_diklat?.label,
        // },
        {
          value: item.lokasi,
          td: item.lokasi,
        },
        // Veri. 1
        {
          value: "",
          td: (
            <>
              {item?.status_diklat?.id === 1 && (
                <>
                  {item?.relasi_verifikasi?.[0]?.id === null &&
                    userData?.id !== 1 && <VerifikatorBelumDitentukan />}

                  {(item?.relasi_verifikasi?.[0]?.id || userData?.id === 1) && (
                    <PermissionTooltip permission={verif1Permission}>
                      <VerifikasiModal
                        aria-label={`diklat-eksternal-verif-1-button-${item.id}`}
                        id={`diklat-eksternal-verif-1-modal-${item.id}`}
                        submitUrl={`/api/rski/dashboard/perusahaan/diklat/${item.id}/verifikasi-diklat-eksternal-step-1`}
                        approvePayloadKey="verifikasi_pertama_disetujui"
                        disapprovePayloadKey="verifikasi_pertama_ditolak"
                        isDisabled={!verif1Permission}
                      />
                    </PermissionTooltip>
                  )}
                </>
              )}

              {[2, 3, 4, 5].includes(item?.status_diklat?.id) && (
                <VerifikatorName
                  nama={item?.relasi_verifikasi?.[0]?.verifikator?.nama}
                  verification={
                    [2, 4, 5].includes(item?.status_diklat?.id) ? true : false
                  }
                />
              )}
            </>
          ),
          props: {
            position: "sticky",
            right: "40px",
            zIndex: 2,
          },
          cProps: {
            justify: "center",
            borderLeft: "1px solid var(--divider3)",
            borderRight: "1px solid var(--divider3)",
          },
        },
        // Verif. 2
        {
          value: "",
          td: (
            <>
              {item?.relasi_verifikasi?.[1]?.id === null &&
                userData?.id !== 1 && <VerifikatorBelumDitentukan />}

              {(item?.relasi_verifikasi?.[1]?.id || userData?.id === 1) && (
                <>
                  {[1, 3].includes(item?.status_diklat?.id) && (
                    <VerifikatorName
                      nama={item?.relasi_verifikasi?.[1]?.verifikator?.nama}
                      verification={null}
                    />
                  )}

                  {item?.status_diklat?.id === 2 && (
                    <PermissionTooltip permission={verif2Permission}>
                      <VerifikasiModal
                        aria-label={`diklat-eksternal-verif-2-button-${item.id}`}
                        id={`diklat-eksternal-verif-2-modal-${item.id}`}
                        submitUrl={`/api/rski/dashboard/perusahaan/diklat/${item.id}/verifikasi-diklat-eksternal-step-2`}
                        approvePayloadKey="verifikasi_kedua_disetujui"
                        disapprovePayloadKey="verifikasi_kedua_ditolak"
                        isDisabled={!verif2Permission}
                      />
                    </PermissionTooltip>
                  )}

                  {[4, 5].includes(item?.status_diklat?.id) && (
                    <VerifikatorName
                      nama={item?.relasi_verifikasi?.[1]?.verifikator?.nama}
                      verification={
                        item?.status_diklat?.id === 4 ? true : false
                      }
                    />
                  )}
                </>
              )}
            </>
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
        // Verif. 3
        {
          value: "",
          td: (
            <>
              {item?.relasi_verifikasi?.[1]?.id === null &&
                userData?.id !== 1 && <VerifikatorBelumDitentukan />}

              {(item?.relasi_verifikasi?.[1]?.id || userData?.id === 1) && (
                <>
                  {[1, 2, 3, 7].includes(item?.status_diklat?.id) && (
                    <VerifikatorName
                      nama={item?.relasi_verifikasi?.[1]?.verifikator?.nama}
                      verification={null}
                    />
                  )}

                  {item?.status_diklat?.id === 4 && (
                    <PermissionTooltip permission={verif3Permission}>
                      <VerifikasiModal
                        aria-label={`diklat-eksternal-verif-3-button-${item.id}`}
                        id={`diklat-eksternal-verif-3-modal-${item.id}`}
                        submitUrl={`/api/rski/dashboard/perusahaan/diklat/${item.id}/verifikasi-diklat-eksternal-step-3`}
                        approvePayloadKey="verifikasi_ketiga_disetujui"
                        disapprovePayloadKey="verifikasi_ketiga_ditolak"
                        isDisabled={!verif3Permission}
                      />
                    </PermissionTooltip>
                  )}

                  {[6, 7].includes(item?.status_diklat?.id) && (
                    <VerifikatorName
                      nama={item?.relasi_verifikasi?.[1]?.verifikator?.nama}
                      verification={
                        item?.status_diklat?.id === 6 ? true : false
                      }
                    />
                  )}
                </>
              )}
            </>
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
      ],
    };
  });

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(filterConfig, ["periode_tahun"]) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(filterConfig, ["periode_tahun"]) && (
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
                      rowOptions={rowOptions}
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

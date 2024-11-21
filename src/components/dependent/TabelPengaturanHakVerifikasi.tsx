import {
  Button,
  Center,
  HStack,
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
} from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiHistoryLine } from "@remixicon/react";
import { dummyKelolaRole } from "../../const/dummy";
import { iconSize } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import isHasPermissions from "../../lib/isHasPermissions";
import isObjectEmpty from "../../lib/isObjectEmpty";
import EditHakVerifikasiModalDisclosure from "../independent/EditHakVerifikasiModalDisclosure";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CContainer from "../wrapper/CContainer";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DeleteDataPengaturanModalDisclosure from "./DeleteDataPengaturanModalDisclosure";
import DisclosureHeader from "./DisclosureHeader";
import Retry from "./Retry";
import RestoreDataPengaturanModalDisclosure from "./RestoreDataPengaturanModalDisclosure";
import StatusDihapus from "./StatusDihapus";

interface ListKaryaanDiverifikasiProps {
  data: any;
}
const ListKaryawanDiverifikasiModal = ({
  data,
}: ListKaryaanDiverifikasiProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`list-user-diverifikasi-${data?.id}`, isOpen, onOpen, onClose);

  return (
    <>
      <Button
        className="clicky"
        colorScheme="ap"
        variant={"ghost"}
        onClick={onOpen}
      >
        Lihat
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          onClose();
        }}
        isCentered
        blockScrollOnMount={false}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader
              title={"Karyawan Diverifikasi"}
              onClose={onClose}
            />
          </ModalHeader>
          <ModalBody className="scrollY">
            <CContainer gap={2}>
              {data?.user_diverifikasi?.length === 0 && (
                <NoData minH={"300px"} />
              )}

              {data?.user_diverifikasi?.length > 0 && (
                <>
                  {data.user_diverifikasi?.map((user: any, i: number) => (
                    <HStack
                      key={i}
                      justifyContent={"space-between"}
                      p={4}
                      bg={"var(--divider)"}
                      borderRadius={8}
                      className="noofline-1"
                    >
                      <AvatarAndNameTableData
                        data={{
                          id: user?.id,
                          nama: user?.nama,
                          foto_profil: user?.foto_profil,
                        }}
                        // noDetail
                        w={"100%"}
                      />
                    </HStack>
                  ))}
                </>
              )}
            </CContainer>
          </ModalBody>
          <ModalFooter>
            <Button
              w={"100%"}
              className="btn-solid clicky"
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

interface Props {
  filterConfig?: any;
}
export default function TabelPengaturanHakVerifikasi({ filterConfig }: Props) {
  // Permissions
  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [60]);
  const deletePermission = isHasPermissions(userPermissions, [129]);

  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <EditHakVerifikasiModalDisclosure rowData={rowData}>
          <PermissionTooltip permission={editPermission} placement="left">
            <MenuItem isDisabled={!editPermission}>
              <Text>Edit</Text>
              <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </EditHakVerifikasiModalDisclosure>
      );
    },

    (rowData: any) => {
      return (
        <RestoreDataPengaturanModalDisclosure
          id={rowData.id}
          url={`/api/rski/dashboard/pengaturan/master-verifikasi/restore`}
        >
          <PermissionTooltip permission={deletePermission} placement="left">
            <MenuItem
              isDisabled={!rowData.columnsFormat[1].value || !deletePermission}
            >
              <Text>Restore</Text>
              <Icon as={RiHistoryLine} fontSize={iconSize} opacity={0.4} />
            </MenuItem>
          </PermissionTooltip>
        </RestoreDataPengaturanModalDisclosure>
      );
    },
    "divider",
    (rowData: any) => {
      return (
        <DeleteDataPengaturanModalDisclosure
          id={rowData.id}
          url={`/api/rski/dashboard/pengaturan/master-verifikasi`}
        >
          <PermissionTooltip permission={deletePermission} placement="left">
            <MenuItem
              fontWeight={500}
              isDisabled={!deletePermission || rowData.columnsFormat[1].value}
            >
              <Text color={"red.400"}>Delete</Text>
              <Icon
                color={"red.400"}
                as={RiDeleteBinLine}
                fontSize={iconSize}
              />
            </MenuItem>
          </PermissionTooltip>
        </DeleteDataPengaturanModalDisclosure>
      );
    },
  ];

  const { error, notFound, loading, data, retry } = useDataState<any[]>({
    initialData: dummyKelolaRole,
    url: "/api/rski/dashboard/pengaturan/master-verifikasi",
    dependencies: [],
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm);

    return matchesSearchTerm;
  });

  const formattedHeader = [
    {
      th: "Nama Verifikasi",
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
      th: "Status Dihapus",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Modul",
      isSortable: true,
    },
    {
      th: "Level Verifikasi",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Verifikator",
      isSortable: true,
    },
    {
      th: "Karyawan Diverifikasi",
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item?.name,
        td: item?.name,
        props: {
          position: "sticky",
          left: 0,
          zIndex: 2,
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      },
      {
        value: item.deleted_at,
        td: item.deleted_at ? <StatusDihapus data={item.deleted_at} /> : "",
        isDate: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item?.modul_verifikasi?.label,
        original_data: item?.modul_verifikasi,
        td: item?.modul_verifikasi?.label,
      },
      {
        value: item?.order,
        td: (
          <HStack gap={1}>
            <Text>{item?.order}</Text>
            <Text opacity={0.4}>/</Text>
            <Text opacity={0.4}>{item?.modul_verifikasi?.max_order}</Text>
          </HStack>
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: item?.verifikator?.nama,
        original_data: item?.verifikator,
        td: (
          <AvatarAndNameTableData
            detailKaryawanId={`detail-karyawan-${item.id}-${item.verifikator?.id}`}
            data={{
              id: item.verifikator?.id,
              nama: item.verifikator?.nama,
              fullName: `${item?.gelar_depan || ""} ${item.verifikator?.nama} ${
                item?.gelar_belakang || ""
              }`,
              foto_profil: item.verifikator?.foto_profil,
            }}
          />
        ),
      },
      {
        value: "",
        original_data: item?.user_diverifikasi,
        td: <ListKaryawanDiverifikasiModal data={item} />,
        cProps: {
          justify: "center",
        },
      },
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(filterConfig) && <NoData />}

          {notFound && !isObjectEmpty(filterConfig) && <NotFound />}

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
                  {fd && fd?.length === 0 && <NotFound minH={"300px"} />}

                  {fd && fd?.length > 0 && (
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
        </>
      )}
    </>
  );
}

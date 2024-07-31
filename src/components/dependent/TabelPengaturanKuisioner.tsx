import {
  Center,
  HStack,
  Icon,
  MenuItem,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiHistoryLine } from "@remixicon/react";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import { Interface__SelectOption } from "../../constant/interfaces";
import useDataState from "../../hooks/useDataState";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import Retry from "./Retry";
import StatusDihapus from "./StatusDihapus";

interface Props {
  filterConfig?: any;
}

export default function TabelPengaturanKuisioner({ filterConfig }: Props) {
  // SX

  // Row Options Config
  const rowOptions = [
    (rowData: any) => {
      return (
        <MenuItem>
          <Text>Edit</Text>
          <Icon as={RiEditLine} fontSize={iconSize} opacity={0.4} />
        </MenuItem>
      );
    },
    (rowData: any) => {
      return (
        <MenuItem isDisabled={!rowData.columnsFormat[1].value}>
          <Text>Restore</Text>
          <Icon as={RiHistoryLine} fontSize={iconSize} opacity={0.4} />
        </MenuItem>
      );
    },
    "divider",
    (rowData: any) => {
      return (
        <MenuItem fontWeight={500} isDisabled={rowData.columnsFormat[1].value}>
          <Text color={"red.400"}>Delete</Text>
          <Icon color={"red.400"} as={RiDeleteBinLine} fontSize={iconSize} />
        </MenuItem>
      );
    },
  ];

  const dummy = [
    {
      id: 1,
      pertanyaan: "Seberapa efektif Anda merasa proses onboarding saat ini?",
      jabatan: {
        id: 1,
        nama_jabatan: "HRD",
        is_struktural: 1,
        tunjangan: 1500000,
        created_at: "2023-09-21T02:41:29.000000Z",
        updated_at: "2024-05-07T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-01",
      updated_at: "2024-07-05",
      deleted_at: null,
    },
    {
      id: 2,
      pertanyaan: "Bagaimana Anda menilai komunikasi dalam tim Anda?",
      jabatan: {
        id: 2,
        nama_jabatan: "Manager",
        is_struktural: 1,
        tunjangan: 2000000,
        created_at: "2023-10-11T02:41:29.000000Z",
        updated_at: "2024-06-07T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-02",
      updated_at: "2024-07-06",
      deleted_at: null,
    },
    {
      id: 3,
      pertanyaan:
        "Apakah Anda merasa memiliki cukup sumber daya untuk menyelesaikan tugas Anda?",
      jabatan: {
        id: 3,
        nama_jabatan: "Supervisor",
        is_struktural: 1,
        tunjangan: 1800000,
        created_at: "2023-08-15T02:41:29.000000Z",
        updated_at: "2024-04-07T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-03",
      updated_at: "2024-07-07",
      deleted_at: null,
    },
    {
      id: 4,
      pertanyaan:
        "Bagaimana Anda menilai keseimbangan kerja/hidup di perusahaan ini?",
      jabatan: {
        id: 4,
        nama_jabatan: "Staff IT",
        is_struktural: 0,
        tunjangan: 1200000,
        created_at: "2023-11-01T02:41:29.000000Z",
        updated_at: "2024-06-10T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-04",
      updated_at: "2024-07-08",
      deleted_at: null,
    },
    {
      id: 5,
      pertanyaan:
        "Seberapa puas Anda dengan peluang pengembangan karir di perusahaan ini?",
      jabatan: {
        id: 5,
        nama_jabatan: "Staff Admin",
        is_struktural: 0,
        tunjangan: 1100000,
        created_at: "2023-07-21T02:41:29.000000Z",
        updated_at: "2024-05-11T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-05",
      updated_at: "2024-07-09",
      deleted_at: null,
    },
    {
      id: 6,
      pertanyaan: "Apakah Anda merasa dihargai oleh atasan Anda?",
      jabatan: {
        id: 6,
        nama_jabatan: "Accountant",
        is_struktural: 0,
        tunjangan: 1300000,
        created_at: "2023-09-15T02:41:29.000000Z",
        updated_at: "2024-06-12T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-06",
      updated_at: "2024-07-10",
      deleted_at: "2024-09-05",
    },
    {
      id: 7,
      pertanyaan: "Seberapa jelas tujuan dan tanggung jawab pekerjaan Anda?",
      jabatan: {
        id: 7,
        nama_jabatan: "Marketing",
        is_struktural: 0,
        tunjangan: 1400000,
        created_at: "2023-10-05T02:41:29.000000Z",
        updated_at: "2024-05-15T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-07",
      updated_at: "2024-07-11",
      deleted_at: null,
    },
    {
      id: 8,
      pertanyaan:
        "Bagaimana Anda menilai dukungan yang diberikan untuk pengembangan keterampilan?",
      jabatan: {
        id: 8,
        nama_jabatan: "Sales",
        is_struktural: 0,
        tunjangan: 1250000,
        created_at: "2023-11-22T02:41:29.000000Z",
        updated_at: "2024-06-17T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-08",
      updated_at: "2024-07-12",
      deleted_at: null,
    },
    {
      id: 9,
      pertanyaan: "Seberapa efektif Anda merasa rapat tim?",
      jabatan: {
        id: 9,
        nama_jabatan: "Developer",
        is_struktural: 0,
        tunjangan: 1600000,
        created_at: "2023-12-01T02:41:29.000000Z",
        updated_at: "2024-05-20T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-09",
      updated_at: "2024-07-13",
      deleted_at: "2024-09-08",
    },
    {
      id: 10,
      pertanyaan:
        "Apakah Anda merasa perusahaan ini peduli dengan kesejahteraan karyawan?",
      jabatan: {
        id: 10,
        nama_jabatan: "Customer Service",
        is_struktural: 0,
        tunjangan: 1000000,
        created_at: "2023-07-10T02:41:29.000000Z",
        updated_at: "2024-05-25T02:41:29.000000Z",
        deleted_at: null,
      },
      created_at: "2024-07-10",
      updated_at: "2024-07-14",
      deleted_at: "2024-09-09",
    },
  ];

  const { error, loading, data, retry } = useDataState<any[]>({
    initialData: dummy,
    url: "",
    dependencies: [],
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search.toLowerCase();
    const isDeletedTerm = filterConfig?.is_deleted?.map(
      (term: Interface__SelectOption) => term.value
    );
    const jabatanTerm = filterConfig?.jabatan?.map(
      (term: Interface__SelectOption) => term.value
    );

    const matchesSearchTerm = item.pertanyaan
      .toLowerCase()
      .includes(searchTerm);
    const matchesIsDeletedTerm =
      isDeletedTerm?.includes(1) && isDeletedTerm?.includes(0)
        ? true
        : isDeletedTerm?.includes(1)
        ? !!item.deleted_at
        : isDeletedTerm?.includes(0)
        ? !item.deleted_at
        : true;
    const matchesJabatan =
      jabatanTerm && jabatanTerm.length > 0
        ? jabatanTerm?.includes(item.jabatan.id)
        : true;

    return matchesSearchTerm && matchesIsDeletedTerm && matchesJabatan;
  });

  const formattedHeader = [
    {
      th: "Pertanyaan",
      isSortable: true,
    },
    {
      th: "Status Dihapus",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Jabatan",
      isSortable: true,
    },
  ];
  const formattedData = fd?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.pertanyaan,
        td: (
          <Tooltip label={item.pertanyaan}>
            <Text
              maxW={"180px"}
              overflow={"hidden"}
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
            >
              {item.pertanyaan}
            </Text>
          </Tooltip>
        ),
        isSortable: true,
        cProps: {
          justify: "center",
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
        value: item.jabatan.nama_jabatan,
        td: item.jabatan.nama_jabatan,
      },
    ],
  }));

  return (
    <>
      {error && (
        <Center my={"auto"} minH={"400px"}>
          <Retry loading={loading} retry={retry} />
        </Center>
      )}
      {!error && (
        <>
          {loading && (
            <>
              <Skeleton minH={"300px"} flex={1} mx={"auto"} />
              <HStack justify={"space-between"} mt={responsiveSpacing}>
                <Skeleton maxW={"120px"} />
                <Skeleton maxW={"300px"} h={"20px"} />
                <Skeleton maxW={"112px"} />
              </HStack>
            </>
          )}
          {!loading && (
            <>
              {!formattedData && <NoData minH={"400px"} />}

              {formattedData && (
                <>
                  {fd && fd?.length === 0 && <NotFound minH={"400px"} />}

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

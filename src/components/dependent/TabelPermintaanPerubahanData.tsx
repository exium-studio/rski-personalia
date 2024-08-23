import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import req from "../../lib/req";
import useFilterKaryawan from "../../global/useFilterKaryawan";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import backOnClose from "../../lib/backOnClose";
import isObjectEmpty from "../../lib/isObjectEmpty";
import NoData from "../independent/NoData";
import NotFound from "../independent/NotFound";
import Skeleton from "../independent/Skeleton";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import CustomTable from "./CustomTable";
import DisclosureHeader from "./DisclosureHeader";
import PerubahanDataRender from "./PerubahanDataRender";
import Retry from "./Retry";
import StatusApprovalBadge from "./StatusApprovalBadge";
import TabelFooterConfig from "./TabelFooterConfig";
import { useFormik } from "formik";
import * as yup from "yup";
import RequiredForm from "../form/RequiredForm";
import Textarea from "./input/Textarea";

interface KonfirmasiProps {
  data: any;
}

const KonfirmasiPermintaan = ({ data }: KonfirmasiProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `konfirmasi-permintaan-perubahan-data-${data.id}`,
    isOpen,
    onOpen,
    onClose
  );

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const [verifikasi, setVerifikasi] = useState<number | undefined>(undefined);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      verifikasi: undefined as number | undefined,
      alasan: "",
    },
    validationSchema: yup.object().shape({
      verifikasi: yup.number().required("Harus diisi"),
      alasan:
        verifikasi === 0 ? yup.string().required("Harus diisi") : yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      let payload;

      const payload1 = {
        verifikasi_disetujui: 1,
      };
      const payload2 = {
        verifikasi_ditolak: 1,
        alasan: values.alasan,
      };
      if (values.verifikasi === 1) {
        payload = payload1;
      } else {
        payload = payload2;
      }

      req
        .post(
          `/api/rski/dashboard/karyawan/riwayat-perubahan/verifikasi-data/${data.id}`,
          payload
        )
        .then((r) => {
          if (r.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              position: "bottom-right",
              isClosable: true,
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
              e.response.data.message || "Maaf terjadi kesalahan pada sistem",
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <Button
        isDisabled={data.status_perubahan.id !== 1}
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
      >
        Verifikasi
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader
              title={"Konfirmasi Permintaan"}
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form
              id="verifikasiPermintaanPerubahanDataForm"
              onSubmit={formik.handleSubmit}
            >
              <FormControl isInvalid={!!formik.errors.verifikasi}>
                <FormLabel>
                  Verifikasi
                  <RequiredForm />
                </FormLabel>
                <SimpleGrid columns={[1, 2]} gap={2}>
                  <Button
                    w={"100%"}
                    className="btn-outline clicky"
                    colorScheme={formik.values.verifikasi === 1 ? "green" : ""}
                    variant={formik.values.verifikasi === 1 ? "outline" : ""}
                    onClick={() => {
                      formik.setFieldValue("verifikasi", 1);
                      setVerifikasi(1);
                    }}
                  >
                    Disetujui
                  </Button>
                  <Button
                    w={"100%"}
                    className="btn-outline clicky"
                    colorScheme={formik.values.verifikasi === 0 ? "red" : ""}
                    variant={formik.values.verifikasi === 0 ? "outline" : ""}
                    onClick={() => {
                      formik.setFieldValue("verifikasi", 0);
                      setVerifikasi(0);
                    }}
                  >
                    Ditolak
                  </Button>
                </SimpleGrid>
                <FormErrorMessage>
                  {formik.errors.verifikasi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!formik.errors.alasan}>
                <FormLabel>
                  Alasan
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="alasan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("alasan", input);
                  }}
                  inputValue={formik.values.alasan}
                  isDisabled={formik.values.verifikasi !== 0}
                />
                <FormErrorMessage>
                  {formik.errors.alasan as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
              isLoading={loading}
              type="submit"
              form="verifikasiPermintaanPerubahanDataForm"
            >
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function TabelPermintaanPerubahanData() {
  // Limit Config
  const [limitConfig, setLimitConfig] = useState<number>(10);
  // Pagination Config
  const [pageConfig, setPageConfig] = useState<number>(1);
  // Filter Config
  const { formattedFilterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, paginationData, retry } =
    useDataState<any>({
      initialData: undefined,
      url: `/api/rski/dashboard/karyawan/riwayat-perubahan/get-riwayat-perubahan-karyawan?page=${pageConfig}`,
      payload: { ...formattedFilterKaryawan },
      limit: limitConfig,
      dependencies: [limitConfig, pageConfig, formattedFilterKaryawan],
    });

  const formattedHeader = [
    {
      th: "Nama",
      isSortable: true,
      props: {
        position: "sticky",
        left: 0,
        zIndex: 99,
        w: "243px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
    },
    {
      th: "Status Persetujuan",
      isSortable: true,
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Kolom",
      isSortable: true,
    },
    {
      th: "Data Original",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Data Pengajuan",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Verifikasi",
      props: {
        position: "sticky",
        right: 0,
        zIndex: 2,
      },
      cProps: {
        justify: "center",
        borderLeft: "1px solid var(--divider3)",
      },
    },
  ];
  const formattedData = data?.map((item: any) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.user.nama,
        td: (
          <AvatarAndNameTableData
            data={{
              id: item.user.id,
              nama: item.user.nama,
              foto_profil: item.user.foto_profil,
            }}
          />
        ),
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
        value: item?.status_perubahan?.id,
        td: (
          <StatusApprovalBadge data={item?.status_perubahan.id} w={"120px"} />
        ),
        isNumeric: true,
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.kolom,
        td: item.kolom,
      },
      {
        value: item.data,
        td: (
          <PerubahanDataRender
            column={item.kolom?.toLowerCase()}
            data={item.original_data}
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: item.data,
        td: (
          <PerubahanDataRender
            column={item.kolom?.toLowerCase()}
            data={item.updated_data}
          />
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: "",
        td: <KonfirmasiPermintaan data={item} />,
        props: {
          position: "sticky",
          right: 0,
          zIndex: 2,
        },
        cProps: {
          justify: "center",
          borderLeft: "1px solid var(--divider3)",
        },
      },
    ],
  }));

  return (
    <>
      {error && (
        <>
          {notFound && isObjectEmpty(formattedFilterKaryawan) && (
            <NoData minH={"300px"} />
          )}

          {notFound && !isObjectEmpty(formattedFilterKaryawan) && (
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
              {(!data || (data && data.length === 0)) && (
                <NoData minH={"300px"} />
              )}

              {(data || (data && data.length > 0)) && (
                <>
                  <CustomTableContainer>
                    <CustomTable
                      formattedHeader={formattedHeader}
                      formattedData={formattedData}
                      // onRowClick={() => {
                      //   onOpen();
                      // }}
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

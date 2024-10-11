import {
  Button,
  ButtonGroup,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiBook2Fill } from "@remixicon/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import DisclosureHeader from "../../components/dependent/DisclosureHeader";
import FileInput from "../../components/dependent/input/FileInput";
import SearchComponent from "../../components/dependent/input/SearchComponent";
import StringInput from "../../components/dependent/input/StringInput";
import Textarea from "../../components/dependent/input/Textarea";
import Retry from "../../components/dependent/Retry";
import RequiredForm from "../../components/form/RequiredForm";
import NoData from "../../components/independent/NoData";
import NotFound from "../../components/independent/NotFound";
import Skeleton from "../../components/independent/Skeleton";
import TambahMateri from "../../components/independent/TambahMateri";
import CContainer from "../../components/wrapper/CContainer";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import useGetUserData from "../../hooks/useGetUserData";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import isHasPermissions from "../../lib/isHasPermissions";
import req from "../../lib/req";

const DeleteMateri = ({ id }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`delete-confirmation-${id}`, isOpen, onOpen, onClose);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();
  function handleDelete() {
    setLoading(true);

    req
      .delete(`/api/rski/dashboard/pengaturan/materi-pelatihan/${id}`)
      .then((r) => {
        if (r.status === 200) {
          setRt(!rt);
          backOnClose();
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

  return (
    <>
      <Button
        w={"100%"}
        mt={2}
        color={"red.400"}
        className="btn-solid clicky"
        isLoading={loading}
        onClick={onOpen}
      >
        Delete
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Delete Materi"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.4}>
              Apakah anda yakin akan menghapus materi ini?
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
              onClick={handleDelete}
              w={"100%"}
              colorScheme="red"
              className="clicky"
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

const MateriSlot = ({ initialValues }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`materi-modal-${1}`, isOpen, onOpen, onClose);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();
  const userData = useGetUserData();

  const formik = useFormik({
    validateOnChange: false,
    initialValues,
    validationSchema: yup.object().shape({}),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);

      const url = `api/rski/dashboard/pengaturan/materi-pelatihan/${initialValues?.id}`;
      const payload = new FormData();
      payload.append("_method", "patch");
      payload.append("user_id", userData?.id);
      payload.append("judul", values.judul);
      payload.append("deskripsi", values.deskripsi);
      payload.append(`dokumen_materi_1`, values?.dokumen_materi_1);
      payload.append(`dokumen_materi_2`, values?.dokumen_materi_2);
      payload.append(`dokumen_materi_3`, values?.dokumen_materi_3);

      req
        .post(url, payload)
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
    },
  });

  return (
    <>
      <CContainer
        flex={0}
        bg={"var(--divider)"}
        borderRadius={8}
        cursor={"pointer"}
        position={"relative"}
        overflow={"clip"}
        onClick={onOpen}
      >
        <HStack py={3} px={4}>
          <Text>{initialValues?.judul}</Text>
        </HStack>

        <Center p={4} flexDir={"column"}>
          <Icon as={RiBook2Fill} fontSize={72} mb={2} />
          <Text textAlign={"center"} opacity={0.4}>
            Klik untuk edit
          </Text>
        </Center>

        <HStack opacity={0.4} justify={"space-between"} py={3} px={4}>
          <Tooltip
            label={`Diunggah pada ${formatDate(initialValues.created_at)}`}
            openDelay={500}
          >
            <Text fontSize={11}>
              {formatDate(initialValues.created_at, "short")}
            </Text>
          </Tooltip>

          <Tooltip
            label={`Diperbarui pada ${formatDate(initialValues.updated_at)}`}
            openDelay={500}
          >
            <Text fontSize={11} opacity={0.4}>
              {formatDate(initialValues.updated_at, "short")}
            </Text>
          </Tooltip>
        </HStack>
      </CContainer>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Materi"} />
          </ModalHeader>
          <ModalBody mb={6}>
            <form id="materiForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.judul}>
                <FormLabel>
                  Judul
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="judul"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("judul", input);
                  }}
                  inputValue={formik.values.judul}
                  placeholder="Materi Diklat"
                />
                <FormErrorMessage>
                  {formik.errors.judul as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.deskripsi}>
                <FormLabel>
                  Deskripsi
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="deskripsi"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("deskripsi", input);
                  }}
                  inputValue={formik.values.deskripsi}
                  placeholder="Materi Diklat"
                />
                <FormErrorMessage>
                  {formik.errors.deskripsi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.dokumen_materi_1}>
                <FormLabel>Dokumen 1</FormLabel>
                <FileInput
                  name="dokumen_materi_1"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("dokumen_materi_1", input);
                  }}
                  inputValue={formik.values.dokumen_materi_1}
                  accept=".pdf, pptx, docx"
                />
                <FormErrorMessage>
                  {formik.errors.dokumen_materi_1 as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={!!formik.errors.dokumen_materi_2}>
                <FormLabel>Dokumen 2</FormLabel>
                <FileInput
                  name="dokumen_materi_2"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("dokumen_materi_2", input);
                  }}
                  inputValue={formik.values.dokumen_materi_2}
                  accept=".pdf, pptx, docx"
                />
                <FormErrorMessage>
                  {formik.errors.dokumen_materi_2 as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={6} isInvalid={!!formik.errors.dokumen_materi_3}>
                <FormLabel>Dokumen 3</FormLabel>
                <FileInput
                  name="dokumen_materi_3"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("dokumen_materi_3", input);
                  }}
                  inputValue={formik.values.dokumen_materi_3}
                  accept=".pdf, pptx, docx"
                />
                <FormErrorMessage>
                  {formik.errors.dokumen_materi_3 as string}
                </FormErrorMessage>
              </FormControl>
            </form>

            <ButtonGroup gap={2}>
              <DeleteMateri id={initialValues.id} />

              <Button
                w={"100%"}
                mt={2}
                type="submit"
                form="materiForm"
                colorScheme="ap"
                className="btn-ap clicky"
                isLoading={loading}
              >
                Simpan
              </Button>
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface MateriItemProps {
  initialData: any;
}

const MateriItem = ({ initialData }: MateriItemProps) => {
  const initialValues = {
    id: initialData.id,
    judul: initialData?.judul || "",
    deskripsi: initialData?.deskripsi || "",
    user: initialData?.user,
    dokumen_materi_1: (initialData?.dokumen_materi_1?.path || "") as any,
    dokumen_materi_2: (initialData?.dokumen_materi_2?.path || "") as any,
    dokumen_materi_3: (initialData?.dokumen_materi_3?.path || "") as any,
    created_at: initialData?.created_at,
    updated_at: initialData?.updated_at,
  };

  return (
    <>
      <MateriSlot initialValues={initialValues} />
    </>
  );
};

export default function PengaturanMateri() {
  // SX
  const lightDarkColor = useLightDarkColor();

  // Permissions
  const { userPermissions } = useAuth();
  const createPermission = isHasPermissions(userPermissions, [138]);

  // Filter Config
  const defaultFilterConfig = {
    search: "",
  };
  const [filterConfig, setFilterConfig] = useState<any>(defaultFilterConfig);

  // States
  const { error, loading, notFound, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/pengaturan/materi-pelatihan`,
    dependencies: [],
  });
  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig?.search?.toLowerCase();

    const matches1 = item?.judul?.toLowerCase().includes(searchTerm);

    return matches1;
  });

  // Render Lateral
  const render = {
    loading: (
      <>
        <SimpleGrid columns={[2, 3, null, 4, 5]} gap={responsiveSpacing}>
          {Array?.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} h={"210px"} />
          ))}
        </SimpleGrid>
      </>
    ),
    error: (
      <>
        {!notFound && <Retry retry={retry} />}
        {notFound && <NoData />}
      </>
    ),
    empty: (
      <>
        <NoData />
      </>
    ),
    loaded: (
      <>
        {fd && fd.length > 0 ? (
          <SimpleGrid columns={[2, 3, null, 4, 5]} gap={responsiveSpacing}>
            {fd?.map((item: any, i: number) => (
              <MateriItem key={i} initialData={item} />
            ))}
          </SimpleGrid>
        ) : (
          <NotFound />
        )}
      </>
    ),
  };

  return (
    <CContainer
      py={responsiveSpacing}
      px={responsiveSpacing}
      h={"100%"}
      overflowY={"auto"}
      className="scrollY"
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
    >
      <HStack
        py={responsiveSpacing}
        justify={"space-between"}
        w={"100%"}
        className="tabelConfig scrollX"
        overflowX={"auto"}
        flexShrink={0}
      >
        <SearchComponent
          flex={"1 1 0"}
          minW={"165px"}
          name="search"
          onChangeSetter={(input) => {
            setFilterConfig((ps: any) => ({
              ...ps,
              search: input,
            }));
          }}
          inputValue={filterConfig.search}
          tooltipLabel="Cari dengan judul materi"
          placeholder="judul materi"
        />

        <PermissionTooltip permission={createPermission}>
          <TambahMateri minW={"fit-content"} isDisabled={!createPermission} />
        </PermissionTooltip>
      </HStack>

      {loading && render.loading}
      {!loading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {!data && render.empty}
              {data && render.loaded}
            </>
          )}
        </>
      )}
    </CContainer>
  );
}

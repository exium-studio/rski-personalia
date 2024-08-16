import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import StringInput from "../../components/dependent/input/StringInput";
import TimePickerModal from "../../components/dependent/input/TimePickerModal";
import Retry from "../../components/dependent/Retry";
import RequiredForm from "../../components/form/RequiredForm";
import Skeleton from "../../components/independent/Skeleton";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import req from "../../constant/req";
import { responsiveSpacing } from "../../constant/sizes";
import useRenderTrigger from "../../global/useRenderTrigger";
import useDataState from "../../hooks/useDataState";

export default function PengaturanJamKerjaNonShift() {
  // SX
  const lightDarkColor = useLightDarkColor();

  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama: "",
      jam_from: "",
      jam_to: "",
    },
    validationSchema: yup.object().shape({
      nama: yup.string().required("Harus diisi"),
      jam_from: yup.string().required("Harus diisi"),
      jam_to: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        jam_from: values.jam_from,
        jam_to: values.jam_to,
      };
      setUpdateLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/non-shift`, payload)
        .then((r) => {
          if (r.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
            resetForm();
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
            isClosable: true,
            position: "bottom-right",
          });
        })
        .finally(() => {
          setUpdateLoading(false);
        });
    },
  });

  // TODO ambil data nya bro
  const { error, loading, retry } = useDataState<any>({
    initialData: undefined,
    url: "",
    dependencies: [],
  });

  return (
    <CContainer
      p={responsiveSpacing}
      pb={responsiveSpacing}
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
      h={"100%"}
      overflowY={"auto"}
    >
      {error && (
        <>
          <Center my={"auto"} minH={"300px"}>
            <Retry loading={loading} retry={retry} />
          </Center>
        </>
      )}

      {!error && (
        <>
          {loading && (
            <CContainer flex={1} gap={4}>
              <Skeleton h={"60px"} />
              <HStack gap={4}>
                <Skeleton h={"60px"} />
                <Skeleton h={"60px"} />
              </HStack>
              <Skeleton mt={"auto"} ml={"auto"} w={"120px"} />
            </CContainer>
          )}

          {!loading && (
            <>
              <form id="jamKerjaNonShiftForm" onSubmit={formik.handleSubmit}>
                <FormControl mb={4} isInvalid={!!formik.errors.jam_from}>
                  <FormLabel>
                    Nama
                    <RequiredForm />
                  </FormLabel>
                  <StringInput
                    name="nama"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("nama", input);
                    }}
                    inputValue={formik.values.nama}
                    placeholder="Nama Jam Kerja"
                  />
                  <FormErrorMessage>
                    {formik.errors.jam_from as string}
                  </FormErrorMessage>
                </FormControl>

                <FormLabel>
                  Jam Kerja
                  <RequiredForm />
                </FormLabel>

                <Wrap spacing={4}>
                  <FormControl
                    flex={"1 1"}
                    isInvalid={!!formik.errors.jam_from}
                  >
                    <TimePickerModal
                      id="tambah-shift-jam-from-modal"
                      name="jam_from"
                      onConfirm={(input) => {
                        formik.setFieldValue("jam_from", input);
                      }}
                      inputValue={formik.values.jam_from}
                      isError={!!formik.errors.jam_from}
                    />

                    <FormErrorMessage>
                      {formik.errors.jam_from as string}
                    </FormErrorMessage>
                  </FormControl>

                  <Text mt={"5px"} textAlign={"center"}>
                    -
                  </Text>

                  <FormControl flex={"1 1"} isInvalid={!!formik.errors.jam_to}>
                    <TimePickerModal
                      id="tambah-shift-jam-to-modal"
                      name="jam_to"
                      onConfirm={(input) => {
                        formik.setFieldValue("jam_to", input);
                      }}
                      inputValue={formik.values.jam_to}
                      isError={!!formik.errors.jam_to}
                    />

                    <FormErrorMessage>
                      {formik.errors.jam_to as string}
                    </FormErrorMessage>
                  </FormControl>
                </Wrap>
              </form>

              <Button
                className="btn-ap clicky"
                colorScheme="ap"
                ml={"auto"}
                mt={"auto"}
                type="submit"
                form="jamKerjaNonShiftForm"
                isLoading={updateLoading}
              >
                Simpan
              </Button>
            </>
          )}
        </>
      )}
    </CContainer>
  );
}

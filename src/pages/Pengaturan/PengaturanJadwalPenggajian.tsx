import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import Retry from "../../components/dependent/Retry";
import RequiredForm from "../../components/form/RequiredForm";
import Skeleton from "../../components/independent/Skeleton";
import CContainer from "../../components/wrapper/CContainer";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useBodyColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useDataState from "../../hooks/useDataState";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import formatDate from "../../lib/formatDate";
import isHasPermissions from "../../lib/isHasPermissions";
import req from "../../lib/req";

export default function PengaturanJadwalPenggajian() {
  const { error, notFound, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: "/api/rski/dashboard/pengaturan/get-jadwal-penggajian/1",
    dependencies: [],
  });

  const [loadingSimpan, setLoadingSimpan] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { tgl_mulai: data?.tgl_mulai },
    validationSchema: yup
      .object()
      .shape({ tgl_mulai: yup.string().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        tgl_mulai: values.tgl_mulai,
      };
      setLoadingSimpan(true);
      req
        .post(`/api/rski/dashboard/pengaturan/jadwal-penggajian`, payload)
        .then((r) => {
          if (r.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
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
          setLoadingSimpan(false);
        });
    },
  });

  const formikRef = useRef(formik);

  useEffect(() => {
    if (data) {
      formikRef.current.setFieldValue("tgl_mulai", data?.tgl_mulai);
    }
  }, [data]);

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [93]);

  return (
    <CContainer
      p={responsiveSpacing}
      bg={useBodyColor()}
      borderRadius={12}
      flex={"1 1 600px"}
      overflowX={"auto"}
      h={"100%"}
    >
      <>
        {loading && (
          <>
            <FormLabel mb={4}>
              Tanggal Penggajian
              <RequiredForm />
            </FormLabel>

            <SimpleGrid w={"100%"} columns={[7]} gap={4}>
              {Array.from({ length: 28 }).map((_, i) => (
                <Skeleton
                  key={i}
                  p={4}
                  borderRadius={12}
                  aspectRatio={1}
                  flex={"1 1 50px"}
                  h={"auto"}
                />
              ))}
            </SimpleGrid>

            <HStack mt={"auto"} justify={"space-between"}>
              <Skeleton h={"16px"} maxW={"200px"} />

              <Skeleton ml={"auto"} w={"120px"} h={"40px"} />
            </HStack>
          </>
        )}

        {!loading && (
          <>
            {error && !notFound && (
              <Box my={"auto"}>
                <Retry loading={loading} retry={retry} />
              </Box>
            )}

            {!error && (
              <>
                <form
                  id="pengaturanJadwalPenggajianForm"
                  onSubmit={formik.handleSubmit}
                >
                  <FormControl
                    mb={responsiveSpacing}
                    isInvalid={formik.errors.tgl_mulai ? true : false}
                  >
                    <FormLabel>
                      Tanggal Penggajian
                      <RequiredForm />
                    </FormLabel>

                    <SimpleGrid w={"100%"} columns={[7]} gap={4}>
                      {Array.from({ length: 28 }).map((_, i) => {
                        const today = new Date().getDate();

                        return (
                          <Center
                            isDisabled={i < today}
                            p={4}
                            borderRadius={12}
                            as={Button}
                            w={"100%"}
                            h={"100%"}
                            className={
                              i === formik.values.tgl_mulai - 1
                                ? "btn-apa clicky"
                                : "btn-outline clicky"
                            }
                            border={
                              i === formik.values.tgl_mulai - 1
                                ? "1px solid var(--p500a2)"
                                : "1px solid var(--divider3)"
                            }
                            key={i}
                            aspectRatio={1}
                            cursor={"pointer"}
                            flex={"1 1 50px"}
                            onClick={() => {
                              formik.setFieldValue("tgl_mulai", i + 1);
                            }}
                          >
                            <Text fontSize={22} fontWeight={600}>
                              {i + 1}
                            </Text>
                          </Center>
                        );
                      })}
                    </SimpleGrid>

                    <FormErrorMessage>
                      {formik.errors.tgl_mulai as string}
                    </FormErrorMessage>
                  </FormControl>
                </form>

                <HStack
                  mt={"auto"}
                  pt={responsiveSpacing}
                  justify={"space-between"}
                  align={"center"}
                >
                  <Text opacity={0.4}>
                    Terakhir diperbarui : {formatDate(data?.updated_at)}
                  </Text>

                  <PermissionTooltip permission={editPermission}>
                    <Button
                      w={"120px"}
                      className="btn-ap clicky"
                      flexShrink={0}
                      colorScheme="ap"
                      type="submit"
                      form="pengaturanJadwalPenggajianForm"
                      isLoading={loadingSimpan}
                      isDisabled={!editPermission}
                    >
                      Simpan
                    </Button>
                  </PermissionTooltip>
                </HStack>
              </>
            )}
          </>
        )}
      </>
    </CContainer>
  );
}

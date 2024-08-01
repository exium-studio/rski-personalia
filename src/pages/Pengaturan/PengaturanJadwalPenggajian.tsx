import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { useBodyColor } from "../../constant/colors";
import req from "../../constant/req";
import { responsiveSpacing } from "../../constant/sizes";
import useRenderTrigger from "../../global/useRenderTrigger";
import useDataState from "../../hooks/useDataState";

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
            title: "Maaf terjadi kesalahan pada sistem",
            isClosable: true,
            position: "bottom-right",
          });
          setRt(!rt);
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

  return (
    <CContainer
      p={responsiveSpacing}
      bg={useBodyColor()}
      borderRadius={12}
      flex={"1 1 600px"}
      overflowX={"auto"}
      h={"100%"}
    >
      {error && !notFound && (
        <Box my={"auto"}>
          <Retry loading={loading} retry={retry} />
        </Box>
      )}
      <>
        {loading && (
          <>
            <FormLabel>
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

            <Box mt={"auto"}>
              <Skeleton
                mt={responsiveSpacing}
                ml={"auto"}
                w={"120px"}
                h={"40px"}
              />
            </Box>
          </>
        )}

        {!loading && (
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
                  {Array.from({ length: 28 }).map((_, i) => (
                    <Center
                      p={4}
                      borderRadius={12}
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
                  ))}
                </SimpleGrid>

                <FormErrorMessage>
                  {formik.errors.tgl_mulai as string}
                </FormErrorMessage>
              </FormControl>
            </form>

            <Button
              mt={"auto"}
              ml={"auto"}
              w={"120px"}
              className="btn-ap clicky"
              flexShrink={0}
              colorScheme="ap"
              type="submit"
              form="pengaturanJadwalPenggajianForm"
              isLoading={loadingSimpan}
            >
              Simpan
            </Button>
          </>
        )}
      </>
    </CContainer>
  );
}

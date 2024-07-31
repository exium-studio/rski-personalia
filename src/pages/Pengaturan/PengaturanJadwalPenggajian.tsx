import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import RequiredForm from "../../components/form/RequiredForm";
import CContainer from "../../components/wrapper/CContainer";
import { useBodyColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import Retry from "../../components/dependent/Retry";
import Skeleton from "../../components/independent/Skeleton";
import NoData from "../../components/independent/NoData";
import { useEffect, useRef } from "react";

export default function PengaturanJadwalPenggajian() {
  const { error, loading, data, retry } = useDataState<any>({
    initialData: 16,
    url: "",
    dependencies: [],
  });

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { tanggal: data },
    validationSchema: yup
      .object()
      .shape({ tanggal: yup.string().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      //TODO simpan tanggal penggajian
    },
  });

  const formikRef = useRef(formik);

  useEffect(() => {
    if (data) {
      formikRef.current.setFieldValue("tanggal", data);
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
      {error && (
        <Box my={"auto"}>
          <Retry loading={loading} retry={retry} />
        </Box>
      )}
      {!error && (
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
              {(!data || (data && data.length === 0)) && <NoData />}
              {(data || (data && data.length > 0)) && (
                <>
                  <form
                    id="pengaturanJadwalPenggajianForm"
                    onSubmit={formik.handleSubmit}
                  >
                    <FormControl
                      mb={responsiveSpacing}
                      isInvalid={formik.errors.tanggal ? true : false}
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
                              i === formik.values.tanggal - 1
                                ? "btn-apa clicky"
                                : "btn-outline clicky"
                            }
                            border={
                              i === formik.values.tanggal - 1
                                ? "1px solid var(--p500a2)"
                                : "1px solid var(--divider3)"
                            }
                            key={i}
                            aspectRatio={1}
                            cursor={"pointer"}
                            flex={"1 1 50px"}
                            onClick={() => {
                              formik.setFieldValue("tanggal", i + 1);
                            }}
                          >
                            <Text fontSize={22} fontWeight={600}>
                              {i + 1}
                            </Text>
                          </Center>
                        ))}
                      </SimpleGrid>

                      <FormErrorMessage>
                        {formik.errors.tanggal as string}
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
                  >
                    Simpan
                  </Button>
                </>
              )}
            </>
          )}
        </>
      )}
    </CContainer>
  );
}

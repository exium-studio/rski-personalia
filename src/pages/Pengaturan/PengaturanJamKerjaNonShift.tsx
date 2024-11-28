import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  HStack,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import TimePickerModal from "../../components/dependent/input/TimePickerModal";
import Retry from "../../components/dependent/Retry";
import Skeleton from "../../components/independent/Skeleton";
import CContainer from "../../components/wrapper/CContainer";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import days from "../../constant/days";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useDataState from "../../hooks/useDataState";
import formatDate from "../../lib/formatDate";
import isHasPermissions from "../../lib/isHasPermissions";
import req from "../../lib/req";

const JamKerjaItem = ({ id, day }: any) => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const toast = useToast();
  const [rt, setRt] = useState(false);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama: "",
      jam_from: "",
      jam_to: "",
    },
    validationSchema: yup.object().shape({
      nama: yup.string().required("Harus diisi"),
      jam_from: yup.string(),
      jam_to: yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.nama,
        jam_from: values.jam_from || null,
        jam_to: values.jam_to || null,
      };
      setUpdateLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/non-shift/${id}`, payload)
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
          setUpdateLoading(false);
        });
    },
  });

  const { error, data, loading, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/pengaturan/non-shift/${id}`,
    dependencies: [],
  });

  const formikRef = useRef(formik);
  useEffect(() => {
    if (data) {
      formikRef.current.setFieldValue("nama", data?.nama);
      formikRef.current.setFieldValue("jam_from", data?.jam_from);
      formikRef.current.setFieldValue("jam_to", data?.jam_to);
    }
  }, [data, formikRef]);

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [100]);

  return (
    <>
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
            <CContainer flex={1} gap={2}>
              <Skeleton h={"24px"} w={"100px"} />

              <HStack gap={4}>
                <Skeleton h={"40px"} />
                <Skeleton h={"40px"} flexShrink={0} w={"102px"} />
              </HStack>

              <Skeleton h={"12px"} maxW={"200px"} />
            </CContainer>
          )}

          {!loading && (
            <>
              <form
                id={`jamKerjaNonShiftForm-${id}`}
                onSubmit={formik.handleSubmit}
              >
                <CContainer>
                  <Text fontWeight={500} mb={2}>
                    {day}
                  </Text>

                  <HStack gap={responsiveSpacing}>
                    <CContainer>
                      {/* <FormLabel>
                        Jam Kerja
                        <RequiredForm />
                      </FormLabel> */}

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

                        <FormControl
                          flex={"1 1"}
                          isInvalid={!!formik.errors.jam_to}
                        >
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
                    </CContainer>

                    <PermissionTooltip permission={editPermission}>
                      <Button
                        className="btn-ap clicky"
                        colorScheme="ap"
                        ml={"auto"}
                        mt={"auto"}
                        mb={0}
                        type="submit"
                        form={`jamKerjaNonShiftForm-${id}`}
                        isLoading={updateLoading}
                        isDisabled={!editPermission}
                      >
                        Simpan
                      </Button>
                    </PermissionTooltip>
                  </HStack>

                  <Text fontSize={12} opacity={0.4} mt={2}>
                    Terakhir diperbarui : {formatDate(data.updated_at)}
                  </Text>
                </CContainer>
              </form>

              {/* <HStack justify={"space-between"} mt={"auto"}></HStack> */}
            </>
          )}
        </>
      )}
    </>
  );
};

export default function PengaturanJamKerjaNonShift() {
  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <CContainer
      py={responsiveSpacing}
      pb={responsiveSpacing}
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
      h={"100%"}
      overflowY={"auto"}
      className="scrollY"
    >
      <CContainer
        px={responsiveSpacing}
        gap={responsiveSpacing}
        overflowY={"auto"}
        className="scrollY"
      >
        {days.map((day, i) => (
          <JamKerjaItem key={i} id={i + 1} day={day} />
        ))}
      </CContainer>
    </CContainer>
  );
}

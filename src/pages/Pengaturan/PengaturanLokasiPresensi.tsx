import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import NumberInput from "../../components/dependent/input/NumberInput";
import Textarea from "../../components/dependent/input/Textarea";
import Retry from "../../components/dependent/Retry";
import SetLokasiPresensi from "../../components/dependent/SetLokasiPresensi";
import RequiredForm from "../../components/form/RequiredForm";
import Skeleton from "../../components/independent/Skeleton";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { LatLng } from "../../constant/interfaces";
import req from "../../lib/req";
import { responsiveSpacing } from "../../constant/sizes";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import formatDate from "../../lib/formatDate";
import getLocation from "../../lib/getLocation";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";

export default function PengaturanLokasiPresensi() {
  // SX
  const lightDarkColor = useLightDarkColor();

  const [center, setCenter] = useState<LatLng | undefined>(undefined);

  const [loadingSimpan, setLoadingSimpan] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      lat: undefined as any,
      long: undefined as any,
      radius: undefined,
      alamat: undefined,
    },
    validationSchema: yup.object().shape({
      lat: yup.number().required("Harus diisi"),
      long: yup.number().required("Harus diisi"),
      radius: yup.number().required("Harus diisi"),
      alamat: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        alamat: values.alamat,
        lat: values.lat?.toString(),
        long: values.long?.toString(),
        radius: values.radius,
      };
      setLoadingSimpan(true);
      req
        .post(`/api/rski/dashboard/pengaturan/lokasi-kantor`, payload)
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

  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(undefined);

  const formikRef = useRef(formik);
  function getData() {
    setLoading(true);
    req
      .get(`/api/rski/dashboard/pengaturan/get-lokasi-kantor/1`)
      .then((r) => {
        if (r.status === 200) {
          const dataRes = r.data.data;
          setData(dataRes);
          setCenter({ lat: dataRes.lat, lng: dataRes.long });
          formikRef.current.setFieldValue("alamat", dataRes.alamat);
          formikRef.current.setFieldValue("lat", dataRes.lat);
          formikRef.current.setFieldValue("long", dataRes.long);
          formikRef.current.setFieldValue("radius", dataRes.radius);
        }
      })
      .catch((e) => {
        console.log(e);
        getLocation()
          .then(({ lat, long }) => {
            setCenter({ lat: lat, lng: long });
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {});
        setError(true);
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
        setLoading(false);
      });
  }
  const getDataRef = useRef(getData);
  useEffect(() => {
    getDataRef.current();
  }, [rt, getDataRef]);

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [111]);

  return (
    <>
      {error && (
        <Center m={"auto"} minH={"300px"}>
          <Retry loading={loading} retry={getData} />
        </Center>
      )}

      {!error && (
        <>
          <CContainer
            p={responsiveSpacing}
            bg={lightDarkColor}
            borderRadius={12}
            flex={"1 1 600px"}
            h={"100%"}
            overflowY={"auto"}
            className="scrollY"
          >
            {loading && (
              <CContainer gap={responsiveSpacing}>
                <Skeleton h={"40px"} />
                <Skeleton minH={"450px"} />
                <SimpleGrid columns={[1, null, 3]} gap={4}>
                  <Skeleton h={"40px"} />
                  <Skeleton h={"40px"} />
                  <Skeleton h={"40px"} />
                </SimpleGrid>
                <Skeleton h={"83"} />
                <Skeleton ml={"auto"} w={"100px"} h={"40px"} />
              </CContainer>
            )}

            {!loading && data && center && (
              <>
                {center && (
                  <>
                    <SetLokasiPresensi
                      center={center}
                      officeCenter={
                        formik.values.lat && formik.values.long
                          ? {
                              lat: formik.values.lat,
                              lng: formik.values.long,
                            }
                          : undefined
                      }
                      presence_radius={formik.values.radius}
                      setOfficeLoc={(input) => {
                        if (input) {
                          formik.setFieldValue("lat", input.lat);
                          formik.setFieldValue("long", input.lng);
                        }
                      }}
                      setCenter={setCenter}
                    />
                    <Text mt={2} opacity={0.4}>
                      *Klik 2x pada peta untuk menentukan titik presensi
                    </Text>

                    <CContainer mt={responsiveSpacing} flex={1}>
                      <form
                        id="lokasiPresensiForm"
                        onSubmit={formik.handleSubmit}
                      >
                        <SimpleGrid columns={[1, null, 3]} gap={4}>
                          <FormControl mb={4} isInvalid={!!formik.errors.lat}>
                            <FormLabel>
                              Latitude
                              <RequiredForm />
                            </FormLabel>
                            <Input
                              type="number"
                              name="lat"
                              placeholder="-6.28376273"
                              onChange={formik.handleChange}
                              value={formik.values.lat || ""}
                            />
                            <FormErrorMessage>
                              {formik.errors.lat as string}
                            </FormErrorMessage>
                          </FormControl>

                          <FormControl mb={4} isInvalid={!!formik.errors.long}>
                            <FormLabel>
                              Longitude
                              <RequiredForm />
                            </FormLabel>
                            <Input
                              type="number"
                              name="long"
                              placeholder="110.28376273"
                              onChange={formik.handleChange}
                              value={formik.values.long || ""}
                            />
                            <FormErrorMessage>
                              {formik.errors.long as string}
                            </FormErrorMessage>
                          </FormControl>

                          <FormControl
                            mb={4}
                            isInvalid={!!formik.errors.radius}
                          >
                            <FormLabel>
                              Radius Presensi
                              <RequiredForm />
                            </FormLabel>
                            <InputGroup>
                              <InputRightElement pr={4}>
                                <Text>m</Text>
                              </InputRightElement>
                              <NumberInput
                                pr={12}
                                name="radius"
                                placeholder="100"
                                onChangeSetter={(input) => {
                                  formik.setFieldValue("radius", input);
                                }}
                                inputValue={formik.values.radius}
                              />
                            </InputGroup>
                            <FormErrorMessage>
                              {formik.errors.radius as string}
                            </FormErrorMessage>
                          </FormControl>
                        </SimpleGrid>

                        <FormControl isInvalid={!!formik.errors.alamat}>
                          <FormLabel>
                            Alamat
                            <RequiredForm />
                          </FormLabel>
                          <Textarea
                            name="alamat"
                            placeholder="Jalan Soekarno Hatta no.17"
                            onChangeSetter={(input) => {
                              formik.setFieldValue("alamat", input);
                            }}
                            inputValue={formik.values.alamat}
                          />
                          <FormErrorMessage>
                            {formik.errors.alamat as string}
                          </FormErrorMessage>
                        </FormControl>
                      </form>

                      <HStack
                        mt={"auto"}
                        pt={responsiveSpacing}
                        justify={"space-between"}
                        align={"end"}
                      >
                        <Text opacity={0.4}>
                          Terakhir diperbarui : {formatDate(data?.updated_at)}
                        </Text>

                        <PermissionTooltip permission={editPermission}>
                          <Button
                            type="submit"
                            form="lokasiPresensiForm"
                            ml={"auto"}
                            w={"fit-content"}
                            colorScheme="ap"
                            className="btn-ap clicky"
                            isLoading={loadingSimpan}
                            isDisabled={!editPermission}
                          >
                            Simpan
                          </Button>
                        </PermissionTooltip>
                      </HStack>
                    </CContainer>
                  </>
                )}
              </>
            )}
          </CContainer>
        </>
      )}
    </>
  );
}

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import NumberInput from "../../components/dependent/input/NumberInput";
import Textarea from "../../components/dependent/input/Textarea";
import SetLokasiPresensi from "../../components/dependent/SetLokasiPresensi";
import RequiredForm from "../../components/form/RequiredForm";
import Skeleton from "../../components/independent/Skeleton";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { LatLng } from "../../constant/interfaces";
import { responsiveSpacing } from "../../constant/sizes";
import getLocation from "../../lib/getLocation";

export default function PengaturanLokasiPresensi() {
  // SX
  const lightDarkColor = useLightDarkColor();

  const [loading, setLoading] = useState<boolean>(true);
  const [myLoc, setMyLoc] = useState<LatLng | undefined>(undefined);

  useEffect(() => {
    getLocation()
      .then(({ lat, long }) => {
        setMyLoc({ lat: lat, lng: long });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      lat: undefined,
      long: undefined,
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
      console.log(values);
    },
  });

  return (
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

      {!loading && (
        <>
          {myLoc && (
            <>
              <SetLokasiPresensi
                center={myLoc}
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
              />
              <Text mt={2} opacity={0.4}>
                *Klik 2x pada peta untuk menentukan titik presensi
              </Text>

              <CContainer mt={responsiveSpacing} flex={1}>
                <form>
                  <SimpleGrid columns={[1, null, 3]} gap={4}>
                    <FormControl mb={4} isInvalid={!!formik.errors.lat}>
                      <FormLabel>
                        Latitude
                        <RequiredForm />
                      </FormLabel>
                      <Input
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
                        name="long"
                        placeholder="110.28376273"
                        onChange={formik.handleChange}
                        value={formik.values.long || ""}
                      />
                      <FormErrorMessage>
                        {formik.errors.long as string}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl mb={4} isInvalid={!!formik.errors.radius}>
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

                  <FormControl isInvalid={!!formik.errors.radius}>
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
                      {formik.errors.radius as string}
                    </FormErrorMessage>
                  </FormControl>
                </form>

                <CContainer mt={"auto"}>
                  <Button
                    mt={responsiveSpacing}
                    ml={"auto"}
                    w={"fit-content"}
                    colorScheme="ap"
                    className="btn-ap clicky"
                  >
                    Simpan
                  </Button>
                </CContainer>
              </CContainer>
            </>
          )}
        </>
      )}
    </CContainer>
  );
}

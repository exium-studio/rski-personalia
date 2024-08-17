import { Box, Button, Checkbox, HStack, Text, Wrap } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Retry from "../../components/dependent/Retry";
import TabelPengaturanKeizinan from "../../components/dependent/TabelPengaturanKeizinan";
import NoData from "../../components/independent/NoData";
import Skeleton from "../../components/independent/Skeleton";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";
import { useFormik } from "formik";
import * as yup from "yup";

interface Props {
  role_id: number;
}

export default function PengaturanKeizinan({ role_id }: Props) {
  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/pengaturan/role/${role_id}`,
    dependencies: [],
  });

  const [totalPermissions, setTotalPermissions] = useState<number>(0);
  const [totalPermissionsAllowed, setTotalPermissionsAllowed] =
    useState<number>(0);
  const [allPermissions, setAllPermissions] = useState<boolean>(false);
  const [simpanLoading, setSimpanLoading] = useState<boolean>(false);
  const [simpanTrigger, setSimpanTrigger] = useState<boolean | null>(null);

  useEffect(() => {
    let tp = 0;
    let tpa = 0;

    if (data) {
      data?.initialValues?.forEach((item: any) => {
        Object.keys(item?.permissions)?.forEach((permissionKey) => {
          if (permissionKey !== null) {
            tp++;
          }
          if (permissionKey) {
            tpa++;
          }
        });
      });
    }

    setTotalPermissions(tp);
    setTotalPermissionsAllowed(tpa);

    if (tp === tpa) {
      setAllPermissions(true);
    }
  }, [data]);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { permissions: data },
    validationSchema: yup
      .object()
      .shape({ permissions: yup.array().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
    },
  });

  const formikRef = useRef(formik);
  useEffect(() => {
    if (data?.initialValues) {
      formikRef.current.setFieldValue("permissions", data?.initialValues);
    }
  }, [data, formikRef]);

  const permissionsSetter = (state: boolean) => {
    const newPermissionsData = formik.values.permissions.map((item: any) => {
      let newPermissions = {};
      Object.keys(item.permissions).forEach((permKey) => {
        if (item.permissions[permKey] !== null) {
          //@ts-ignore
          newPermissions[permKey] = state;
        } else {
          //@ts-ignore
          newPermissions[permKey] = null;
        }
      });

      return {
        name: item.name,
        permissions: newPermissions,
      };
    });

    return newPermissionsData;
  };

  function toggleAllPermissions() {
    if (!allPermissions) {
      formik.setFieldValue("permissions", permissionsSetter(true));
    } else {
      formik.setFieldValue("permissions", permissionsSetter(false));
    }
  }

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <CContainer
      flex={1}
      pt={0}
      px={responsiveSpacing}
      bg={lightDarkColor}
      borderRadius={12}
      overflowY={"auto"}
      className="scrollY"
    >
      <Wrap justify={"space-between"} mb={responsiveSpacing}>
        <HStack gap={8}>
          <HStack>
            <Text>Role :</Text>
            <Text fontWeight={600}>{data?.name}</Text>
          </HStack>

          <Box onClick={toggleAllPermissions}>
            <Checkbox
              colorScheme="ap"
              onChange={(e) => {
                setAllPermissions(e.target.checked);
              }}
              isChecked={allPermissions}
              // onClick={(e) => e.stopPropagation()}
            >
              <Text fontWeight={500} mt={"-3px"}>
                Semua izin
              </Text>
            </Checkbox>
          </Box>
        </HStack>

        <Button
          colorScheme="ap"
          className="btn-ap clicky"
          minW={"120px"}
          isLoading={simpanLoading}
          onClick={() => {
            setSimpanTrigger(!simpanTrigger);
          }}
        >
          Simpan
        </Button>
      </Wrap>

      {error && (
        <Box my={"auto"}>
          <Retry loading={loading} retry={retry} />
        </Box>
      )}

      {!error && (
        <>
          {loading && (
            <>
              <Skeleton flex={1} />
            </>
          )}

          {!loading && (
            <>
              {(!data ||
                (data && formik.values?.permissions?.length === 0)) && (
                <NoData />
              )}

              {(data || (data && formik.values?.permissions?.length > 0)) && (
                <>
                  <TabelPengaturanKeizinan
                    data={formik.values?.permissions}
                    totalPermissions={totalPermissions}
                    setTotalPermissions={setTotalPermissions}
                    totalPermissionsAllowed={totalPermissionsAllowed}
                    setTotalPermissionsAllowed={setTotalPermissionsAllowed}
                    setAllPermissions={setAllPermissions}
                    formik={formik}
                    // toggleSemuaIzin={toggleSemuaIzin}
                    // semuaIzin={semuaIzin}
                    // setSemuaIzin={setSemuaIzin}
                    // simpanTrigger={simpanTrigger}
                    // setSimpanLoading={setSimpanLoading}
                    // checkAllPermissionsTrue={checkAllPermissionsTrue}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </CContainer>
  );
}

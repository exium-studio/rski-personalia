import {
  Box,
  Button,
  Checkbox,
  HStack,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import Retry from "../../components/dependent/Retry";
import NoData from "../../components/independent/NoData";
import Skeleton from "../../components/independent/Skeleton";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import useDataState from "../../hooks/useDataState";
import req from "../../lib/req";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import TabelPengaturanHakAkses from "../../components/dependent/TabelPengaturanHakAkses";
import backOnClose from "../../lib/backOnClose";

interface Props {
  role_id: number;
}

export default function PengaturanHakAkses({ role_id }: Props) {
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
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  useEffect(() => {
    let tp = 0;
    let tpa = 0;

    if (data) {
      data?.permissions?.forEach((item: any, i: number) => {
        Object.keys(item?.permissions)?.forEach((permissionKey: any) => {
          if (item.permissions[permissionKey]?.id !== null) {
            tp++;
          }
          if (item.permissions[permissionKey]?.has_permission) {
            tpa++;
          }
        });
      });
    }

    setTotalPermissions(tp);
    setTotalPermissionsAllowed(tpa);

    if (tp === tpa) {
      setAllPermissions(true);
    } else {
      setAllPermissions(false);
    }
  }, [data]);

  const getIdsWithPermissionTrue = (data: any) => {
    return data.flatMap((item: any) =>
      Object.values(item.permissions)
        .filter((permission: any) => permission.has_permission === true)
        .map((permission: any) => permission.id)
    );
  };

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { permissions: data?.permissions },
    validationSchema: yup
      .object()
      .shape({ permissions: yup.array().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      setSimpanLoading(true);
      const payload = {
        permission_ids: getIdsWithPermissionTrue(values.permissions),
      };

      // console.log(values.permissions);
      // console.log(payload);

      req
        .post(`/api/rski/dashboard/pengaturan/permissions/${role_id}`, payload)
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
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setSimpanLoading(false);
        });
    },
  });

  const formikRef = useRef(formik);
  useEffect(() => {
    if (data?.permissions) {
      formikRef.current.setFieldValue("permissions", data?.permissions);
    }
  }, [data, formikRef]);

  const permissionsSetter = (state: boolean) => {
    const newPermissionsData = formik.values.permissions.map((item: any) => {
      let newPermissions = {};
      Object.keys(item.permissions).forEach((permKey) => {
        if (item.permissions[permKey].id !== null) {
          //@ts-ignore
          newPermissions[permKey] = {
            //@ts-ignore
            id: item.permissions[permKey]?.id,
            //@ts-ignore
            has_permission: state,
          };
        } else {
          //@ts-ignore
          newPermissions[permKey] = {
            id: null,
            has_permission: null,
          };
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
    if (role_id !== 1) {
      if (!allPermissions) {
        formik.setFieldValue("permissions", permissionsSetter(true));
      } else {
        formik.setFieldValue("permissions", permissionsSetter(false));
      }
    }
  }

  // SX
  const lightDarkColor = useLightDarkColor();

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [62]);

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
      {error && (
        <Box my={"auto"}>
          <Retry loading={loading} retry={retry} />
        </Box>
      )}

      {!error && (
        <>
          {loading && (
            <>
              <HStack mb={responsiveSpacing}>
                <Skeleton w={"120px"} />
                <Skeleton w={"120px"} />
                <Skeleton w={"120px"} ml={"auto"} />
              </HStack>
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
                  <Wrap justify={"space-between"} mb={responsiveSpacing}>
                    <HStack gap={8}>
                      <HStack>
                        <Text>Role :</Text>
                        <Text fontWeight={600}>{data?.name}</Text>
                      </HStack>

                      <Box mt={"5px"} onClick={toggleAllPermissions}>
                        <Checkbox
                          colorScheme="ap"
                          onChange={(e) => {
                            setAllPermissions(e.target.checked);
                          }}
                          isChecked={allPermissions}
                          isDisabled={role_id === 1}
                          size={"lg"}
                          // onClick={(e) => e.stopPropagation()}
                        >
                          <Text fontWeight={500} mt={"-1px"}>
                            Semua akses
                          </Text>
                        </Checkbox>
                      </Box>
                    </HStack>

                    <PermissionTooltip permission={editPermission}>
                      <Button
                        colorScheme="ap"
                        className="btn-ap clicky"
                        minW={"120px"}
                        isLoading={simpanLoading}
                        onClick={() => {
                          formik.submitForm();
                        }}
                        isDisabled={role_id === 1 || !editPermission}
                      >
                        Simpan
                      </Button>
                    </PermissionTooltip>
                  </Wrap>

                  <TabelPengaturanHakAkses
                    role_id={role_id}
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

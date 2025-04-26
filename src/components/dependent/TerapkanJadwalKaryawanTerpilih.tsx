import {
  Avatar,
  Button,
  ButtonGroup,
  Checkbox,
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
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiEditBoxLine } from "@remixicon/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import isDatePassed from "../../lib/isDatePassed";
import isHasPermissions from "../../lib/isHasPermissions";
import req from "../../lib/req";
import RequiredForm from "../form/RequiredForm";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import SelectShiftByUser from "./_Select/SelectShiftByUser";
import DisclosureHeader from "./DisclosureHeader";
import JenisKaryawanBadge from "./JenisKaryawanBadge";
import CContainer from "../wrapper/CContainer";
import useGetUserData from "../../hooks/useGetUserData";

interface Props {
  data: any;
  tgl: Date | string;
  index?: number;
  rowIndex?: number;
}

export default function TerapkanJadwalKaryawanTerpilih({
  data,
  tgl,
  index,
  rowIndex,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `terapkan-jadwal-${data.id}-${rowIndex}-${index}`,
    isOpen,
    onOpen,
    onClose
  );

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();
  const [libur, setLibur] = useState<boolean>(false);
  const [exLibur, setExLibur] = useState<boolean>(false);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { shift: undefined as any, tgl_mulai: tgl },
    validationSchema: yup.object().shape({
      shift: yup.object().required("Harus diisi"),
      tgl_mulai: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        shift_id: values.shift.value,
        tgl_mulai: formatDate(values.tgl_mulai as string, "short"),
        tgl_selesai: "",
        ex_libur: exLibur ? 1 : 0,
      };
      setLoading(true);
      req
        .post(
          `/api/rski/dashboard/jadwal-karyawan/create-shift/${data.user.id}`,
          payload
        )
        .then((r) => {
          if (r.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
            backOnClose();
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
          setLoading(false);
        });
    },
  });

  const formikRef = useRef(formik);
  useEffect(() => {
    if (libur) {
      formikRef.current.setFieldValue("shift", { value: 0, label: "Libur" });
    }
  }, [libur, formikRef]);
  useEffect(() => {
    if (exLibur) {
      formikRef.current.setFieldValue("shift", {
        value: 0,
        label: "Ex Libur",
      });
    }
  }, [exLibur, formikRef]);
  useEffect(() => {
    if (!libur && !exLibur) {
      formikRef.current.setFieldValue("shift", undefined);
    }
  }, [libur, exLibur, formikRef]);

  const user = useGetUserData();
  const { userPermissions } = useAuth();
  const createPermissions = isHasPermissions(userPermissions, [19]);
  const valid = user.id === 1 || !isDatePassed(tgl, true);

  return (
    <>
      <PermissionTooltip
        permission={createPermissions}
        boxProps={{ w: "100%" }}
      >
        <VStack
          as={Button}
          p={3}
          gap={1}
          borderRadius={8}
          minW={"180px"}
          w={"100%"}
          h={"100%"}
          minH={"74px"}
          cursor={"pointer"}
          className="btn-ap clicky"
          colorScheme="ap"
          onClick={onOpen}
          justify={"center"}
          isDisabled={!valid || !createPermissions}
          // border={"1px solid var(--divider3) !important"}
        >
          <Icon as={RiEditBoxLine} fontSize={20} />
          <Text fontWeight={500}>Terapkan</Text>
        </VStack>
      </PermissionTooltip>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
          setLibur(false);
          setExLibur(false);
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader
              title="Terapkan Jadwal"
              onClose={() => {
                formik.resetForm();
                setLibur(false);
              }}
            />
          </ModalHeader>
          <ModalBody>
            <VStack gap={responsiveSpacing} px={1} flexShrink={0}>
              <Avatar
                mb={"auto"}
                size={"xl"}
                src={data.user.foto_profil}
                name={data.user.nama}
              />

              <VStack align={"stretch"} w={"100%"} gap={4}>
                <HStack justify={"space-between"}>
                  <Text fontSize={14} w={"120px"} opacity={0.6}>
                    Nama
                  </Text>
                  <Text textAlign={"right"} fontWeight={500}>
                    {data.user.nama}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text fontSize={14} w={"120px"} opacity={0.6}>
                    Tanggal Mulai
                  </Text>
                  <Text textAlign={"right"}>{formatDate(tgl as string)}</Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text fontSize={14} w={"120px"} opacity={0.6}>
                    Jenis Karyawan
                  </Text>
                  <JenisKaryawanBadge data={data.unit_kerja?.jenis_karyawan} />
                </HStack>
              </VStack>
            </VStack>

            <form
              id="terapkanJadwalKaryawanTerpilihForm"
              onSubmit={formik.handleSubmit}
            >
              <FormControl mt={6} isInvalid={!!formik.errors.shift}>
                <FormLabel>
                  Jam Kerja (Shift)
                  <RequiredForm />
                </FormLabel>
                <SelectShiftByUser
                  data_karyawan_id={data.user.data_karyawan_id}
                  name="shift"
                  placeholder="Pilih Jam Kerja"
                  onConfirm={(input) => {
                    formik.setFieldValue("shift", input);
                  }}
                  inputValue={formik.values.shift}
                  isError={!!formik.errors.shift}
                  isDisabled={libur || exLibur}
                  mb={4}
                />
                <CContainer gap={2}>
                  <Checkbox
                    colorScheme="ap"
                    onChange={(e) => {
                      setExLibur(false);
                      setLibur(e.target.checked);
                    }}
                    isChecked={libur}
                    isDisabled={!valid}
                  >
                    <Text mt={"-3px"}>Jadwalkan Libur</Text>
                  </Checkbox>
                  <Checkbox
                    colorScheme="ap"
                    onChange={(e) => {
                      setLibur(false);
                      setExLibur(e.target.checked);
                    }}
                    isChecked={exLibur}
                    isDisabled={!valid}
                  >
                    <Text mt={"-3px"}>Jadwalkan Ex Libur</Text>
                  </Checkbox>
                </CContainer>
                <FormErrorMessage>
                  {formik.errors.shift as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup w={"100%"}>
              <Button
                type="submit"
                form="terapkanJadwalKaryawanTerpilihForm"
                w={"100%"}
                colorScheme="ap"
                className="btn-ap clicky"
                isLoading={loading}
              >
                Tetapkan
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

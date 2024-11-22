import {
  Avatar,
  Box,
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
import formatTime from "../../lib/formatTime";
import isDatePassed from "../../lib/isDatePassed";
import isHasPermissions from "../../lib/isHasPermissions";
import isShiftMalam from "../../lib/isShiftMalam";
import req from "../../lib/req";
import RequiredForm from "../form/RequiredForm";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import SelectShiftByUser from "./_Select/SelectShiftByUser";
import DisclosureHeader from "./DisclosureHeader";
import JenisKaryawanBadge from "./JenisKaryawanBadge";

interface Props {
  data: any;
  jadwal: any;
  tgl?: Date | string;
  index?: number;
  rowIndex?: number;
}

export default function TabelJadwalItem({
  data,
  tgl,
  jadwal,
  index,
  rowIndex,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `jadwal-detail-${data.id}-${rowIndex}-${index}`,
    isOpen,
    onOpen,
    onClose
  );
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      shift: jadwal?.shift
        ? {
            value: jadwal?.shift?.id,
            label: `${formatTime(jadwal?.shift?.jam_from)}-${formatTime(
              jadwal?.shift?.jam_to
            )}`,
            label2: jadwal?.shift?.nama,
          }
        : {
            value: 0,
            label: "Libur",
          },
      tgl_mulai: tgl,
    },
    validationSchema: yup
      .object()
      .shape({ shift: yup.object().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        shift_id: values.shift.value,
        tgl_mulai: formatDate(values.tgl_mulai as string, "short"),
        tgl_selesai: "",
        _method: "patch",
      };
      setLoading(true);
      req
        .post(
          `/api/rski/dashboard/jadwal-karyawan/data-jadwal/${data.user.id}`,
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
            resetForm();
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

  const [libur, setLibur] = useState<boolean>(false);
  useEffect(() => {
    if (!jadwal?.shift) {
      setLibur(true);
    }
  }, [jadwal?.shift]);

  const formikRef = useRef(formik);
  useEffect(() => {
    formikRef.current.resetForm();
    if (libur) {
      formikRef.current.setFieldValue("shift", { value: 0, label: "Libur" });
    }
  }, [libur, formikRef]);

  const { userPermissions } = useAuth();
  const editPermissions = isHasPermissions(userPermissions, [20]);

  const listJadwal = data?.list_jadwal;
  const shiftMalam = isShiftMalam(
    jadwal?.shift?.jam_from,
    jadwal?.shift?.jam_to
  );

  const shiftMalamLanjutan =
    index && index - 1 >= 0 && listJadwal[index - 1]
      ? isShiftMalam(
          listJadwal[index - 1]?.shift?.jam_from,
          listJadwal[index - 1]?.shift?.jam_to
        )
      : false;

  const renderJamKerja =
    shiftMalam && shiftMalamLanjutan
      ? jadwal?.shift
        ? `${formatTime("00:00:00")} - 
              ${formatTime(jadwal?.shift?.jam_to)}`
        : "-"
      : shiftMalam
      ? jadwal?.shift
        ? `${formatTime(jadwal?.shift?.jam_from)} - 
              ${formatTime("00:00:00")}`
        : "-"
      : jadwal?.shift
      ? `${formatTime(jadwal?.shift?.jam_from)} - 
              ${formatTime(jadwal?.shift?.jam_to)}`
      : "-";

  return (
    <>
      <PermissionTooltip
        permission={editPermissions}
        boxProps={{ w: "100%", h: "100%" }}
      >
        <VStack
          as={Button}
          p={3}
          pt={2}
          pr={2}
          gap={1}
          borderRadius={8}
          minW={"180px"}
          w={"100%"}
          minH={"74px"}
          h={"100%"}
          align={"stretch"}
          justify={"center"}
          className="btn-solid clicky"
          cursor={"pointer"}
          onClick={() => {
            if (!(shiftMalam && shiftMalamLanjutan)) {
              onOpen();
            }
          }}
          isDisabled={!editPermissions}
        >
          <HStack gap={3} justify={"space-between"} flex={1}>
            <Box>
              <Text
                fontWeight={400}
                textAlign={"left"}
                noOfLines={1}
                mb={1}
                fontSize={"sm"}
              >
                {jadwal?.shift?.nama || "Libur"}
              </Text>
              <Text
                fontWeight={400}
                textAlign={"left"}
                fontSize={"sm"}
                whiteSpace={"nowrap"}
                // opacity={jadwal?.shift ? 1 : 0}
              >
                {renderJamKerja}
              </Text>
            </Box>

            {data.unit_kerja?.jenis_karyawan === 1 &&
              !isDatePassed(tgl as string) && (
                <Icon
                  as={RiEditBoxLine}
                  fontSize={20}
                  alignSelf={"flex-start"}
                  color={
                    shiftMalam && shiftMalamLanjutan
                      ? "var(--divider-text)"
                      : "p.500"
                  }
                  mb={"auto"}
                />
              )}
          </HStack>
        </VStack>
      </PermissionTooltip>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Detail Jadwal"} />
          </ModalHeader>
          <ModalBody>
            <VStack gap={responsiveSpacing} flexShrink={0}>
              <Avatar
                mb={"auto"}
                size={"xl"}
                src={data.user.foto_profil}
                name={data.user.nama}
              />

              <VStack align={"stretch"} w={"100%"} gap={4}>
                <HStack justify={"space-between"}>
                  <Text w={"120px"} opacity={0.6}>
                    Nama
                  </Text>
                  <Text textAlign={"right"}>{data.user.nama}</Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text w={"120px"} opacity={0.6}>
                    Tanggal Masuk
                  </Text>
                  <Text textAlign={"right"}>
                    {formatDate(jadwal.tgl_mulai as string)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text w={"120px"} opacity={0.6}>
                    Tanggal Selesai
                  </Text>
                  <Text textAlign={"right"}>
                    {formatDate(jadwal.tgl_selesai as string)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text w={"120px"} opacity={0.6}>
                    Jenis Karyawan
                  </Text>
                  <JenisKaryawanBadge data={data.unit_kerja?.jenis_karyawan} />
                </HStack>

                {data.unit_kerja?.jenis_karyawan === 0 && (
                  <HStack justify={"space-between"}>
                    <Text w={"120px"} opacity={0.6}>
                      Jam Kerja
                    </Text>
                    <Text>{`${formatTime(
                      jadwal?.shift?.jam_from
                    )} - ${formatTime(jadwal?.shift?.jam_to)}`}</Text>
                  </HStack>
                )}
              </VStack>
            </VStack>

            {data.unit_kerja?.jenis_karyawan === 1 && (
              <form
                id="terapkanJadwalKaryawanTerpilihForm"
                onSubmit={formik.handleSubmit}
              >
                <FormControl mt={4} isInvalid={!!formik.errors.shift}>
                  <FormLabel>
                    Jam Kerja (Shift)
                    <RequiredForm />
                  </FormLabel>
                  <SelectShiftByUser
                    data_karyawan_id={data.user.data_karyawan_id}
                    name="shift"
                    placeholder="Pilih Jam Kerja (Shift)"
                    onConfirm={(input) => {
                      formik.setFieldValue("shift", input);
                    }}
                    inputValue={formik.values.shift}
                    isDisabled={isDatePassed(tgl as string) || libur}
                    mb={4}
                  />
                  <Checkbox
                    colorScheme="ap"
                    onChange={(e) => {
                      setLibur(e.target.checked);
                    }}
                    isChecked={libur}
                    isDisabled={isDatePassed(tgl as string)}
                  >
                    <Text mt={"-3px"}>Jadwalkan Libur</Text>
                  </Checkbox>
                  <FormErrorMessage>
                    {formik.errors.shift as string}
                  </FormErrorMessage>
                </FormControl>
              </form>
            )}
          </ModalBody>
          <ModalFooter gap={2}>
            {data.unit_kerja?.jenis_karyawan === 1 && (
              <ButtonGroup w={"100%"}>
                <Button
                  w={"100%"}
                  type="submit"
                  form="terapkanJadwalKaryawanTerpilihForm"
                  colorScheme="ap"
                  className="btn-ap clicky"
                  isLoading={loading}
                  isDisabled={isDatePassed(tgl as string)}
                >
                  Simpan
                </Button>
              </ButtonGroup>
            )}

            {data.unit_kerja?.jenis_karyawan === 0 && (
              <Button
                w={"100%"}
                className="btn-solid clicky"
                onClick={() => {
                  backOnClose();
                  formik.resetForm();
                }}
              >
                Mengerti
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

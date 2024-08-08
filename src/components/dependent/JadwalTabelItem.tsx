import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
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
import { useState } from "react";
import * as yup from "yup";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatTime from "../../lib/formatTime";
import isDatePassed from "../../lib/isDatePassed";
import RequiredForm from "../form/RequiredForm";
import SelectShift from "./_Select/SelectShift";
import DeleteJadwalModal from "./DeleteJadwalModal";
import DisclosureHeader from "./DisclosureHeader";
import JenisKaryawanBadge from "./JenisKaryawanBadge";
import req from "../../constant/req";
import useRenderTrigger from "../../global/useRenderTrigger";

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
      shift: {
        value: jadwal?.shift?.id,
        label: jadwal?.shift?.nama,
        label2: `${formatTime(jadwal.shift.jam_from)}-${formatTime(
          jadwal.shift.jam_to
        )}`,
      },
      tgl_mulai: tgl,
    },
    validationSchema: yup
      .object()
      .shape({ shift: yup.object().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        shift_id: values.shift.value,
        tgl_mulai: values.tgl_mulai,
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
              "Maaf terjadi kesalahan pada sistem",
            isClosable: true,
            position: "bottom-right",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <VStack
        p={3}
        pt={2}
        pr={2}
        gap={1}
        borderRadius={8}
        w={"100%"}
        minH={"74px"}
        align={"stretch"}
        justify={"center"}
        className="btn-solid clicky"
        cursor={"pointer"}
        onClick={onOpen}
      >
        <HStack gap={3} justify={"space-between"} flex={1}>
          <Box>
            <Text noOfLines={1} mb={1} fontSize={14}>
              {jadwal?.shift?.nama}
            </Text>
            <Text fontSize={14} whiteSpace={"nowrap"}>
              {formatTime(jadwal?.shift?.jam_from)} -{" "}
              {formatTime(jadwal?.shift?.jam_to)}
            </Text>
          </Box>

          {data.unit_kerja.jenis_karyawan === 1 && (
            <Icon
              as={RiEditBoxLine}
              fontSize={20}
              alignSelf={"flex-start"}
              color={"p.500"}
              mb={"auto"}
            />
          )}
        </HStack>
      </VStack>

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
                    Tanggal Masuk
                  </Text>
                  <Text textAlign={"right"}>
                    {formatDate(jadwal.tgl_mulai as string)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text fontSize={14} w={"120px"} opacity={0.6}>
                    Tanggal Selesai
                  </Text>
                  <Text textAlign={"right"}>
                    {formatDate(jadwal.tgl_selesai as string)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text fontSize={14} w={"120px"} opacity={0.6}>
                    Jenis Pegawai
                  </Text>
                  <JenisKaryawanBadge data={data.unit_kerja.jenis_karyawan} />
                </HStack>

                {data.unit_kerja.jenis_karyawan === 0 && (
                  <HStack justify={"space-between"}>
                    <Text fontSize={14} w={"120px"} opacity={0.6}>
                      Jam Kerja
                    </Text>
                    <Text>{`${formatTime(
                      jadwal?.shift?.jam_from
                    )} - ${formatTime(jadwal?.shift?.jam_to)}`}</Text>
                  </HStack>
                )}
              </VStack>
            </VStack>

            {data.unit_kerja.jenis_karyawan === 1 && (
              <form
                id="terapkanJadwalKaryawanTerpilihForm"
                onSubmit={formik.handleSubmit}
              >
                <FormControl mt={3} isInvalid={!!formik.errors.shift}>
                  <FormLabel>
                    Shift
                    <RequiredForm />
                  </FormLabel>
                  <SelectShift
                    name="shift"
                    placeholder="Pilih Jadwal"
                    onConfirm={(input) => {
                      formik.setFieldValue("shift", input);
                    }}
                    inputValue={formik.values.shift}
                    isDisabled={isDatePassed(data.tgl_masuk)}
                  />
                  <FormErrorMessage>
                    {formik.errors.shift as string}
                  </FormErrorMessage>
                </FormControl>
              </form>
            )}
          </ModalBody>
          <ModalFooter gap={2}>
            {data.unit_kerja.jenis_karyawan === 1 && (
              <ButtonGroup w={"100%"}>
                <DeleteJadwalModal
                  data={data}
                  isDisabled={isDatePassed(data.tgl_masuk) || loading}
                  noUseBackOnClose
                />

                <Button
                  w={"100%"}
                  type="submit"
                  form="terapkanJadwalKaryawanTerpilihForm"
                  colorScheme="ap"
                  className="btn-ap clicky"
                  isLoading={loading}
                  isDisabled={isDatePassed(data.tgl_masuk)}
                >
                  Simpan
                </Button>
              </ButtonGroup>
            )}

            {data.unit_kerja.jenis_karyawan === 0 && (
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

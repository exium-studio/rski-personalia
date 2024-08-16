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
import req from "../../constant/req";
import { responsiveSpacing } from "../../constant/sizes";
import useRenderTrigger from "../../global/useRenderTrigger";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import isDatePassed from "../../lib/isDatePassed";
import RequiredForm from "../form/RequiredForm";
import SelectShift from "./_Select/SelectShift";
import DisclosureHeader from "./DisclosureHeader";
import JenisKaryawanBadge from "./JenisKaryawanBadge";

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

  const [libur, setLibur] = useState<boolean>(false);

  const formikRef = useRef(formik);
  useEffect(() => {
    formikRef.current.resetForm();
    if (libur) {
      formikRef.current.setFieldValue("shift", { value: 0, label: "Libur" });
    }
  }, [libur, formikRef]);

  // SX

  return (
    <>
      <VStack
        as={Button}
        p={3}
        gap={1}
        borderRadius={8}
        w={"100%"}
        h={"100%"}
        minH={"74px"}
        cursor={"pointer"}
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        justify={"center"}
        isDisabled={isDatePassed(tgl)}
        // border={"1px solid var(--divider3) !important"}
      >
        <Icon as={RiEditBoxLine} fontSize={20} />
        <Text fontWeight={500}>Terapkan</Text>
      </VStack>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
          setLibur(false);
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
                    Jenis Pegawai
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
                  Jam kerja
                  <RequiredForm />
                </FormLabel>
                <SelectShift
                  name="shift"
                  placeholder="Pilih Jam Kerja"
                  onConfirm={(input) => {
                    formik.setFieldValue("shift", input);
                  }}
                  inputValue={formik.values.shift}
                  isError={!!formik.errors.shift}
                  isDisabled={libur}
                  mb={4}
                />
                <Checkbox
                  colorScheme="ap"
                  onChange={(e) => {
                    setLibur(e.target.checked);
                  }}
                  isChecked={libur}
                >
                  <Text mt={"-3px"}>Jadwalkan Libur</Text>
                </Checkbox>
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

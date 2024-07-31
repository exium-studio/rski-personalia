import {
  Avatar,
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
  VStack,
} from "@chakra-ui/react";
import { RiEditBoxLine } from "@remixicon/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { responsiveSpacing } from "../../constant/sizes";
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

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { shift: "" as any },
    validationSchema: yup
      .object()
      .shape({ shift: yup.object().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
    },
  });

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
              }}
            />
          </ModalHeader>
          <ModalBody>
            <VStack gap={responsiveSpacing} px={1} flexShrink={0} mb={4}>
              <Avatar
                mb={"auto"}
                size={"xl"}
                src={data.user.foto_profil}
                name={data.user.nama}
              />

              <VStack align={"stretch"} w={"100%"} gap={3}>
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
                    {formatDate(data.tgl_masuk as string)}
                  </Text>
                </HStack>

                <HStack justify={"space-between"}>
                  <Text fontSize={14} w={"120px"} opacity={0.6}>
                    Jenis Pegawai
                  </Text>
                  <JenisKaryawanBadge data={data.unit_kerja.jenis_karyawan} />
                </HStack>
              </VStack>
            </VStack>

            <form
              id="terapkanJadwalKaryawanTerpilihForm"
              onSubmit={formik.handleSubmit}
            >
              <FormControl
                mt={6}
                isInvalid={formik.errors.shift ? true : false}
              >
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
                />
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
              >
                Simpan
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

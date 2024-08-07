import {
  Button,
  ButtonGroup,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnCloseOld";
import MultiSelectKaryawan from "../dependent/_Select/MultiSelectKaryawan";
import SelectShift from "../dependent/_Select/SelectShift";
import DisclosureHeader from "../dependent/DisclosureHeader";
import DatePickerModal from "../dependent/input/DatePickerModal";
import RequiredForm from "../form/RequiredForm";
import { iconSize } from "../../constant/sizes";
import { RiCalendarFill } from "@remixicon/react";

interface Props extends ButtonProps {}

export default function TerapkanJadwalModal({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("terapkan-jadwal-batch-modal", isOpen, onOpen, onClose);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      list_karyawan: undefined,
      tgl_mulai: undefined,
      tgl_selesai: undefined,
      shift: undefined,
    },
    validationSchema: yup.object().shape({
      list_karyawan: yup.array().min(1, "Harus diisi").required("Harus diisi"),
      tgl_mulai: yup.string().required("Harus diisi"),
      tgl_selesai: yup.string().required("Harus diisi"),
      shift: yup.object().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
    },
  });

  return (
    <>
      <Button
        colorScheme="ap"
        className="btn-ap clicky"
        onClick={onOpen}
        leftIcon={<Icon as={RiCalendarFill} fontSize={iconSize} />}
        {...props}
      >
        Terapkan Jadwal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
          formik.resetForm();
        }}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={0}>
            <DisclosureHeader
              title="Terapkan Jadwal"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="terapkanJadwalForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={!!formik.errors.list_karyawan}>
                <FormLabel>
                  Karyawan
                  <RequiredForm />
                </FormLabel>
                <MultiSelectKaryawan
                  name="list_karyawan"
                  onConfirm={(input) => {
                    formik.setFieldValue("list_karyawan", input);
                  }}
                  inputValue={formik.values.list_karyawan}
                  isError={!!formik.errors.list_karyawan}
                  optionsDisplay="chip"
                />
                <FormErrorMessage>
                  {formik.errors.list_karyawan as string}
                </FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl mb={4} isInvalid={!!formik.errors.tgl_mulai}>
                  <FormLabel>
                    Tanggal Mulai
                    <RequiredForm />
                  </FormLabel>
                  <DatePickerModal
                    id="terapkan-jadwal-tanggal-mulai"
                    name="tgl_mulai"
                    onConfirm={(input) => {
                      formik.setFieldValue("tgl_mulai", input);
                    }}
                    inputValue={
                      formik.values.tgl_mulai
                        ? new Date(formik.values.tgl_mulai)
                        : undefined
                    }
                    isError={!!formik.errors.tgl_mulai}
                  />
                  <FormErrorMessage>
                    {formik.errors.tgl_mulai as string}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={formik.errors.tgl_selesai ? true : false}
                >
                  <FormLabel>
                    Tanggal Selesai
                    <RequiredForm />
                  </FormLabel>
                  <DatePickerModal
                    id="terapkan-jadwal-tgl-selesai"
                    name="tgl_selesai"
                    onConfirm={(input) => {
                      formik.setFieldValue("tgl_selesai", input);
                    }}
                    inputValue={
                      formik.values.tgl_selesai
                        ? new Date(formik.values.tgl_selesai)
                        : undefined
                    }
                    isError={!!formik.errors.tgl_selesai}
                  />
                  <FormErrorMessage>
                    {formik.errors.tgl_selesai as string}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <FormControl isInvalid={!!formik.errors.shift}>
                <FormLabel>
                  Pilih Shift
                  <RequiredForm />
                </FormLabel>
                <SelectShift
                  name="shift"
                  placeholder="Pilih Jadwal"
                  onConfirm={(input) => {
                    formik.setFieldValue("shift", input);
                  }}
                  inputValue={formik.values.shift}
                  isError={!!formik.errors.shift}
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
                form="terapkanJadwalForm"
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

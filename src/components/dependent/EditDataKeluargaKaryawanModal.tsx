import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { RiEditFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import backOnClose from "../../lib/backOnCloseOld";
import useBackOnClose from "../../lib/useBackOnCloseOld";
import RequiredForm from "../form/RequiredForm";
import SelectStatusHidup from "./_Select/SelectStatusHidup";

interface Props {
  data: any;
}

export default function EditDataKeluargaKaryawanModal({ data }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef(null);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      nama_keluarga: data.nama_keluarga,
      hubungan: data.hubungan,
      pendidikan_terakhir: data.pendidikan_terakhir,
      pekerjaan: data.pekerjaan,
      status_hidup: {
        value: data.status_hidup,
        label: data.status_hidup ? "Hidup" : "Meninggal",
      },
      no_hp: data.no_hp,
      email: data.email,
    },
    validationSchema: yup.object().shape({
      hubungan: yup.string().required("Harus diisi"),
      nama_keluarga: yup.string().required("Harus diisi"),
      pendidikan_terakhir: yup.string().required("Harus diisi"),
      pekerjaan: yup.string().required("Harus diisi"),
      status_hidup: yup.string().required("Harus diisi"),
      no_hp: yup.string().required("Harus diisi"),
      email: yup.string().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
    },
  });

  return (
    <>
      <Button
        colorScheme="ap"
        variant={"ghost"}
        className=" clicky"
        leftIcon={<Icon as={RiEditFill} fontSize={iconSize} />}
        onClick={onOpen}
      >
        Edit
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
          formik.resetForm();
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader ref={initialRef}>Edit Data Keluarga</ModalHeader>
          <ModalBody>
            <form id="editKeluargaKaryawanForm" onSubmit={formik.handleSubmit}>
              <FormControl
                mb={4}
                isInvalid={formik.errors.nama_keluarga ? true : false}
              >
                <FormLabel>
                  Nama Anggota Keluarga
                  <RequiredForm />
                </FormLabel>
                <Input
                  name="nama_keluarga"
                  placeholder="Jolitos Kurniawan"
                  onChange={formik.handleChange}
                  value={formik.values.nama_keluarga}
                />
                <FormErrorMessage>
                  {formik.errors.nama_keluarga as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.hubungan ? true : false}
              >
                <FormLabel>
                  Hubungan
                  <RequiredForm />
                </FormLabel>
                <Input
                  name="hubungan"
                  placeholder="Ayah"
                  onChange={formik.handleChange}
                  value={formik.values.hubungan}
                />
                <FormErrorMessage>
                  {formik.errors.hubungan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.pendidikan_terakhir ? true : false}
              >
                <FormLabel>
                  Pendidikan Terakhir
                  <RequiredForm />
                </FormLabel>
                <Input
                  name="pendidikan_terakhir"
                  placeholder="S1 Teknik Sipil"
                  onChange={formik.handleChange}
                  value={formik.values.pendidikan_terakhir}
                />
                <FormErrorMessage>
                  {formik.errors.pendidikan_terakhir as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.pekerjaan ? true : false}
              >
                <FormLabel>
                  Pekerjaan
                  <RequiredForm />
                </FormLabel>
                <Input
                  name="pekerjaan"
                  placeholder="Mandor Proyek"
                  onChange={formik.handleChange}
                  value={formik.values.pekerjaan}
                />
                <FormErrorMessage>
                  {formik.errors.pekerjaan as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.status_hidup ? true : false}
              >
                <FormLabel>
                  Status Hidup
                  <RequiredForm />
                </FormLabel>
                <SelectStatusHidup
                  formik={formik}
                  name="status_hidup"
                  placeholder="Pilih status hidup"
                  initialSelected={formik.values.status_hidup}
                  noSearch
                  noUseBackOnClose
                />
                <FormErrorMessage>
                  {formik.errors.status_hidup as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.no_hp ? true : false}
              >
                <FormLabel>
                  No. Telepon
                  <RequiredForm />
                </FormLabel>
                <Input
                  name="no_hp"
                  placeholder="08616253****"
                  onChange={formik.handleChange}
                  value={formik.values.no_hp}
                />
                <FormErrorMessage>
                  {formik.errors.no_hp as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.email ? true : false}>
                <FormLabel>
                  Email
                  <RequiredForm />
                </FormLabel>
                <Input
                  name="email"
                  placeholder="example@mail.com"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <FormErrorMessage>
                  {formik.errors.email as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup w={"100%"}>
              {/* <Button
                w={"100%"}
                className="btn-solid clicky"
                onClick={() => {
                  backOnClose(onClose);
                }}
              >
                Batal
              </Button> */}
              <Button
                type="submit"
                form="editKeluargaKaryawanForm"
                w={"100%"}
                className="btn-ap clicky"
                colorScheme="ap"
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

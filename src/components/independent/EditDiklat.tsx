import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { ReactNode, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import DisclosureHeader from "../dependent/DisclosureHeader";
import StringInput from "../dependent/input/StringInput";
import Textarea from "../dependent/input/Textarea";
import RequiredForm from "../form/RequiredForm";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
  jenisDiklat?: "internal" | "eksternal";
}

export default function EditDiklat({
  rowData,
  children,
  jenisDiklat = "internal",
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `edit-kuota-cuti-modal-${rowData.id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      // gambar: undefined as any,
      // whitelist_peserta: undefined as any,
      nama: "",
      // kategori: {
      //   value: 1,
      //   label: "Internal",
      // },
      deskripsi: "",
      // kuota: undefined as any,
      lokasi: "",
      // tgl_mulai: undefined as any,
      // tgl_selesai: undefined as any,
      // jam_mulai: undefined as any,
      // jam_selesai: undefined as any,
      skp: "" as any,
      // dokumen_diklat_1: undefined as any,
      // dokumen_diklat_2: undefined as any,
      // dokumen_diklat_3: undefined as any,
      // dokumen_diklat_4: undefined as any,
      // dokumen_diklat_5: undefined as any,
    },
    validationSchema: yup.object().shape({
      // gambar: yup.string().required("Harus diisi"),
      // whitelist_peserta: yup.array(),
      nama: yup.string().required("Harus diisi"),
      // kategori: yup.object().required("Harus diisi"),
      deskripsi: yup.string().required("Harus diisi"),
      // kuota: yup.number().required("Harus diisi"),
      lokasi: yup.string().required("Harus diisi"),
      // tgl_mulai: yup.string().required("Harus diisi"),
      // tgl_selesai: yup.string().required("Harus diisi"),
      // jam_mulai: yup.string().required("Harus diisi"),
      // jam_selesai: yup.string().required("Harus diisi"),
      skp: yup.string(),
      // dokumen_diklat_1: yup.mixed(),
      // dokumen_diklat_2: yup.mixed(),
      // dokumen_diklat_3: yup.mixed(),
      // dokumen_diklat_4: yup.mixed(),
      // dokumen_diklat_5: yup.mixed(),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values.whitelist_peserta);
      // const payload = {
      //   nama: "",
      // };
      const payload = new FormData();
      // values.whitelist_peserta?.forEach((peserta: any) => {
      //   payload.append("user_id[]", peserta.value);
      // });
      // payload.append("dokumen", values.gambar);
      payload.append("nama", values.nama);
      payload.append("deskripsi", values.deskripsi);
      // payload.append("kuota", values.kuota);
      // payload.append("tgl_mulai", formatDate(values.tgl_mulai, "short"));
      // payload.append("tgl_selesai", formatDate(values.tgl_selesai, "short"));
      // payload.append("jam_mulai", values.jam_mulai);
      // payload.append("jam_selesai", values.jam_selesai);
      payload.append("lokasi", values.lokasi);
      payload.append("skp", values.skp);
      // if (values.dokumen_diklat_1)
      //   payload.append("dokumen_diklat_1", values.dokumen_diklat_1);
      // if (values.dokumen_diklat_2)
      //   payload.append("dokumen_diklat_2", values.dokumen_diklat_2);
      // if (values.dokumen_diklat_3)
      //   payload.append("dokumen_diklat_3", values.dokumen_diklat_3);
      // if (values.dokumen_diklat_4)
      //   payload.append("dokumen_diklat_4", values.dokumen_diklat_4);
      // if (values.dokumen_diklat_5)
      //   payload.append("dokumen_diklat_5", values.dokumen_diklat_5);

      setLoading(true);
      let url = `api/rski/dashboard/perusahaan/update-diklat/${rowData?.id}`;
      if (jenisDiklat === "eksternal")
        url = `api/rski/dashboard/perusahaan/update-diklat-eksternal-user/${rowData?.id}`;

      req
        .post(url, payload)
        .then((r) => {
          if (r?.status === 200) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
            backOnClose();
            resetForm();
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
    if (isOpen) {
      formikRef.current.setFieldValue("nama", rowData.originalData.nama_diklat);
      formikRef.current.setFieldValue(
        "deskripsi",
        rowData.originalData.deskripsi
      );
      formikRef.current.setFieldValue("lokasi", rowData.originalData.lokasi);
      formikRef.current.setFieldValue("skp", rowData.originalData.skp || "");
    }
  }, [isOpen, rowData, formikRef]);

  return (
    <>
      <Box onClick={onOpen} {...props}>
        {children}
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
        }}
        initialFocusRef={initialRef}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title="Edit Diklat Internal" />
          </ModalHeader>
          <ModalBody>
            <form id="edit-diklat-internal" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={formik.errors.nama ? true : false}>
                <FormLabel>
                  Nama Diklat
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama"
                  placeholder="Pendidikan & latihan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("nama", input);
                  }}
                  inputValue={formik.values.nama}
                />
                <FormErrorMessage>
                  {formik.errors.nama as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.deskripsi ? true : false}
              >
                <FormLabel>
                  Deskripsi
                  <RequiredForm />
                </FormLabel>
                <Textarea
                  name="deskripsi"
                  // placeholder="Pendidikan & latihan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("deskripsi", input);
                  }}
                  inputValue={formik.values.deskripsi}
                />
                <FormErrorMessage>
                  {formik.errors.deskripsi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.lokasi ? true : false}
              >
                <FormLabel>
                  Lokasi
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="lokasi"
                  placeholder="Gedung serba guna"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("lokasi", input);
                  }}
                  inputValue={formik.values.lokasi}
                />
                <FormErrorMessage>
                  {formik.errors.lokasi as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl mb={4} isInvalid={formik.errors.skp ? true : false}>
                <FormLabel>SKP</FormLabel>
                <Textarea
                  name="skp"
                  // placeholder="Pendidikan & latihan"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("skp", input);
                  }}
                  inputValue={formik.values.skp}
                />
                <FormErrorMessage>
                  {formik.errors.skp as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              form="edit-diklat-internal"
              className="btn-ap clicky"
              colorScheme="ap"
              w={"100%"}
              isLoading={loading}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

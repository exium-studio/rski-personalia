import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiAddCircleFill } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import { Interface__SelectOption } from "../../constant/interfaces";
import { iconSize } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnCloseOld";
import isHasPermissions from "../../lib/isHasPermissions";
import req from "../../lib/req";
import MultiSelectKaryawanWithUnitKerja from "../dependent/_Select/MultiSelectKaryawanWithUnitKerja";
import SelectKaryawanAllJenisKaryawan from "../dependent/_Select/SelectKaryawanAllJenisKaryawan";
import SelectModulVerifikasi from "../dependent/_Select/SelectModulVerifikasi";
import DisclosureHeader from "../dependent/DisclosureHeader";
import SingleSelectModal from "../dependent/input/SingleSelectModal";
import StringInput from "../dependent/input/StringInput";
import RequiredForm from "../form/RequiredForm";

interface SelectLevelProps {
  selectedModul: any;
  onConfirm: (inputValue: Interface__SelectOption | undefined) => void;
  inputValue: Interface__SelectOption | undefined;
  isDisabled?: boolean;
}

const SelectLevel = ({
  selectedModul,
  inputValue,
  onConfirm,
  isDisabled,
}: SelectLevelProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const options = Array.from({ length: selectedModul?.label2 || 0 }).map(
    (_, i) => ({
      value: i + 1,
      label: i + 1,
    })
  );

  return (
    <SingleSelectModal
      id="select-level-verifikasi"
      name="order"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      inputValue={inputValue}
      onConfirm={onConfirm}
      placeholder="Pilih Level Verifikasi"
      isDisabled={isDisabled}
      options={options}
    />
  );
};

interface Props extends ButtonProps {}

export default function TambahHakVerifikasi({ ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose("tambah-hak-verifikasi-modal", isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      name: "",
      modul: undefined as any,
      order: undefined as any,
      verifikator: undefined as any,
      user_diverifikasi: [] as any,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Harus diisi"),
      modul: yup.object().required("Harus diisi"),
      order: yup.object().required("Harus diisi"),
      verifikator: yup.object().required("Harus diisi"),
      user_diverifikasi: yup.array().required("Harus diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        nama: values.name,
        verifikator: values?.verifikator?.value,
        user_diverifikasi: values?.user_diverifikasi?.map(
          (user: any) => user?.value
        ),
        modul_verifikasi: values?.modul?.value,
        order: values?.order?.value,
      };
      setLoading(true);
      req
        .post(`/api/rski/dashboard/pengaturan/master-verifikasi`, payload)
        .then((r) => {
          if (r.status === 201) {
            toast({
              status: "success",
              title: r.data.message,
              isClosable: true,
              position: "bottom-right",
            });
            setRt(!rt);
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

  const { userPermissions } = useAuth();
  const createPermission = isHasPermissions(userPermissions, [59]);

  return (
    <>
      {/* <PermissionTooltip permission={createPermission}> */}
      <Button
        className="btn-ap clicky"
        colorScheme="ap"
        onClick={onOpen}
        leftIcon={<Icon as={RiAddCircleFill} fontSize={iconSize} />}
        pl={5}
        isDisabled={!createPermission}
        {...props}
      >
        Tambah Hak Verifikasi
      </Button>
      {/* </PermissionTooltip> */}

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
          <ModalHeader ref={initialRef}>
            <DisclosureHeader
              title="Tambah Hak Verifikasi"
              onClose={() => {
                formik.resetForm();
              }}
            />
          </ModalHeader>
          <ModalBody>
            <form id="tambahRoleForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={4} isInvalid={formik.errors.name ? true : false}>
                <FormLabel>
                  Nama Hak Verifikasi
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="name"
                  placeholder="Verifikasi Pak Agung"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("name", input);
                  }}
                  inputValue={formik.values.name}
                />
                <FormErrorMessage>
                  {formik.errors.name as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.modul ? true : false}
              >
                <FormLabel>
                  Hal yang Perlu Diverifikasi (Modul)
                  <RequiredForm />
                </FormLabel>
                <SelectModulVerifikasi
                  name="modul"
                  onConfirm={(input) => {
                    formik.setFieldValue("modul", input);
                  }}
                  inputValue={formik.values.modul}
                />
                <FormErrorMessage>
                  {formik.errors.modul as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.order ? true : false}
              >
                <FormLabel>
                  Level Verifikasi
                  <RequiredForm />
                </FormLabel>
                <SelectLevel
                  selectedModul={formik.values.modul}
                  isDisabled={!formik.values.modul}
                  onConfirm={(input) => {
                    formik.setFieldValue("order", input);
                  }}
                  inputValue={formik.values.order}
                />
                <FormHelperText>
                  Maksimal level verifikasi berdasarkan modul yang dipilih
                </FormHelperText>
                <FormErrorMessage>
                  {formik.errors.order as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={4}
                isInvalid={formik.errors.verifikator ? true : false}
              >
                <FormLabel>
                  Verifikator
                  <RequiredForm />
                </FormLabel>
                <SelectKaryawanAllJenisKaryawan
                  name="verifikator"
                  onConfirm={(input) => {
                    formik.setFieldValue("verifikator", input);
                  }}
                  inputValue={formik.values.verifikator}
                />
                <FormErrorMessage>
                  {formik.errors.verifikator as string}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.user_diverifikasi ? true : false}
              >
                <FormLabel>
                  Karyawan Diverifikasi
                  <RequiredForm />
                </FormLabel>
                <MultiSelectKaryawanWithUnitKerja
                  name="user_diverifikasi"
                  onConfirm={(input) => {
                    formik.setFieldValue("user_diverifikasi", input);
                  }}
                  inputValue={formik.values.user_diverifikasi}
                  optionsDisplay="chip"
                />
                <FormErrorMessage>
                  {formik.errors.user_diverifikasi as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="tambahRoleForm"
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

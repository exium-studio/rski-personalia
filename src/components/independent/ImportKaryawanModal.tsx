import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { RiDownloadLine } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import backOnClose from "../../lib/backOnCloseOld";
import useBackOnClose from "../../lib/useBackOnCloseOld";

export default function ImportKaryawanModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef(null);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { file: [] as File[] | null },
    validationSchema: yup.object().shape({
      file: yup
        .array()
        .min(1, "Harus diisi")
        .test(
          "fileType",
          "Hanya file dengan ekstensi .csv, .xls, atau .xlsx yang diperbolehkan",
          (value: File[] | null | undefined) => {
            if (!value) return false;
            return value.every((file) => {
              const validExtensions = [".csv", ".xls", ".xlsx"];
              const extension = file.name.split(".").pop();
              return extension
                ? validExtensions.includes(`.${extension}`)
                : false;
            });
          }
        ) as any,
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      //TODO post file
    },
  });

  return (
    <>
      <Button
        flex={"1 1 110px"}
        variant={"outline"}
        colorScheme="ap"
        className="clicky"
        rightIcon={<Icon as={RiDownloadLine} fontSize={iconSize} />}
        onClick={onOpen}
      >
        Import
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader ref={initialRef}>Import Data Karyawan</ModalHeader>
          <ModalBody>
            <form id="importDataKaryawanForm" onSubmit={formik.handleSubmit}>
              <FormControl isInvalid={formik.errors.file ? true : false}>
                {/* <FileInputLarge name="file" accept=".csv, .xls, .xlsx" /> */}
                <FormErrorMessage>{formik.errors.file}</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup w={"100%"}>
              <Button
                w={"100%"}
                type="submit"
                form="importDataKaryawanForm"
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

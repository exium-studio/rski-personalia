import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
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
import { RiDownload2Line, RiDownloadLine } from "@remixicon/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "./DisclosureHeader";
import FileInputLarge from "./input/FileInputLarge";
import req from "../../constant/req";
import download from "../../lib/download";

interface Props extends ButtonProps {
  url: string;
  reqBodyKey?: string;
  title?: string;
  templateDownloadUrl?: string;
}

export default function ImportModal({
  url,
  reqBodyKey = "file",
  title,
  templateDownloadUrl,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`import-modal-${1}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [dloading, setdLoading] = useState<boolean>(false);
  const toast = useToast();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { file: undefined },
    validationSchema: yup.object().shape({
      file: yup
        .mixed()
        .nullable()
        .test(
          "fileType",
          "Hanya file dengan ekstensi .csv, .xls, atau .xlsx yang diperbolehkan",
          (value: any) => {
            if (value === null || value === undefined) return false; // Tidak boleh kosong
            if (typeof value === "string") return true; // String dianggap valid
            if (value instanceof File) {
              const validExtensions = [".csv", ".xls", ".xlsx"];
              const extension = value.name.split(".").pop();
              return extension
                ? validExtensions.includes(`.${extension}`)
                : false;
            }
            return false;
          }
        ),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      const payload = new FormData();
      if (values?.file) {
        payload.append(reqBodyKey, values?.file);
      }

      req
        .post(url, payload)
        .then((r) => {
          if (r.status === 200) {
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

  const downloadTemplate = () => {
    setdLoading(true);
    req
      .get(url, {
        responseType: "blob", // Penting untuk menangani file biner
      })
      .then((r) => {
        if (r.status === 200) {
          download(r.data, `${title} template`, "xls");
          backOnClose();
        } else {
          toast({
            status: "error",
            title: "Maaf terjadi kesalahan pada sistem",
            isClosable: true,
            position: "bottom-right",
          });
        }
      })
      .catch((e) => {
        console.error(e);
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
        setdLoading(false);
      });
  };

  return (
    <>
      <Button
        // variant={"outline"}
        // colorScheme="ap"
        minW={"120px"}
        className="btn-outline clicky"
        leftIcon={
          <Icon
            as={RiDownloadLine}
            fontSize={iconSize}
            // color={chartColors[8]}
            // opacity={0.4}
          />
        }
        pl={5}
        onClick={onOpen}
        {...props}
      >
        Import
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
          formik.resetForm();
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={title || "Import"} />
          </ModalHeader>
          <ModalBody>
            <form id="importForm" onSubmit={formik.handleSubmit}>
              <FormControl isInvalid={!!formik.errors.file}>
                <FileInputLarge
                  name="file"
                  accept=".csv, .xls, .xlsx"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("file", input);
                  }}
                  inputValue={formik.values.file}
                  placeholder="Mendukung CSV, XLS, XLSX"
                />
                <FormErrorMessage>
                  {formik.errors.file as string}
                </FormErrorMessage>
              </FormControl>

              <Button
                mt={2}
                leftIcon={<Icon as={RiDownload2Line} fontSize={iconSize} />}
                w={"100%"}
                className="btn-outline clicky"
                onClick={downloadTemplate}
                isLoading={dloading}
              >
                Unduh Template
              </Button>
            </form>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              type="submit"
              form="importForm"
              w={"100%"}
              className="btn-ap clicky"
              colorScheme="ap"
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

import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ReactNode, useRef, useState } from "react";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import DisclosureHeader from "../dependent/DisclosureHeader";
import NumberInput from "../dependent/input/NumberInput";
import req from "../../lib/req";
import useRenderTrigger from "../../hooks/useRenderTrigger";

interface Props extends BoxProps {
  rowData: any;
  children?: ReactNode;
}

export default function EditKuotaCutiDisclosure({
  rowData,
  children,
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

  // console.log(rowData);
  const [kuota, setKuota] = useState<any[]>(rowData?.originalData?.hak_cuti);

  function handleSubmit() {
    setLoading(true);

    const url = `api/rski/dashboard/pengaturan/hak-cuti/${rowData?.id}`;

    const payload = {
      id: rowData?.id,
      hak_cuti: kuota,
      _method: "patch",
    };

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
          backOnClose();
          setRt(!rt);
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
  }

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
            <DisclosureHeader title="Edit Kuota Hak Cuti" />
          </ModalHeader>
          <ModalBody>
            <form id="editRoleForm">
              {rowData?.originalData?.hak_cuti.map((item: any, i: number) => {
                return (
                  <FormControl mb={4}>
                    <FormLabel>
                      {item?.nama}
                      {/* <RequiredForm /> */}
                    </FormLabel>

                    <InputGroup>
                      <NumberInput
                        name={`kuota-${1}`}
                        onChangeSetter={(input) => {
                          const updated = [...kuota];
                          updated[i] = {
                            ...updated[i],
                            kuota: input,
                          };
                          setKuota(updated);
                        }}
                        inputValue={kuota?.[i]?.kuota}
                        pr={"52px"}
                      />

                      <InputRightElement pr={4}>
                        <Text>hari</Text>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                );
              })}
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              className="btn-ap clicky"
              colorScheme="ap"
              w={"100%"}
              isLoading={loading}
              onClick={handleSubmit}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

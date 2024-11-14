import {
  Badge,
  Button,
  ButtonGroup,
  ButtonProps,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackProps,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useBackOnClose from "../../hooks/useBackOnClose";
import useDataState from "../../hooks/useDataState";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import isDatePassed from "../../lib/isDatePassed";
import isHasPermissions from "../../lib/isHasPermissions";
import req from "../../lib/req";
import timeSince from "../../lib/timeSince";
import DisclosureHeader from "../dependent/DisclosureHeader";
import FormDashboardUpdatePengumuman from "../form/Dashboard/FormDashboardUpdatePengumuman";
import PermissionTooltip from "../wrapper/PermissionTooltip";
import ComponentSpinner from "./ComponentSpinner";
import Retry from "../dependent/Retry";

interface DeletePengumumanProps extends ButtonProps {
  data: any;
}
const DeletePengumuman = ({ data, ...props }: DeletePengumumanProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`delete-pengmuman-${data.id}`, isOpen, onOpen, onClose);

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  function deletePengumuman() {
    setLoading(true);

    req
      .delete(`/api/rski/dashboard/pengumuman/${data.id}`)
      .then((r) => {
        if (r.status === 200) {
          toast({
            status: "success",
            title: r.data.message,
            position: "bottom-right",
            isClosable: true,
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
            e.response.data.message ||
            "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Button
        w={"100%"}
        className="btn-solid clicky"
        color="red.400"
        variant={"ghost"}
        onClick={onOpen}
        {...props}
      >
        Hapus
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Delete Pengumuman"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>
              Apakah anda yakin akan menghapus pengumuman ini?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              isDisabled={loading}
            >
              Tidak
            </Button>
            <Button
              w={"100%"}
              className="clicky"
              colorScheme="red"
              isLoading={loading}
              onClick={deletePengumuman}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface Props extends StackProps {
  pengumumanId: number;
  initialData: any;
}

export default function DashboardPengumumanItemDetail({
  pengumumanId,
  initialData,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `detail-pengumuman-modal-${pengumumanId}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);

  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/pengumuman/${pengumumanId}`,
    conditions: isOpen,
    dependencies: [isOpen],
  });

  // SX
  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [54]);
  const deletePermission = isHasPermissions(userPermissions, [55]);

  return (
    <>
      <VStack
        align={"stretch"}
        py={4}
        px={responsiveSpacing}
        onClick={onOpen}
        cursor={"pointer"}
        _hover={{ bg: "var(--divider)" }}
        transition={"200ms"}
        borderBottom={"1px solid var(--divider2)"}
        {...props}
      >
        <HStack justify={"space-between"} align={"start"}>
          <Text fontWeight={500}>{initialData.judul}</Text>

          {isDatePassed(initialData.tgl_berakhir, true) && (
            <Badge
              color={"red.400"}
              bg={"var(--divider)"}
              borderRadius={"full"}
              textTransform={"none"}
              fontWeight={500}
            >
              Berakhir
            </Badge>
          )}
        </HStack>

        <Text fontSize={14}>{initialData.konten}</Text>

        <Wrap mt={"auto"} pt={2} justify={"space-between"}>
          <Text fontSize={14} opacity={0.4}>
            diperbarui : {timeSince(initialData.updated_at as string)}
          </Text>
          <Text fontSize={14} opacity={0.4}>
            berakhir {formatDate(initialData.tgl_berakhir)}
          </Text>
        </Wrap>
      </VStack>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose();
        }}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title="Detail Pengumuman" />
          </ModalHeader>

          <ModalBody>
            {loading && <ComponentSpinner minH={"300px"} />}

            {!loading && (
              <>
                {error && (
                  <Center>
                    <Retry loading={loading} retry={retry} />
                  </Center>
                )}

                {!error && data && (
                  <FormDashboardUpdatePengumuman
                    data={data}
                    setLoading={setLoadingSubmit}
                  />
                )}
              </>
            )}
          </ModalBody>

          {!loading && (
            <ModalFooter>
              <ButtonGroup w={"100%"}>
                <PermissionTooltip
                  permission={deletePermission}
                  boxProps={{ w: "100%" }}
                >
                  <DeletePengumuman
                    data={initialData}
                    isDisabled={loadingSubmit || !deletePermission}
                  />
                </PermissionTooltip>

                <PermissionTooltip
                  permission={editPermission}
                  boxProps={{ w: "100%" }}
                >
                  <Button
                    type="submit"
                    form="updatePengumumanForm"
                    w={"100%"}
                    className="btn-ap clicky"
                    colorScheme="ap"
                    isLoading={loadingSubmit}
                    isDisabled={!editPermission}
                  >
                    Simpan
                  </Button>
                </PermissionTooltip>
              </ButtonGroup>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

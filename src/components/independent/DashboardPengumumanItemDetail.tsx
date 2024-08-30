import {
  Badge,
  Button,
  ButtonGroup,
  ButtonProps,
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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useErrorAlphaColor } from "../../constant/colors";
import { Pengumuman__Interface } from "../../constant/interfaces";
import { responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import isDatePassed from "../../lib/isDatePassed";
import timeSince from "../../lib/timeSince";
import DisclosureHeader from "../dependent/DisclosureHeader";
import FormDashboardUpdatePengumuman from "../form/Dashboard/FormDashboardUpdatePengumuman";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import req from "../../lib/req";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import PermissionTooltip from "../wrapper/PermissionTooltip";

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
            e.response.data.message || "Maaf terjadi kesalahan pada sistem",
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
        className="clicky"
        colorScheme="red"
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
  data: Pengumuman__Interface;
}

export default function DashboardPengumumanItemDetail({
  data,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`detail-pengumuman-modal-${data.id}`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);

  // SX
  const errorAlphaColor = useErrorAlphaColor();

  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [54]);
  const deletePermission = isHasPermissions(userPermissions, [55]);

  return (
    <>
      <VStack
        align={"stretch"}
        borderBottom={"1px solid var(--divider3)"}
        py={4}
        px={responsiveSpacing}
        onClick={onOpen}
        cursor={"pointer"}
        _hover={{ bg: "var(--divider)" }}
        transition={"200ms"}
        {...props}
      >
        <HStack justify={"space-between"} align={"start"}>
          <Text fontWeight={500}>{data.judul}</Text>

          {isDatePassed(data.tgl_berakhir, true) && (
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

        <Text fontSize={14}>{data.konten}</Text>

        <HStack mt={"auto"} pt={2} justify={"space-between"}>
          <Text fontSize={14} opacity={0.4}>
            diperbarui : {timeSince(data.updated_at as string)}
          </Text>
          <Text fontSize={14} opacity={0.4}>
            berakhir {formatDate(data.tgl_berakhir)}
          </Text>
        </HStack>
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
            <FormDashboardUpdatePengumuman
              data={data}
              setLoading={setLoading}
            />
          </ModalBody>

          <ModalFooter>
            <ButtonGroup w={"100%"}>
              <PermissionTooltip
                permission={deletePermission}
                boxProps={{ w: "100%" }}
              >
                <DeletePengumuman
                  data={data}
                  bg={`${errorAlphaColor} !important`}
                  isDisabled={loading || !deletePermission}
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
                  isLoading={loading}
                  isDisabled={!editPermission}
                >
                  Simpan
                </Button>
              </PermissionTooltip>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

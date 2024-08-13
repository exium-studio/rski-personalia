import {
  Badge,
  Button,
  ButtonGroup,
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
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useErrorAlphaColor } from "../../constant/colors";
import { Pengumuman__Interface } from "../../constant/interfaces";
import { responsiveSpacing } from "../../constant/sizes";
import backOnClose from "../../lib/backOnCloseOld";
import formatDate from "../../lib/formatDate";
import isDatePassed from "../../lib/isDatePassed";
import timeSince from "../../lib/timeSince";
import useBackOnClose from "../../lib/useBackOnCloseOld";
import DisclosureHeader from "../dependent/DisclosureHeader";
import FormDashboardUpdatePengumuman from "../form/Dashboard/FormDashboardUpdatePengumuman";

interface Props extends StackProps {
  data: Pengumuman__Interface;
}

export default function DashboardPengumumanItemDetail({
  data,
  ...props
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);

  // SX
  const errorAlphaColor = useErrorAlphaColor();

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

          {isDatePassed(data.tgl_berakhir) && (
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
            {timeSince(data.created_at)}
          </Text>
          <Text fontSize={14} opacity={0.4}>
            berakhir {formatDate(data.tgl_berakhir)}
          </Text>
        </HStack>
      </VStack>

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
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title="Detail Pengumuman" />
          </ModalHeader>

          <ModalBody>
            {/* <HStack mb={4}>
              <Icon as={RiCalendar2Fill} fontSize={iconSize} opacity={0.6} />
              <Text>{formatDate(data.created_at)}</Text>
            </HStack> */}

            <FormDashboardUpdatePengumuman
              data={data}
              setLoading={setLoading}
            />
          </ModalBody>

          <ModalFooter>
            <ButtonGroup w={"100%"}>
              <Button
                w={"50%"}
                className="clicky"
                colorScheme="error"
                variant={"ghost"}
                isDisabled={loading}
                bg={errorAlphaColor}
              >
                Hapus
              </Button>
              <Button
                type="submit"
                form="updatePengumumanForm"
                w={"50%"}
                className="btn-ap clicky"
                colorScheme="ap"
                isLoading={loading}
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

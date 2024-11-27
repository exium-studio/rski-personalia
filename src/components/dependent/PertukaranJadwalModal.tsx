import {
  Button,
  Center,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiArrowDownLine, RiArrowUpLine } from "@remixicon/react";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import formatTime from "../../lib/formatTime";
import CContainer from "../wrapper/CContainer";
import AvatarAndNameTableData from "./AvatarAndNameTableData";
import DisclosureHeader from "./DisclosureHeader";

interface PertukaranJadwalProps {
  id: number;
  data: any;
  userPengajuan: any;
  userDitukar: any;
}
export default function PertukaranJadwalModal({
  id,
  data,
  userPengajuan,
  userDitukar,
}: PertukaranJadwalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`pertukaran-jadwal-modal-${id}`, isOpen, onOpen, onClose);

  return (
    <>
      <Button
        colorScheme="ap"
        variant={"ghost"}
        className="clicky"
        onClick={onOpen}
      >
        Lihat
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        size={"lg"}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Pertukaran Jadwal"} />
          </ModalHeader>
          <ModalBody>
            <HStack mb={4} gap={4}>
              <CContainer>
                <AvatarAndNameTableData
                  w={"180px"}
                  data={{
                    id: userPengajuan.id,
                    nama: userPengajuan.nama,
                    foto_profil: userPengajuan.foto_profil,
                  }}
                />
              </CContainer>
              <CContainer>
                <AvatarAndNameTableData
                  w={"180px"}
                  data={{
                    id: userDitukar.id,
                    nama: userDitukar.nama,
                    foto_profil: userDitukar.foto_profil,
                  }}
                />
              </CContainer>
            </HStack>

            {data?.map((pertukaran: any, i: number) => (
              <HStack key={i} gap={4}>
                <CContainer
                  gap={2}
                  flex={1}
                  // bg={"var(--divider)"}
                  border={"1px solid var(--divider2)"}
                  p={4}
                  borderRadius={8}
                >
                  {pertukaran?.jadwal_karyawan_pengajuan?.shift ? (
                    <Text opacity={0.4}>
                      {pertukaran?.jadwal_karyawan_pengajuan?.shift?.nama}
                    </Text>
                  ) : (
                    <Text>Libur</Text>
                  )}

                  <Text>
                    {formatDate(pertukaran.jadwal_karyawan_pengajuan.tgl_mulai)}
                  </Text>

                  {pertukaran?.jadwal_karyawan_pengajuan?.shift ? (
                    <HStack gap={4}>
                      <HStack>
                        <Center
                          borderRadius={"full"}
                          bg={"var(--p500a4)"}
                          p={1}
                        >
                          <Icon as={RiArrowUpLine} color={"p.500"} />
                        </Center>
                        <Text>
                          {formatTime(
                            pertukaran?.jadwal_karyawan_pengajuan?.shift
                              ?.jam_from
                          )}
                        </Text>
                      </HStack>

                      <HStack>
                        <Center borderRadius={"full"} bg={"var(--reda)"} p={1}>
                          <Icon as={RiArrowDownLine} color={"red.400"} />
                        </Center>
                        <Text>
                          {formatTime(
                            pertukaran?.jadwal_karyawan_pengajuan?.shift?.jam_to
                          )}
                        </Text>
                      </HStack>
                    </HStack>
                  ) : (
                    <Text>-</Text>
                  )}
                </CContainer>

                <CContainer
                  gap={2}
                  flex={1}
                  // bg={"var(--divider)"}
                  border={"1px solid var(--divider2)"}
                  p={4}
                  borderRadius={8}
                >
                  {pertukaran?.jadwal_karyawan_ditukar?.shift ? (
                    <Text opacity={0.4}>
                      {pertukaran?.jadwal_karyawan_ditukar?.shift?.nama}
                    </Text>
                  ) : (
                    <Text>Libur</Text>
                  )}

                  <Text>
                    {formatDate(pertukaran?.jadwal_karyawan_ditukar?.tgl_mulai)}
                  </Text>

                  {pertukaran?.jadwal_karyawan_ditukar?.shift ? (
                    <HStack gap={4}>
                      <HStack>
                        <Center
                          borderRadius={"full"}
                          bg={"var(--p500a4)"}
                          p={1}
                        >
                          <Icon as={RiArrowUpLine} color={"p.500"} />
                        </Center>
                        <Text>
                          {formatTime(
                            pertukaran?.jadwal_karyawan_ditukar?.shift?.jam_from
                          )}
                        </Text>
                      </HStack>

                      <HStack>
                        <Center borderRadius={"full"} bg={"var(--reda)"} p={1}>
                          <Icon as={RiArrowDownLine} color={"red.400"} />
                        </Center>
                        <Text>
                          {formatTime(
                            pertukaran?.jadwal_karyawan_ditukar?.shift?.jam_to
                          )}
                        </Text>
                      </HStack>
                    </HStack>
                  ) : (
                    <Text>-</Text>
                  )}
                </CContainer>
              </HStack>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              w={"100%"}
              className="btn-solid clicky"
              onClick={backOnClose}
            >
              Mengerti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

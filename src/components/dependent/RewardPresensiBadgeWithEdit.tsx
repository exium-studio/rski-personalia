import {
  Badge,
  BadgeProps,
  Button,
  Checkbox,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiAwardFill, RiCloseCircleFill, RiEditLine } from "@remixicon/react";
import { useState } from "react";
import useBackOnClose from "../../hooks/useBackOnClose";
import useGetUserData from "../../hooks/useGetUserData";
import useRenderTrigger from "../../hooks/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import req from "../../lib/req";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends BadgeProps {
  data: any;
}
const RewardPresensiBadgeWithEdit = (props: Props) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-reward-presensi-${data.id}`, isOpen, onOpen, onClose);
  const toast = useToast();

  // Contexts
  const { rt, setRt } = useRenderTrigger();

  // States
  const user = useGetUserData();
  const superAdmin = user.id === 1;
  const [hover, setHover] = useState(false);
  const [reward, setReward] = useState(data?.status_reward_presensi);
  const [loading, setLoading] = useState<boolean>(false);

  // Utils
  function handleSubmit() {
    const url = `api/edit-reward-presensi/${data.id}`;
    const payload = {
      reward: reward,
    };

    setLoading(true);

    req
      .post(url, payload)
      .then((r) => {
        if (r.status === 200) {
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
            e?.response?.data?.message ||
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
      <Tooltip
        label={
          superAdmin
            ? `${
                data?.status_reward_presensi
                  ? "Dapat reward presensi"
                  : "Tidak dapat reward presensi"
              }. Klik untuk edit reward presensi.`
            : ""
        }
      >
        <Badge
          borderRadius={"full"}
          paddingRight={2}
          colorScheme={data?.status_reward_presensi ? "green" : "red"}
          onMouseEnter={() => {
            if (superAdmin) setHover(true);
          }}
          onMouseLeave={() => setHover(false)}
          cursor={"pointer"}
          transition={"200ms"}
          pr={4}
          onClick={onOpen}
          {...restProps}
        >
          <HStack>
            <Icon
              as={
                data?.status_reward_presensi ? RiAwardFill : RiCloseCircleFill
              }
              color={data?.status_reward_presensi ? "green.400" : "red.400"}
              fontSize={14}
            />

            <Text fontSize={12}>
              {data?.status_reward_presensi
                ? "Reward presensi"
                : "Reward presensi"}
            </Text>

            {hover && <Icon as={RiEditLine} />}
          </HStack>
        </Badge>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <DisclosureHeader title={"Edit Reward Presensi"} />
          </ModalHeader>
          <ModalBody>
            <Text opacity={0.6}>
              Apakah Anda yakin mengubah reward presensi karyawan ini?
            </Text>

            <Checkbox
              mt={6}
              colorScheme="ap"
              onChange={(e) => setReward(e.target.checked)}
              isChecked={reward}
            >
              <Text mt={"-2.5px"}>Dapat Reward</Text>
            </Checkbox>
          </ModalBody>

          <ModalFooter gap={2}>
            <Button
              className="clicky"
              isLoading={loading}
              w={"full"}
              colorScheme="ap"
              onClick={handleSubmit}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RewardPresensiBadgeWithEdit;

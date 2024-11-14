import {
  Box,
  Button,
  ButtonProps,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useDisclosure,
  useSteps,
} from "@chakra-ui/react";
import { RiEditFill } from "@remixicon/react";
import { useRef, useState } from "react";
import { useLightDarkColor } from "../../constant/colors";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import useScreenWidth from "../../lib/useScreenWidth";
import EditKaryawanForm from "../../pages/Karyawan/EditKaryawanForm";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";
import useGetUserData from "../../hooks/useGetUserData";

interface Props extends ButtonProps {
  initialData: any;
}

export default function EditKaryawanModal({ initialData, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `edit-karyawan-modal-${initialData.id}`,
    isOpen,
    onOpen,
    onClose
  );
  const initialRef = useRef(null);
  const userData = useGetUserData();
  const isSuperAdmin = userData?.id === 1;

  const steps = [
    { title: "Data Karyawan" },
    { title: "Penggajian" },
    { title: "Personal" },
  ];
  const { activeStep, setActiveStep } = useSteps();
  const activeStepText = steps[activeStep].title;

  const sw = useScreenWidth();

  const [loading, setLoading] = useState<boolean>(false);

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <Button
        flex={"1 0 100px"}
        w={"100%"}
        colorScheme="ap"
        className="btn-ap clicky"
        leftIcon={<Icon as={RiEditFill} fontSize={iconSize} />}
        onClick={onOpen}
        pl={5}
        {...props}
      >
        Edit
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        size={"full"}
        scrollBehavior="inside"
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent borderRadius={12} minH={"calc(100vh - 32px)"}>
          <ModalHeader ref={initialRef}>
            <DisclosureHeader title={"Edit Data Karyawan"} />
          </ModalHeader>

          <ModalBody px={0} pb={responsiveSpacing}>
            <Stepper
              maxW={"720px"}
              w={"100%"}
              mx={"auto"}
              px={6}
              index={activeStep}
              colorScheme="ap"
              mb={6}
            >
              {steps.map((step, index) => {
                let ok = 2;
                if (isSuperAdmin) {
                  ok = 3;
                }
                return (
                  index < ok && (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>
                      <Box flexShrink="0">
                        <StepTitle>
                          {sw >= 768 && <Text>{step.title}</Text>}
                        </StepTitle>
                      </Box>
                      <StepSeparator />
                    </Step>
                  )
                );
              })}
            </Stepper>

            {sw < 768 && (
              <CContainer px={5}>
                <Text mb={6}>
                  Step {activeStep + 1} : <b>{activeStepText}</b>
                </Text>
              </CContainer>
            )}

            <CContainer
              px={responsiveSpacing}
              bg={lightDarkColor}
              borderRadius={12}
              overflowY={"auto"}
              flex={1}
              className="scrollY"
            >
              <Text fontSize={22} fontWeight={600} mb={6}>
                {steps[activeStep].title}
              </Text>

              <EditKaryawanForm
                data={initialData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                loading={loading}
                setLoading={setLoading}
              />
            </CContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

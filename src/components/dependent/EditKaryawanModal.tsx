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
import { useRef } from "react";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import useScreenWidth from "../../lib/useScreenWidth";
import EditKaryawanForm from "../../pages/Karyawan/EditKaryawanForm";
import CContainer from "../wrapper/CContainer";
import DisclosureHeader from "./DisclosureHeader";

interface Props extends ButtonProps {
  initialData: any;
}

export default function EditKaryawanModal({ initialData, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-karyawan-modal`, isOpen, onOpen, onClose);
  const initialRef = useRef(null);

  const steps = [{ title: "Data Karyawan" }, { title: "Penggajian" }];
  const { activeStep, setActiveStep } = useSteps();
  const activeStepText = steps[activeStep].title;

  const sw = useScreenWidth();

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <Button
        flex={"1 0 100px"}
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
              {steps.map((step, index) => (
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
              ))}
            </Stepper>

            {sw < 768 && (
              <Text mb={6}>
                Step {activeStep + 1} : <b>{activeStepText}</b>
              </Text>
            )}

            <CContainer
              px={responsiveSpacing}
              bg={lightDarkColor}
              borderRadius={12}
              overflowY={"auto"}
              flex={1}
              className="scrollY"
            >
              <Text fontSize={22} fontWeight={600}>
                {steps[activeStep].title}
              </Text>
              <Text opacity={0.6} mb={6}>
                Silahkan Isi Semua Data Informasi Dasar Karyawan
              </Text>

              <EditKaryawanForm
                data={initialData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            </CContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

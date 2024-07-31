import {
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { useRef, useState } from "react";
import { useWhiteDarkColor } from "../../constant/colors";
import backOnClose from "../../lib/backOnCloseOld";
import useBackOnClose from "../../lib/useBackOnCloseOld";

interface Props {
  data: any;
  initialSrc: string;
  index: number;
}

export default function ImageView({ data, initialSrc, index }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(isOpen, onClose);
  const initialRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [active, setActive] = useState(index);

  const isNextDisabled = active === data.length - 1;
  const isPrevDisabled = active === 0;

  return (
    <>
      <Image
        alt={`Berkas Foto ke-${index + 1}`}
        loading={"lazy"}
        transition={"200ms"}
        _hover={{ opacity: 0.6 }}
        cursor={"pointer"}
        src={initialSrc}
        objectFit={"cover"}
        borderRadius={6}
        scrollSnapAlign={"center"}
        onClick={onOpen}
      />

      <Modal
        isOpen={isOpen}
        onClose={() => {
          backOnClose(onClose);
        }}
        initialFocusRef={initialRef}
        size={"full"}
      >
        <ModalOverlay />

        <ModalContent
          m={"0px !important"}
          p={"0px !important"}
          ref={initialRef}
          bg={"transparent"}
          overflow={"hidden !important"}
        >
          <ModalCloseButton
            color={"red.500"}
            p={5}
            transition={"200ms"}
            className="clicky"
            bg={useWhiteDarkColor()}
          />
          <ModalBody
            m={"0 !important"}
            p={"0 !important"}
            overflow={"hidden !important"}
          >
            <VStack
              justify={"center"}
              h={"100vh"}
              flex={1}
              onClick={() => {
                backOnClose(onClose);
              }}
            >
              <VStack my={"auto"}>
                <Image
                  id="imageViewer"
                  alt={`Berkas Foto ke-${index + 1}`}
                  loading={"lazy"}
                  transition={"200ms"}
                  src={data[active]}
                  maxH={"80vh"}
                  maxW={"80vw"}
                  objectFit={"contain"}
                  borderRadius={"0 !important"}
                  ref={imageRef}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />

                <VStack className="carouselControl" mt={2}>
                  <HStack>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive(active - 1);
                      }}
                      className="clicky"
                      borderRadius={"full"}
                      colorScheme="wnd"
                      color={"dnw"}
                      aria-label="carousel-previous"
                      icon={<Icon as={RiArrowLeftSLine} fontSize={24} />}
                      isDisabled={isPrevDisabled}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive(active + 1);
                      }}
                      className="clicky"
                      borderRadius={"full"}
                      colorScheme="wnd"
                      color={"dnw"}
                      aria-label="carousel-next"
                      isDisabled={isNextDisabled}
                      icon={<Icon as={RiArrowRightSLine} fontSize={24} />}
                    />
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

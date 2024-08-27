import {
  HStack,
  StackProps,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useLightDarkColor } from "../../constant/colors";
import useBackOnClose from "../../hooks/useBackOnClose";
import formatBytes from "../../lib/formatBytes";
import formatDate from "../../lib/formatDate";
import CContainer from "../independent/wrapper/CContainer";
import FileTypeIcon from "./FileTypeIcon";
import { Link } from "react-router-dom";

interface Props extends StackProps {
  data: any;
}

export default function DokumenFileItem({ data, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useBackOnClose(`file-viewer-${data.path}`, isOpen, onOpen, onClose);

  const dataType = data.path.split(".").pop().toLowerCase();

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <Link to={data.path} target={"_blank"}>
      <CContainer
        flex={0}
        bg={lightDarkColor}
        borderRadius={12}
        onClick={onOpen}
        cursor={"pointer"}
        position={"relative"}
        overflow={"clip"}
        {...props}
      >
        <HStack justify={"space-between"} py={3} px={4}>
          <HStack>
            <Text fontWeight={500} noOfLines={1}>
              {data.nama}
            </Text>
          </HStack>
        </HStack>

        <CContainer align={"center"} pt={2} pb={4} px={4} gap={1}>
          <FileTypeIcon type={dataType} fontSize={72} />
        </CContainer>

        <HStack opacity={0.4} p={2} justify={"space-between"}>
          <Text fontSize={11} opacity={0.4}>
            {formatBytes(data.size)}
          </Text>
          <Tooltip
            label={`Diunggah pada ${formatDate(data.created_at)}`}
            openDelay={500}
          >
            <Text fontSize={11}>{formatDate(data.created_at, "short")}</Text>
          </Tooltip>
        </HStack>
      </CContainer>
    </Link>
  );
}

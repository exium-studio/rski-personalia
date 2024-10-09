import {
  Box,
  Checkbox,
  HStack,
  Icon,
  StackProps,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { RiVerifiedBadgeFill } from "@remixicon/react";
import { Dispatch } from "react";
import { Link } from "react-router-dom";
import { useLightDarkColor } from "../../constant/colors";
import { iconSize } from "../../constant/sizes";
import formatBytes from "../../lib/formatBytes";
import formatDate from "../../lib/formatDate";
import CContainer from "../independent/wrapper/CContainer";
import FileTypeIcon from "./FileTypeIcon";

interface Props extends StackProps {
  data: any;
  selectedDokumen: number[];
  setSelectedDokumen: Dispatch<number[]>;
}

export default function DokumenFileItem({
  data,
  selectedDokumen,
  setSelectedDokumen,
  ...props
}: Props) {
  // SX
  const lightDarkColor = useLightDarkColor();

  // States
  const dataType = data.ext.split("/")[1];
  const isChecked = selectedDokumen?.includes(data?.id);
  const statusColor =
    data?.status_berkas?.id === 1
      ? "yellow.400"
      : data?.status_berkas?.id === 2
      ? "green.400"
      : "red.400";
  const checkboxVisible = data?.status_berkas?.id === 1;

  // Handle toggle checked
  const handleCheckboxChange = () => {
    if (isChecked) {
      setSelectedDokumen(selectedDokumen.filter((id) => id !== data.id));
    } else {
      setSelectedDokumen([...selectedDokumen, data.id]);
    }
  };

  // console.log(selectedDokumen);

  return (
    <Link to={data.path} target={"_blank"}>
      <CContainer
        flex={0}
        bg={lightDarkColor}
        borderRadius={12}
        cursor={"pointer"}
        position={"relative"}
        overflow={"clip"}
        {...props}
      >
        <HStack justify={"space-between"} py={3} px={4} position={"relative"}>
          <Icon
            as={RiVerifiedBadgeFill}
            color={statusColor}
            fontSize={iconSize}
          />
          <Text fontWeight={500} noOfLines={1} mr={"auto"}>
            {data.nama}
          </Text>
          <Checkbox
            size={"lg"}
            colorScheme="ap"
            isChecked={isChecked}
            onChange={handleCheckboxChange}
            display={checkboxVisible ? "block" : "none"}
          />
        </HStack>

        <CContainer
          align={"center"}
          pt={2}
          pb={7}
          px={4}
          gap={1}
          // border={"1px solid red"}
        >
          <Box position={"relative"}>
            <FileTypeIcon type={dataType} fontSize={72} />
          </Box>
        </CContainer>

        <HStack opacity={0.4} p={2} justify={"space-between"}>
          <Text fontSize={11} opacity={0.4}>
            {formatBytes(data.size?.split(" ")[0])}
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

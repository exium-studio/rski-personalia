import { Icon, IconProps } from "@chakra-ui/react";
import {
  RiFileExcelFill,
  RiFileFill,
  RiFilePdf2Fill,
  RiFileWordFill,
  RiImageFill,
  RiTableView,
} from "@remixicon/react";
import { useRef } from "react";

interface Props extends IconProps {
  type: string;
}

export default function FileTypeIcon({ type, ...props }: Props) {
  const color = useRef("current");

  const icon = () => {
    switch (type.toLowerCase()) {
      default:
        return RiFileFill;
      case "pdf":
        color.current = "red.400";
        return RiFilePdf2Fill;
      case "docx":
      case "doc":
        color.current = "blue.400";
        return RiFileWordFill;
      case "xls":
      case "xlsx":
        color.current = "green.400";
        return RiFileExcelFill;
      case "ppt":
      case "pptx":
        color.current = "green.400";
        return RiFileExcelFill;
      case "csv":
        color.current = "green.400";
        return RiTableView;
      case "jpg":
      case "jpeg":
      case "png":
      case "svg":
      case "heic":
      case "webp":
      case "gif":
      case "tiff":
      case "tif":
        color.current = "purple.400";
        return RiImageFill;
    }
  };

  // SX

  return <Icon as={icon()} color={color.current} {...props} />;
}

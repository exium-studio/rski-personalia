import { ButtonProps, Icon, IconButton } from "@chakra-ui/react";
import { RiArrowLeftSLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
interface Props extends ButtonProps {
  backLink?: string;
  icon?: any;
}

export default function BackButton({ backLink, icon, ...props }: Props) {
  const navigate = useNavigate();

  return (
    <IconButton
      aria-label="Tombol Kembali"
      icon={<Icon as={icon || RiArrowLeftSLine} fontSize={24} mr={"2px"} />}
      className="btn"
      size={"sm"}
      borderRadius={"full"}
      onClick={() => {
        if (backLink) {
          navigate(backLink);
        } else {
          window.history.back();
        }
      }}
      // minW={"20px !important"}
      {...props}
    />
  );
}

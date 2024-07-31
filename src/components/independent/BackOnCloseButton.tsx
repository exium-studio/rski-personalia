import { Icon, IconButton, IconButtonProps } from "@chakra-ui/react";
import { RiCloseLine } from "@remixicon/react";
import backOnClose from "../../lib/backOnClose";

interface Props extends IconButtonProps {
  onClose?: () => void;
}

export default function BackOnCloseButton({ onClose, ...props }: Props) {
  return (
    <IconButton
      icon={<Icon as={RiCloseLine} fontSize={24} className="custom-icon" />}
      minW="30px !important"
      h="30px !important"
      borderRadius={"full"}
      className="btn"
      onClick={(e) => {
        e.stopPropagation();
        backOnClose();
        onClose && onClose();
      }}
      {...props}
    />
  );
}

import { ButtonProps, Icon, IconButton } from "@chakra-ui/react";
import { RiLoopRightLine } from "@remixicon/react";
import { useState } from "react";

interface Props extends ButtonProps {}

export default function RefreshButton({ ...props }: Props) {
  const [rotate, setRotate] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRotate = () => {
    setRotate(true);
  };

  const handleStopRotate = () => {
    setRotate(false);
  };

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 300); // Delay to allow rotation to be visible
  };

  return (
    <IconButton
      aria-label="refresh button"
      icon={
        <Icon
          as={RiLoopRightLine}
          fontSize={20}
          transform={rotate ? "rotate(40deg)" : ""}
          transition="transform 0.3s"
        />
      }
      onMouseDown={handleRotate}
      onMouseUp={handleStopRotate}
      onMouseLeave={handleStopRotate}
      onClick={handleClick}
      isLoading={loading}
      {...props}
    />
  );
}

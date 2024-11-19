import { Box, BoxProps } from "@chakra-ui/react";
import useScreenHeight from "../../lib/useScreenHeight";

interface Props extends BoxProps {
  children?: any;
  noFooterConfig?: boolean;
  noTopNavs?: boolean;
  customReducer?: number;
  minH?: string;
}

export default function CustomTableContainer({
  children,
  noFooterConfig,
  noTopNavs,
  customReducer,
  minH,
  ...props
}: Props) {
  const sh = useScreenHeight();
  // const sw = useScreenWidth();
  // const [tgh, setTgh] = useState<number>(40);
  // useEffect(() => {
  //   const tabelConfig = document.querySelector<HTMLElement>(".tabelConfig");
  //   if (tabelConfig) {
  //     setTgh(tabelConfig.offsetHeight);
  //   }
  // }, []);

  // const spacings = sw < 768 ? 16 : 24;
  // const baseReducer = 88 + tgh + spacings * 2.4;
  // const noFooterConfigReducer = noFooterConfig ? 0 : spacings + 40;
  // const noTopNavsReducer = noTopNavs ? 0 : spacings + 32;
  // const customReducerValue = customReducer ? customReducer : 0;

  return (
    <Box
      className={"tabelContainer scrollX scrollY"}
      overflow={"auto"}
      w={"100%"}
      // flex={1}
      minH={minH || sh < 625 ? "400px" : ""}
      h={"100%"}
      // maxH={[
      //   `calc(100vh - 318px - ${tabelConfigH}px)`,
      //   null,
      //   `calc(100vh - 304px - ${tabelConfigH}px)`,
      // ]}
      // maxH={`calc(100vh - 40px - ${customReducerValue}px - ${baseReducer}px - ${noFooterConfigReducer}px - ${noTopNavsReducer}px)`}
      border={"1px solid var(--divider3)"}
      // border={"1px solid red"}
      borderRadius={8}
      {...props}
    >
      {children}
    </Box>
  );
}

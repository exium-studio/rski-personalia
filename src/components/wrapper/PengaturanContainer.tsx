import { Wrap } from "@chakra-ui/react";
import { ReactNode } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import PengaturanNavs from "../dependent/PengaturanNavs";
import CWrapper from "./CWrapper";

interface Props {
  children?: ReactNode;
  activeGroup?: number;
  active?: number;
}

export default function PengaturanContainer({
  children,
  activeGroup,
  active,
}: Props) {
  return (
    <CWrapper overflowY={"auto"}>
      <Wrap
        flex={1}
        borderRadius={12}
        className="scrollY"
        align={"start"}
        pt={0}
        overflowY={"auto"}
        spacing={responsiveSpacing}
      >
        <PengaturanNavs activeGroup={activeGroup} active={active} />

        {children}
      </Wrap>
    </CWrapper>
  );
}

import { Wrap } from "@chakra-ui/react";
import DashboardJabatan from "../../components/independent/DashboardJabatan";
import DashboardJenisKelamin from "../../components/independent/DashboardJenisKelamin";
import DashboardPengumuman from "../../components/independent/DashboardPengumuman";
import DashboardSiapaYangLembur from "../../components/independent/DashboardSiapaYangLembur";
import DashboardStatusKaryawan from "../../components/independent/DashboardStatusKaryawan";
import DashboardTotal from "../../components/independent/DashboardTotal";
import CWrapper from "../../components/wrapper/CWrapper";
import { responsiveSpacing } from "../../constant/sizes";
import DashboardProfesi from "../../components/independent/DashboardProfesi";

export default function Dashboard() {
  return (
    <>
      <CWrapper className="scrollY" overflowY={"auto"}>
        <DashboardTotal mb={responsiveSpacing} />

        <Wrap spacing={responsiveSpacing}>
          <DashboardJenisKelamin flex={"1 1 0"} />

          <DashboardJabatan flex={"1 1 0"} />

          <DashboardStatusKaryawan flex={"1 1 0"} />

          <DashboardProfesi flex={"1 1 0"} />

          <DashboardSiapaYangLembur flex={"1 1 0"} />

          <DashboardPengumuman flex={"1 1 0"} />
        </Wrap>
      </CWrapper>
    </>
  );
}

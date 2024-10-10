import { Button, Wrap } from "@chakra-ui/react";
import { useState } from "react";
import Retry from "../../components/dependent/Retry";
import TentangEditor from "../../components/dependent/TentangEditor";
import NoData from "../../components/independent/NoData";
import Skeleton from "../../components/independent/Skeleton";
import CContainer from "../../components/wrapper/CContainer";
import PermissionTooltip from "../../components/wrapper/PermissionTooltip";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useDataState from "../../hooks/useDataState";
import isHasPermissions from "../../lib/isHasPermissions";

export default function PengaturanTentang() {
  // SX
  const lightDarkColor = useLightDarkColor();

  // States
  const { userPermissions } = useAuth();
  const editPermission = isHasPermissions(userPermissions, [139]);
  const [tentangId, setTentangId] = useState<number>(1);
  const { error, loading, notFound, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/pengaturan/about-hospitals/${tentangId}`,
    dependencies: [tentangId],
  });

  // Render lateral
  const render = {
    loading: (
      <>
        <Skeleton flex={1} />
      </>
    ),
    error: (
      <>
        {!notFound && <Retry retry={retry} />}

        {notFound && <NoData m={"auto"} minH={"300px"} />}
      </>
    ),
    empty: (
      <>
        <NoData m={"auto"} minH={"300px"} />
      </>
    ),
    loaded: (
      <>
        <TentangEditor tentangId={tentangId} data={data} />
      </>
    ),
  };

  return (
    <CContainer
      px={responsiveSpacing}
      pb={responsiveSpacing}
      pt={0}
      h={"100%"}
      overflowY={"auto"}
      className="scrollY"
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
    >
      <Wrap py={responsiveSpacing}>
        <PermissionTooltip
          permission={editPermission}
          boxProps={{ w: "100%", flex: "1 1 140px" }}
        >
          <Button
            isDisabled={!editPermission}
            w={"100%"}
            className="btn-solid clicky"
            onClick={() => {
              setTentangId(1);
            }}
            color={tentangId === 1 ? "p.500" : ""}
          >
            Tentang
          </Button>
        </PermissionTooltip>
        <PermissionTooltip
          permission={editPermission}
          boxProps={{ w: "100%", flex: "1 1 140px" }}
        >
          <Button
            isDisabled={!editPermission}
            w={"100%"}
            className="btn-solid clicky"
            onClick={() => {
              setTentangId(2);
            }}
            color={tentangId === 2 ? "p.500" : ""}
          >
            Visi & Misi
          </Button>
        </PermissionTooltip>
        <PermissionTooltip
          permission={editPermission}
          boxProps={{ w: "100%", flex: "1 1 140px" }}
        >
          <Button
            isDisabled={!editPermission}
            w={"100%"}
            className="btn-solid clicky"
            onClick={() => {
              setTentangId(3);
            }}
            color={tentangId === 3 ? "p.500" : ""}
          >
            Mutu Rumah Sakit
          </Button>
        </PermissionTooltip>
      </Wrap>

      {loading && render.loading}
      {!loading && (
        <>
          {error && <>{render.error}</>}
          {!error && (
            <>
              {!data && render.empty}
              {data && render.loaded}
            </>
          )}
        </>
      )}

      {/* {render.error} */}
    </CContainer>
  );
}

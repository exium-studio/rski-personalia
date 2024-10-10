import { Button, Icon, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useLightDarkColor } from "../../constant/colors";
import pengaturanNavs from "../../constant/pengaturanNavs";
import { iconSize } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";
import CContainer from "../wrapper/CContainer";
import PermissionTooltip from "../wrapper/PermissionTooltip";

interface Props {
  activeGroup?: number;
  active?: number;
}

export default function PengaturanNavs({ activeGroup, active }: Props) {
  // SX
  const lightDarkColor = useLightDarkColor();
  const { userPermissions } = useAuth();

  return (
    <CContainer
      py={4}
      bg={lightDarkColor}
      borderRadius={12}
      w={"240px"}
      flex={"0 0 240px"}
      flexShrink={0}
      gap={4}
      overflowY={"auto"}
      className="scrollY"
      maxH={"100%"}
    >
      <CContainer
        px={4}
        bg={lightDarkColor}
        borderRadius={12}
        flex={1}
        gap={4}
        overflowY={"auto"}
        className="scrollY"
      >
        {pengaturanNavs.map((nav, i) => {
          // const hasSomePermissions = isHasSomePermissions(
          //   userPermissions,
          //   nav.allowed
          // );

          return (
            <CContainer key={i} gap={2}>
              <Text fontWeight={600} opacity={0.4}>
                {nav.groupName}
              </Text>

              {nav.navs.map((subNav, ii) => {
                const hasPermission = isHasPermissions(
                  userPermissions,
                  subNav.allowed
                );

                return (
                  <PermissionTooltip
                    key={ii}
                    permission={hasPermission}
                    placement="right"
                    boxProps={{
                      w: "100%",
                    }}
                  >
                    <Button
                      justifyContent={"flex-start"}
                      leftIcon={
                        <Icon
                          as={subNav.icon}
                          fontSize={iconSize}
                          // opacity={0.4}
                        />
                      }
                      isDisabled={!hasPermission}
                      className={
                        activeGroup === i && ii === active ? "btn-apa" : "btn"
                      }
                      fontWeight={500}
                      as={Link}
                      to={hasPermission ? subNav.link : ""}
                      h={"40px"}
                      w={"100%"}
                      size={"sm"}
                      px={"8px !important"}
                    >
                      {subNav.label}
                    </Button>
                  </PermissionTooltip>
                );
              })}
            </CContainer>
          );
        })}
      </CContainer>
    </CContainer>
  );
}

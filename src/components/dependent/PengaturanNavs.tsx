import { Button, Icon, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useLightDarkColor } from "../../constant/colors";
import pengaturanNavs from "../../constant/pengaturanNavs";
import { iconSize } from "../../constant/sizes";
import CContainer from "../wrapper/CContainer";

interface Props {
  activeGroup: number;
  active: number;
}

export default function PengaturanNavs({ activeGroup, active }: Props) {
  // SX
  const lightDarkColor = useLightDarkColor();

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
        {pengaturanNavs.map((nav, i) => (
          <CContainer key={i} gap={2}>
            <Text fontWeight={600} opacity={0.4}>
              {nav.groupName}
            </Text>
            {nav.navs.map((subNav, ii) => (
              <Button
                key={ii}
                justifyContent={"flex-start"}
                leftIcon={
                  <Icon
                    as={subNav.icon}
                    fontSize={iconSize}
                    // opacity={0.4}
                  />
                }
                className={
                  activeGroup === i && ii === active ? "btn-apa" : "btn"
                }
                fontWeight={500}
                as={Link}
                to={subNav.link}
                h={"40px"}
                size={"sm"}
                px={"8px !important"}
              >
                {subNav.label}
              </Button>
            ))}
          </CContainer>
        ))}
      </CContainer>
    </CContainer>
  );
}

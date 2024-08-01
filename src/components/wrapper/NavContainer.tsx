import {
  Box,
  HStack,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  StackProps,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { RiShieldUserFill } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeCookie } from "typescript-cookie";
import { useContentBgColor, useLightDarkColor } from "../../constant/colors";
import navs from "../../constant/navs";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useGetUserData from "../../hooks/useGetUserData";
import useScreenWidth from "../../lib/useScreenWidth";
import Header from "../dependent/Header";
import TopNavs from "../dependent/TopNavs";
import ComponentSpinner from "../independent/ComponentSpinner";
import CContainer from "./CContainer";
import Container from "./Container";
import useLogout from "../../hooks/useLogout";

const NavMenu = ({ nav, i, active, topNavActive }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 50);
  };

  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        as={IconButton}
        aria-label={`Nav Button ${nav.label}`}
        icon={
          <Icon
            as={nav.icon}
            fontSize={iconSize}
            opacity={active === i ? 1 : 0.6}
          />
        }
        className="btn"
        onClick={() => {
          navigate(nav.link);
        }}
        color={active === i ? "p.500" : ""}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <Portal>
        <MenuList
          zIndex={20}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => {
            setIsOpen(false);
          }}
          minW={"fit-content"}
          sx={{
            position: "absolute",
            top: nav.label === "Pengaturan" ? "4px" : "-52px",
            left: "calc(100% + 42px)",
            marginLeft: "8px",
          }}
        >
          {nav.subNavs.map((subNav: any, ii: number) => (
            <MenuItem
              key={ii}
              as={Link}
              to={subNav.link}
              fontWeight={(active === i && ii) === topNavActive ? 600 : 500}
              color={(active === i && ii) === topNavActive ? "p.500" : ""}
              bg={(active === i && ii) === topNavActive ? "var(--p500a5)" : ""}
              whiteSpace={"nowrap"}
            >
              {subNav.label}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};

interface Props extends StackProps {
  active: number;
  children?: any;
  noNavs?: boolean;
  title?: string;
  left?: any;
  backLink?: string;
  right?: any;
  topNavsData?: any;
  topNavActive?: number;
  allowed?: number[];
}

export default function NavContainer({
  children,
  active,
  noNavs,
  title,
  left,
  backLink,
  right,
  topNavsData,
  topNavActive,
  allowed,
  ...props
}: Props) {
  const smScreen = useScreenWidth() <= 768;

  // SX
  const lightDarkColor = useLightDarkColor();

  const [loading, setLoading] = useState<boolean>(true);
  const userData = useGetUserData();
  const navigate = useNavigate();
  const { logout } = useLogout();

  useEffect(() => {
    setLoading(true);
    if (allowed && allowed.length > 0) {
      const hasPermission = userData.permissions.some((permission: any) =>
        allowed.includes(permission.id)
      );
      if (!hasPermission) {
        navigate("/");
        logout();
        removeCookie("__auth_token");
        removeCookie("__user_data");
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [allowed, userData.permissions, navigate, logout]);

  return (
    <Container>
      <HStack flex={1} align={"stretch"} gap={0}>
        {!noNavs && !smScreen && (
          <VStack
            id="navs"
            p={4}
            justify={"space-between"}
            h={"100vh"}
            overflowY={"auto"}
            overflowX={"clip"}
            position={"sticky"}
            top={0}
            w={"72px"}
            flexShrink={0}
          >
            <VStack flex={1}>
              <Image src="/logo512.png" w={"40px"} mb={8} />

              {navs.map((nav, i) => (
                <Box key={i} mt={nav.label === "Profil" ? "auto" : ""}>
                  <NavMenu
                    nav={nav}
                    i={i}
                    topNavActive={topNavActive}
                    active={active}
                  />
                </Box>
              ))}
            </VStack>
          </VStack>
        )}

        {!noNavs && smScreen && (
          <Box overflowX={"auto"}>
            <HStack
              id="navs"
              position={"fixed"}
              bottom={0}
              left={0}
              minW={"100%"}
              h={"70px"}
              pb={4}
              zIndex={99}
              bg={lightDarkColor}
              justify={"center"}
            >
              {navs.map((nav, i) => (
                <Tooltip key={i} placement="top">
                  <IconButton
                    aria-label={`Nav Button ${nav.label}`}
                    icon={
                      <Icon
                        as={nav.icon}
                        fontSize={20}
                        opacity={active === i ? 1 : 0.6}
                      />
                    }
                    className="btn clicky"
                    color={active === i ? "p.500" : ""}
                    as={Link}
                    to={nav.link}
                  />
                </Tooltip>
              ))}
            </HStack>
          </Box>
        )}

        <CContainer
          bg={useContentBgColor()}
          pb={["86px", null, 6]}
          align={"stretch"}
          h={"100vh"}
          maxW={smScreen ? "100%" : "calc(100% - 72px)"}
          // w={"100%"}
          flex={"1 1 0"}
          overflowX={"clip"}
          overflowY={"auto"}
          {...props}
        >
          <Header
            title={title}
            left={left}
            backLink={backLink}
            right={right}
            p={responsiveSpacing}
          />

          {topNavsData &&
            topNavsData.length > 1 &&
            typeof topNavActive === "number" && (
              <TopNavs
                data={topNavsData}
                active={topNavActive}
                mb={responsiveSpacing}
              />
            )}

          <VStack
            gap={0}
            w={"100%"}
            align={"stretch"}
            mx={"auto"}
            flex={1}
            overflowY={"auto"}
            // maxW={"1280px"}
          >
            {loading && (
              <VStack justify={"center"} flex={1} position={"relative"}>
                <ComponentSpinner
                  position={"absolute"}
                  spinnerProps={{ size: "xl" }}
                />

                <Icon as={RiShieldUserFill} fontSize={32} opacity={0.4} />
              </VStack>
            )}

            {!loading && children}
          </VStack>
        </CContainer>
      </HStack>
    </Container>
  );
}

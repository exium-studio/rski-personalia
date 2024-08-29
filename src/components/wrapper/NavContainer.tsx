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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiShieldUserFill } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { useContentBgColor, useLightDarkColor } from "../../constant/colors";
import navs from "../../constant/navs";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useLogout from "../../hooks/useLogout";
import isHasPermissions from "../../lib/isHasPermissions";
import isHasSomePermissions from "../../lib/isHasSomePermissions";
import req from "../../lib/req";
import useScreenWidth from "../../lib/useScreenWidth";
import Header from "../dependent/Header";
import TopNavs from "../dependent/TopNavs";
import ComponentSpinner from "../independent/ComponentSpinner";
import CContainer from "./CContainer";
import Container from "./Container";
import PermissionTooltip from "./PermissionTooltip";

const NavMenu = ({ nav, i, active, topNavActive, navsRef }: any) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const { userPermissions } = useAuth();
  const hasPermissions = isHasSomePermissions(userPermissions, nav.allowed);

  // console.log(nav.label, hasPermissions);

  return (
    <Menu isOpen={isOpen}>
      <PermissionTooltip permission={hasPermissions} placement="right">
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
          boxShadow={"none !important"}
          border={"none !important"}
          _focusVisible={{
            boxShadow: "none !important",
            border: "none !important",
          }}
          className="btn"
          // onClick={() => {
          //   navigate(nav.link);
          // }}
          color={active === i ? "p.500" : ""}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          isDisabled={!hasPermissions}
        />
      </PermissionTooltip>

      <Portal containerRef={navsRef}>
        <MenuList
          zIndex={99}
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
          {nav.subNavs.map((subNav: any, ii: number) => {
            const permission = isHasPermissions(
              userPermissions,
              subNav.allowed
            );

            return (
              <PermissionTooltip
                key={ii}
                permission={permission}
                placement="right"
              >
                <MenuItem
                  as={Link}
                  to={subNav.link}
                  fontWeight={(active === i && ii) === topNavActive ? 600 : 500}
                  color={(active === i && ii) === topNavActive ? "p.500" : ""}
                  bg={
                    (active === i && ii) === topNavActive ? "var(--p500a5)" : ""
                  }
                  whiteSpace={"nowrap"}
                  isDisabled={!permission}
                >
                  {subNav.label}
                </MenuItem>
              </PermissionTooltip>
            );
          })}
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
  const contentBgColor = useContentBgColor();

  const { logout } = useLogout();

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const { userPermissions, setUserPermissions } = useAuth();

  useEffect(() => {
    const authToken = getCookie("__auth_token");
    if (!authToken) {
      logout();
    } else {
      if (!userPermissions) {
        setLoading(true);
        req
          .get(`/api/rski/dashboard/user-info`)
          .then((r) => {
            if (r.status === 200) {
              const userData = r.data.data;
              if (userData.status_aktif === 2) {
                setUserPermissions(userData.permission);
              } else {
                logout();
                console.log("logging out...");
              }
            }
          })
          .catch((e) => {
            console.log(e);
            toast({
              status: "error",
              title:
                (typeof e?.response?.data?.message === "string" &&
                  (e?.response?.data?.message as string)) ||
                "Maaf terjadi kesalahan pada sistem",
              position: "bottom-right",
              isClosable: true,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, []);

  const navsRef = useRef(null);

  return (
    <Container
      maxH={"100vh"}
      overflowY={"clip"}
      border={"1px solid transparent"}
    >
      {loading && (
        <VStack
          p={5}
          h={"100vh"}
          justify={"center"}
          flex={1}
          position={"relative"}
        >
          <ComponentSpinner
            position={"absolute"}
            spinnerProps={{ size: "xl", w: "80px", h: "80px" }}
            opacity={0.4}
          />

          <Icon as={RiShieldUserFill} fontSize={32} opacity={0.4} />
        </VStack>
      )}

      {!loading && (
        <HStack flex={1} align={"stretch"} gap={0}>
          {!noNavs && !smScreen && (
            <VStack
              ref={navsRef}
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
              zIndex={20}
            >
              <VStack flex={1}>
                <Image src="/logo512.png" w={"40px"} mb={8} />

                {navs.map((nav, i) => (
                  <Box key={i} mt={nav.label === "Profil" ? "auto" : ""}>
                    <NavMenu
                      containerRef={navsRef}
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
            bg={contentBgColor}
            pb={["86px", null, 0]}
            align={"stretch"}
            h={"100vh"}
            maxW={smScreen ? "100%" : "calc(100% - 72px)"}
            // w={"100%"}
            flex={"1 1 0"}
            overflowX={"clip"}
            overflowY={"auto"}
            {...props}
          >
            {active !== 6 && (
              <Header
                title={title}
                left={left}
                backLink={backLink}
                right={right}
                p={responsiveSpacing}
              />
            )}

            {topNavsData &&
              topNavsData.length > 1 &&
              typeof topNavActive === "number" && (
                <TopNavs data={topNavsData} active={topNavActive} />
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
              {children}
            </VStack>
          </CContainer>
        </HStack>
      )}
    </Container>
  );
}

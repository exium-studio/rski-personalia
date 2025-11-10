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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiShieldUserFill } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContentBgColor } from "../../constant/colors";
import navs from "../../constant/navs";
import { iconSize, responsiveSpacing } from "../../constant/sizes";
import useAuth from "../../global/useAuth";
import useLogout from "../../hooks/useLogout";
import isHasPermissions from "../../lib/isHasPermissions";
import isHasSomePermissions from "../../lib/isHasSomePermissions";
import req from "../../lib/req";
import useScreenWidth from "../../lib/useScreenWidth";
import Header from "../dependent/Header";
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
  const hasSomePermissions = isHasSomePermissions(userPermissions, nav.allowed);

  // console.log(userPermissions);

  return (
    <Menu isOpen={isOpen}>
      <PermissionTooltip permission={hasSomePermissions} placement="right">
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
          onClick={handleMouseEnter}
          isDisabled={!hasSomePermissions}
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
  const contentBgColor = useContentBgColor();

  const { logout } = useLogout();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const { userPermissions, setUserPermissions } = useAuth();
  const userPermissionsRef = useRef(userPermissions);

  const logoutRef = useRef(logout);

  const authToken = localStorage.getItem("__auth_token");
  if (!authToken) {
    navigate("/");
    logoutRef.current();
  }

  useEffect(() => {
    if (!userPermissionsRef.current) {
      setLoading(true);
      req
        .get(`/api/rski/dashboard/user-info`)
        .then((r) => {
          if (r?.status === 200) {
            const userData = r.data.data;
            if (userData.status_aktif === 2) {
              setUserPermissions(userData.permission);
              userPermissionsRef.current = userData.permission;
              localStorage.setItem("__user_data", JSON.stringify(userData));
            } else {
              logoutRef.current();
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
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [setUserPermissions, toast, navigate]);

  useEffect(() => {
    if (userPermissions) {
      if (!isHasPermissions(userPermissions, allowed)) {
        window.history.back();
        toast({
          status: "error",
          title: "Tidak ada akses",
          position: "bottom-right",
          isClosable: true,
        });
      }
    }
  }, [userPermissions, allowed, toast]);

  const navsRef = useRef(null);

  return (
    <Container
      maxH={"100dvh"}
      overflow={"clip"}
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
          {!noNavs && (
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

          {/* {!noNavs && smScreen && (
            <Box
              overflowX={"auto"}
              position={"fixed"}
              bottom={0}
              left={0}
              w={"100vw"}
              bg={lightDarkColor}
              zIndex={99999}
            >
              <HStack id="navs" w={"100%"} h={"70px"} pb={4} zIndex={99}>
                <HStack justify={"center"} px={5}>
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
              </HStack>
            </Box>
          )} */}

          <CContainer
            bg={contentBgColor}
            // pb={["86px", null, 0]}
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

            {/* {topNavsData &&
              smScreen &&
              topNavsData.length > 1 &&
              typeof topNavActive === "number" && (
                <TopNavs data={topNavsData} active={topNavActive} mb={4} />
              )} */}

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

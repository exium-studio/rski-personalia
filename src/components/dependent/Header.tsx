import {
  Box,
  ButtonGroup,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackProps,
  Text,
} from "@chakra-ui/react";
import {
  RiMenu4Line,
  RiNotification2Line,
  RiRestartLine,
} from "@remixicon/react";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { useContentBgColor } from "../../constant/colors";
import { iconSize } from "../../constant/sizes";
import formatDate from "../../lib/formatDate";
import useScreenWidth from "../../lib/useScreenWidth";
import AdminMiniProfile from "../independent/AdminMiniProfile";
import BackButton from "../independent/BackButton";
import { ColorModeSwitcherHeaderMenu } from "../independent/ColorModeSwitcherHeaderMenu";
import NotificationButton from "../independent/NotificationModal";
import RefreshButton from "../independent/RefreshButton";

interface Props extends StackProps {
  title?: string;
  left?: any;
  backLink?: string;
  right?: any;
  noMiniProfile?: boolean;
}

export default function Header({
  title,
  left,
  backLink,
  right,
  noMiniProfile = false,
  ...props
}: Props) {
  const smScreen = useScreenWidth() <= 768;

  return (
    <HStack
      justify={"space-between"}
      gap={4}
      position={"sticky"}
      top={0}
      zIndex={99}
      bg={useContentBgColor()}
      {...props}
    >
      <HStack>
        {left && (
          <Box w={"40px"}>
            {left === "back" ? <BackButton backLink={backLink} /> : left}
          </Box>
        )}

        <Text fontSize={24} fontWeight={700} noOfLines={1}>
          {title}
        </Text>
      </HStack>

      {!smScreen && (
        <>
          <Text ml={"auto"} opacity={0.6}>
            {formatDate(new Date(), "long")}
          </Text>

          <ButtonGroup>
            <RefreshButton className="btn-solid clicky" />

            <NotificationButton aria-label="Notification Button" />

            <ColorModeSwitcher className="btn-solid clicky" />

            {!noMiniProfile && <AdminMiniProfile />}
          </ButtonGroup>
        </>
      )}

      {smScreen && (
        <HStack>
          <AdminMiniProfile />

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Icon as={RiMenu4Line} fontSize={24} />}
              className="btn-solid"
            />

            <MenuList>
              <MenuItem
                onClick={() => {
                  window.location.reload();
                }}
              >
                <HStack>
                  <Icon as={RiRestartLine} fontSize={iconSize} />
                  <Text>Reload</Text>
                </HStack>
              </MenuItem>

              <MenuItem>
                <HStack>
                  <Icon as={RiNotification2Line} fontSize={iconSize} />
                  <Text>Notifikasi</Text>
                </HStack>
              </MenuItem>

              <MenuItem p={0}>
                {/* <HStack>
                  <Icon as={RiNotification2Line} fontSize={iconSize} />
                  <Text>Mode Gelap</Text>
                </HStack> */}
                <ColorModeSwitcherHeaderMenu />
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      )}
    </HStack>
  );
}

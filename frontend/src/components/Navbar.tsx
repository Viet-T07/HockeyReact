import React from "react";

import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/router";

import TeamGrid from "./TeamGrid";

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();

  return (
    <Box paddingBottom={20}>
      <Flex
        position="fixed"
        w="100%"
        bg={useColorModeValue("white", "purple.700")}
        // color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        // borderBottom={1}
        // borderStyle={"solid"}
        // borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        zIndex={+100}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            <Link href="/">Advanced Hockey</Link>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          onClick={() => router.push("/player/search?name=")}
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "black");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => {
                    return child.label === "View Teams" ? (
                      <TeamPopover key={child.label} label={child.label} />
                    ) : (
                      <DesktopSubNav key={child.label} {...child} />
                    );
                  })}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "black") }}
    >
      <DesktopSubNavText label={label} subLabel={subLabel} />
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const DesktopSubNavText = ({ label, subLabel }: NavItem) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Box>
        <Text
          transition={"all .3s ease"}
          _groupHover={{ color: "purple.700" }}
          fontWeight={500}
        >
          {label}
        </Text>
        <Text fontSize={"sm"}>{subLabel}</Text>
      </Box>
      <Flex
        transition={"all .3s ease"}
        transform={"translateX(-10px)"}
        opacity={0}
        _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
        justify={"flex-end"}
        align={"center"}
        flex={1}
      >
        <Icon color={"purple.700"} w={5} h={5} as={ChevronRightIcon} />
      </Flex>
    </Stack>
  );
};

const TeamPopover = ({ label, subLabel }: NavItem) => {
  const popoverContentBgColor = useColorModeValue("white", "black");
  return (
    <Popover placement="right-start" trigger="hover">
      <PopoverTrigger>
        <Button
          role={"group"}
          display={"block"}
          p={2}
          rounded={"md"}
          _hover={{ bg: useColorModeValue("pink.50", "black") }}
          variant="link"
        >
          <DesktopSubNavText label={label} subLabel={subLabel} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        border={0}
        marginTop={-4}
        boxShadow={"xl"}
        bg={popoverContentBgColor}
        pt={2}
        rounded={"xl"}
        minW={"2xl"}
      >
        <TeamGrid downsize={true} />
      </PopoverContent>
    </Popover>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Line",
    children: [
      {
        label: "Best Performing Lines",
        href: "/line",
      },
      {
        label: "Most Common Lines",
        href: "#",
      },
    ],
  },
  {
    label: "Teams",
    href: "/teams",
    children: [
      {
        label: "View Teams",
      },
      {
        label: "Team Stats",
        href: "/teams/stats",
      },
    ],
  },
  {
    label: "Players",
    children: [
      {
        label: "Stats",
        href: "#",
      },
      {
        label: "Compare Players",
        href: "/player/compare",
      },
    ],
  },
  {
    label: "League",
    children: [
      {
        label: "Drafts",
        href: "/draft",
      },
      {
        label: "Standings",
        href: "/standings/division/20202021",
      },
      {
        label: "Awards",
        href: "/awards",
      },
      {
        label: "Playoffs",
        href: "/playoffs",
      },
      {
        label: "All Time Leaders",
        href: "#",
      },
      {
        label: "Rookies",
        href: "#",
      },
    ],
  },
  {
    label: "News",
    children: [
      {
        label: "Feed",
        href: "#",
      },
      {
        label: "Transactions",
        href: "#",
      },
    ],
  },
];

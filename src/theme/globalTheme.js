import { extendTheme } from "@chakra-ui/react";

export const globalTheme = extendTheme({
  config: {
    initialColorMode: "light",
  },

  colors: {
    p: {
      50: "#E9FFF6",
      100: "#CFFBE9",
      200: "#A0F7DC",
      300: "#6EE8CD",
      400: "#47D1BF",
      500: "#16B3AC",
      600: "#109399",
      700: "#0B7180",
      800: "#075267",
      900: "#043C55",
    },
    ap: {
      50: "#16B3AC1b",
      100: "#16B3AC2b",
      200: "#16B3AC",
      300: "#16B3AC",
      400: "#16B3AC",
      500: "#16B3AC",
      600: "#16B3AC",
      700: "#16B3AC",
      800: "#16B3AC",
      900: "#16B3AC",
    },
    error: {
      50: "#FFF5F5",
      100: "#FED7D7",
      200: "#FC8181",
      300: "#FC8181",
      400: "#F56565",
      500: "#E53E3E",
      600: "#C53030",
      700: "#9B2C2C",
      800: "#822727",
      900: "#63171B",
    },
    bnw: {
      200: "white",
      300: "white",
      500: "#191919",
      600: "#191919",
    },
    wnb: {
      200: "#191919",
      300: "#191919",
      500: "white",
      600: "white",
    },
    dark: "#191919",
  },

  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "dark" : "white",
        color: props.colorMode === "dark" ? "wt" : "bt",
      },
    }),
  },

  components: {
    Accordion: {
      baseStyle: (props) => ({
        container: {
          borderColor: "var(--divider)",
        },
        panel: {
          pb: 2,
        },
      }),
    },

    Alert: {
      baseStyle: (props) => ({
        container: {
          borderRadius: 12,
        },
      }),
      variants: {
        // Perbarui varian subtle untuk status error
        subtle: (props) => ({
          container: {
            bg: props.status === "error" ? "var(--reda3)" : undefined,
          },
          icon: {
            color: props.status === "error" ? "red.400" : undefined,
          },
        }),
      },
    },

    Badge: {
      baseStyle: (props) => ({
        p: "4px 12px",
        borderRadius: 6,
        fontSize: [10, null, 12],
        fontWeight: 500,
        // textTransform: "none",
      }),
    },

    Button: {
      baseStyle: {
        fontWeight: 550,
        borderRadius: 8,
      },
      sizes: {
        md: {
          px: 6,
        },
      },
    },

    Checkbox: {
      baseStyle: (props) => ({
        icon: {
          color: "white",
        },
        control: {
          border: props.isInvalid
            ? "1.5px solid #E53E3E"
            : "3px solid var(--divider3) !important",
          _focusVisible: {
            boxShadow: "none !important",
          },
        },
      }),
    },

    Drawer: {
      baseStyle: (props) => ({
        overlay: {
          bg: "#00000011",
          backdropFilter: "blur(5px)",
        },
        dialog: {
          bg: props.colorMode === "dark" ? "dark" : "white",
          boxShadow: "none",
        },
        header: {
          py: "20px",
          pt: "18px",
          px: "24px",
          pr: "20px",
        },
        body: {
          px: "24px",
          py: "0px !important",
          display: "flex",
          flexDirection: "column",
          // minH: window.innerWidth < 500 ? "300px" : "fit-content",
        },
        closeButton: {
          borderRadius: "full",
          right: 4,
          top: 4,
          fontSize: "13px !important",
        },
      }),
    },

    Input: {
      baseStyle: (props) => ({
        field: {
          _autofill: {
            border: "1px solid var(--divider3) !important",
          },
        },
      }),
    },

    Menu: {
      baseStyle: (props) => ({
        groupTitle: {
          opacity: 0.5,
          cursor: "default",
        },
        divider: {
          my: 0,
          // mx: -1,
          borderColor: "var(--divider3)",
        },
        list: {
          // bg: props.colorMode === "dark" ? "dark" : "white",
          bg: "#303030df",
          color: "white",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--divider)",
          overflow: "hidden",
          boxShadow: "none",
          borderRadius: 8,
          p: "0px !important",
          // p: "4px",
        },
        item: {
          // borderRadius: "6px",
          bg: "transparent",
          _hover: { bg: "var(--divider3)" },
          _focus: { border: "none !important", boxShadow: "none !important" },
          _focusVisible: {
            border: "none !important",
            boxShadow: "none !important",
          },
          fontSize: 14,
          justifyContent: "space-between",
          py: 3,
          px: 4,
        },
      }),
    },

    Modal: {
      baseStyle: (props) => ({
        dialogContainer: {
          p: 4,
          className: "scrollY",
        },
        dialog: {
          bg: props.colorMode === "dark" ? "dark" : "white",
          color: props.colorMode === "dark" ? "wt" : "bt",
          // bg: "#252525ee",
          // color: "white !important",
          backdropFilter: "blur(40px)",
          boxShadow: "none",
          borderRadius: 12,
          // m: 4,
          border: "1px solid var(--divider2)",
          className: "scrollY",
          // maxH: "100%",
        },
        overlay: {
          bg: "#00000011",
          backdropFilter: "blur(8px)",
        },
        header: {
          p: 0,
          // pt: "18px",
          // pr: "20px",
          // pb: "20px",
          // pl: "24px",
        },
        body: {
          px: "24px",
          py: "0px !important",
          display: "flex",
          flexDirection: "column",
          // minH: window.innerWidth < 500 ? "300px" : "fit-content",
        },
        footer: {
          px: "24px",
          pt: "24px",
          pb: "24px",
        },
        closeButton: {
          borderRadius: "full",
          right: 4,
          top: 4,
          fontSize: "13px !important",
          // color: "red.400",
        },
      }),
    },

    Popover: {
      baseStyle: (props) => ({
        popper: {
          minW: "300px !important",
        },
        content: {
          fontSize: 14,
          // pr: 5,
          bg: props.colorMode === "dark" ? "dark" : "white",
          color: props.colorMode === "dark" ? "white" : "dark",
        },
        body: {
          pr: 8,
        },
        arrow: {
          bg: props.colorMode === "dark" ? "dark !important" : "white",
          color: props.colorMode === "dark" ? "dark" : "white",
        },
        closeButton: {
          right: 1,
          fontSize: "12px !important",
        },
      }),
    },

    Radio: {
      baseStyle: (props) => ({
        control: {
          border: "1px solid var(--divider3) !important",
        },
      }),
    },

    Skeleton: {
      baseStyle: (props) => ({
        // bg: "var(--divider3) !important",
        borderRadius: 8,
      }),
    },

    Table: {
      thead: {
        color: "var(--divider3) !important",
      },
      sizes: {
        md: {
          // th: {
          //   py: "16px",
          //   px: "12px",
          // },
          td: {
            py: "12px",
            px: "16px",
          },
        },
      },
    },

    Toast: {
      baseStyle: {
        fontSize: [13, null, 15],
        borderRadius: 8,
      },
      container: {
        w: "100% !important",
        maxW: "500px !important",
      },
    },

    Tooltip: {
      baseStyle: {
        bg: "#252525ee",
        color: "white !important",
        "--popper-arrow-bg": "#252525ee",
        backdropFilter: "blur(40px)",
        border: "1px solid var(--divider3)",
        borderRadius: 8,
        px: 4,
        py: 2,
      },
    },
  },
});

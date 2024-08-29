import { Checkbox } from "@chakra-ui/react";
import { Dispatch, useState } from "react";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";

interface Props {
  role_id: number;
  data: any[];
  totalPermissions: number;
  setTotalPermissions: Dispatch<number>;
  totalPermissionsAllowed: number;
  setTotalPermissionsAllowed: Dispatch<number>;
  setAllPermissions: Dispatch<boolean>;
  formik: any;
}

export default function TabelPengaturanKeizinan({
  role_id,
  data,
  totalPermissions,
  setTotalPermissions,
  totalPermissionsAllowed,
  setTotalPermissionsAllowed,
  setAllPermissions,
  formik,
}: Props) {
  // Filter Config
  const [filterConfig] = useState({
    search: "",
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm);

    return matchesSearchTerm;
  });

  const handleCheckboxChange = (index: number, key: string) => {
    const updatedPermissions = [...formik.values.permissions];
    const prevValue = updatedPermissions[index].permissions[key].has_permission;
    if (!prevValue) {
      setTotalPermissionsAllowed(totalPermissionsAllowed + 1);
      if (totalPermissionsAllowed + 1 === totalPermissions) {
        setAllPermissions(true);
      }
    } else {
      setTotalPermissionsAllowed(totalPermissionsAllowed - 1);
      setAllPermissions(false);
    }
    updatedPermissions[index].permissions[key].has_permission =
      !updatedPermissions[index].permissions[key].has_permission;
    formik.setFieldValue("permissions", updatedPermissions);
  };

  const formattedHeader = [
    {
      th: "Nama Modul",
      props: {
        position: "sticky",
        left: 0,
        zIndex: 2,
        minW: "136px",
      },
      cProps: {
        borderRight: "1px solid var(--divider3)",
      },
      isSortable: true,
    },
    {
      th: "View",
      props: {
        minW: "136px",
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Create",
      props: {
        minW: "136px",
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Edit",
      props: {
        minW: "136px",
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Delete",
      props: {
        minW: "136px",
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Export",
      props: {
        minW: "136px",
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Import",
      props: {
        minW: "136px",
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Verifikasi 1",
      props: {
        minW: "136px",
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Verifikasi 2",
      props: {
        minW: "136px",
      },
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Bypass Unit Kerja",
      props: {
        minW: "136px",
      },
      cProps: {
        justify: "center",
      },
    },
  ];

  const permissionsColumn = (item: any, groupIndex: number) => {
    const np = Object.keys(item).map((key, i) => ({
      value: item[key]?.has_permission,
      td: (
        <Checkbox
          colorScheme="ap"
          size={"lg"}
          display={item[key]?.has_permission === null ? "none" : "block"}
          opacity={item[key]?.has_permission === null ? 0 : 1}
          // isDisabled={item[key]?.has_permission === null}
          isDisabled={role_id === 1}
          isChecked={item[key]?.has_permission}
          onChange={() => handleCheckboxChange(groupIndex, key)}
        ></Checkbox>
      ),
      cProps: {
        justify: "center",
      },
    }));

    return np;
  };
  const formattedData = fd?.map((item: any, groupIndex: number) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.name,
        td: item.name,
        props: {
          position: "sticky",
          left: 0,
          zIndex: 1,
          minW: "136px",
        },
        cProps: {
          borderRight: "1px solid var(--divider3)",
        },
      },
      ...permissionsColumn(item.permissions, groupIndex),
    ],
  }));

  // SX

  // console.log("permission", data);

  return (
    <>
      {/* <HStack mb={responsiveSpacing}>
        <SearchComponent
          name="search"
          onChangeSetter={(input) => {
            setFilterConfig((ps) => ({
              ...ps,
              search: input,
            }));
          }}
          inputValue={filterConfig.search}
        />
      </HStack> */}

      {fd?.length === 0 && <NotFound />}

      {fd?.length > 0 && (
        <CustomTableContainer>
          <CustomTable
            formattedHeader={formattedHeader}
            formattedData={formattedData}
            // rowOptions={rowOptions}
          />
        </CustomTableContainer>
      )}
    </>
  );
}

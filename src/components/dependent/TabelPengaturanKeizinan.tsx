import { Checkbox, HStack } from "@chakra-ui/react";
import { Dispatch, useState } from "react";
import { responsiveSpacing } from "../../constant/sizes";
import NotFound from "../independent/NotFound";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";

interface Props {
  data: any[];
  totalPermissions: number;
  setTotalPermissions: Dispatch<number>;
  totalPermissionsAllowed: number;
  setTotalPermissionsAllowed: Dispatch<number>;
  setAllPermissions: Dispatch<boolean>;
  formik: any;
}

export default function TabelPengaturanKeizinan({
  data,
  totalPermissions,
  setTotalPermissions,
  totalPermissionsAllowed,
  setTotalPermissionsAllowed,
  setAllPermissions,
  formik,
}: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
  });

  const fd = data?.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm);

    return matchesSearchTerm;
  });

  const handleCheckboxChange = (index: number, key: string) => {
    const updatedPermissions = [...formik.values.permissions];
    const prevValue = updatedPermissions[index].permissions[key];
    if (!prevValue) {
      setTotalPermissionsAllowed(totalPermissionsAllowed + 1);
      if (totalPermissionsAllowed + 1 === totalPermissions) {
        setAllPermissions(true);
      }
    } else {
      setTotalPermissionsAllowed(totalPermissionsAllowed - 1);
      setAllPermissions(false);
    }
    updatedPermissions[index].permissions[key] =
      !updatedPermissions[index].permissions[key];
    formik.setFieldValue("permissions", updatedPermissions);
  };

  const formattedHeader = [
    {
      th: "Nama Modul",
      isSortable: true,
    },
    {
      th: "View",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Create",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Edit",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Delete",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Export",
      cProps: {
        justify: "center",
      },
    },
    {
      th: "Import",
      cProps: {
        justify: "center",
      },
    },
  ];
  const permissionsColumn = (item: any, groupIndex: number) => {
    const np = Object.keys(item).map((key, i) => ({
      value: item[key],
      td: (
        <Checkbox
          colorScheme="ap"
          size={"lg"}
          display={item[key] === null ? "none" : "block"}
          opacity={item[key] === null ? 0 : 1}
          isDisabled={item[key] === null}
          isChecked={item[key]}
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
      },
      ...permissionsColumn(item.permissions, groupIndex),
    ],
  }));

  // SX

  return (
    <>
      <HStack mb={responsiveSpacing}>
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
      </HStack>

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

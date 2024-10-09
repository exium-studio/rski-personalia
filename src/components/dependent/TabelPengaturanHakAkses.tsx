import { Checkbox, HStack, Text } from "@chakra-ui/react";
import { Dispatch, useState } from "react";
import { useLightDarkColor } from "../../constant/colors";
import NotFound from "../independent/NotFound";
import CContainer from "../wrapper/CContainer";

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

export default function TabelPengaturanHakAkses({
  role_id,
  data,
  totalPermissions,
  setTotalPermissions,
  totalPermissionsAllowed,
  setTotalPermissionsAllowed,
  setAllPermissions,
  formik,
}: Props) {
  // SX
  const lightDarkColor = useLightDarkColor();

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

  // const formattedHeader = [
  //   {
  //     th: "Nama Modul",
  //     props: {
  //       position: "sticky",
  //       left: 0,
  //       zIndex: 2,
  //       minW: "136px",
  //     },
  //     cProps: {
  //       borderRight: "1px solid var(--divider3)",
  //     },
  //     isSortable: true,
  //   },
  //   {
  //     th: "View",
  //     props: {
  //       minW: "136px",
  //     },
  //     cProps: {
  //       justify: "center",
  //     },
  //   },
  //   {
  //     th: "Create",
  //     props: {
  //       minW: "136px",
  //     },
  //     cProps: {
  //       justify: "center",
  //     },
  //   },
  //   {
  //     th: "Edit",
  //     props: {
  //       minW: "136px",
  //     },
  //     cProps: {
  //       justify: "center",
  //     },
  //   },
  //   {
  //     th: "Delete",
  //     props: {
  //       minW: "136px",
  //     },
  //     cProps: {
  //       justify: "center",
  //     },
  //   },
  //   {
  //     th: "Import",
  //     props: {
  //       minW: "136px",
  //     },
  //     cProps: {
  //       justify: "center",
  //     },
  //   },
  //   {
  //     th: "Export",
  //     props: {
  //       minW: "136px",
  //     },
  //     cProps: {
  //       justify: "center",
  //     },
  //   },
  //   {
  //     th: "Verifikasi 1",
  //     props: {
  //       minW: "136px",
  //     },
  //     cProps: {
  //       justify: "center",
  //     },
  //   },
  //   {
  //     th: "Verifikasi 2",
  //     props: {
  //       minW: "136px",
  //     },
  //     cProps: {
  //       justify: "center",
  //     },
  //   },
  //   {
  //     th: "Bypass Unit Kerja",
  //     props: {
  //       minW: "136px",
  //     },
  //     cProps: {
  //       justify: "center",
  //     },
  //   },
  // ];

  // const permissionsColumn = (item: any, groupIndex: number) => {
  //   const np = Object.keys(item).map((key, i) => ({
  //     value: item[key]?.has_permission,
  //     td: (
  //       <Checkbox
  //         colorScheme="ap"
  //         size={"lg"}
  //         display={item[key]?.has_permission === null ? "none" : "block"}
  //         opacity={item[key]?.has_permission === null ? 0 : 1}
  //         // isDisabled={item[key]?.has_permission === null}
  //         isDisabled={role_id === 1}
  //         isChecked={item[key]?.has_permission}
  //         onChange={() => handleCheckboxChange(groupIndex, key)}
  //       ></Checkbox>
  //     ),
  //     cProps: {
  //       justify: "center",
  //     },
  //   }));

  //   return np;
  // };
  // const formattedData = fd?.map((item: any, groupIndex: number) => ({
  //   id: item.id,
  //   columnsFormat: [
  //     {
  //       value: item.name,
  //       td: item.name,
  //       props: {
  //         position: "sticky",
  //         left: 0,
  //         zIndex: 1,
  //         minW: "136px",
  //       },
  //       cProps: {
  //         borderRight: "1px solid var(--divider3)",
  //       },
  //     },
  //     ...permissionsColumn(item.permissions, groupIndex),
  //   ],
  // }));

  // SX

  // function handleCheckboxChange(index: number, key: string) {
  //   const updatedPermissions = [...formik.values.permissions];

  // }

  const permissionsLabel: any = {
    view: "View",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    export: "Export",
    import: "Import",
    verifikasi1: "Verif. 1",
    verifikasi2: "Verif. 2",
    publikasi: "Publikasi",
    publikasi_sertifikat: "Publikasi Sertifikat",
    bypass: "Bypass Unit Kerja",
  };

  // console.log("permission", fd);

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
        <CContainer
          overflowY={"auto"}
          border={"1px solid var(--divider3)"}
          borderRadius={12}
          className="scrollY"
        >
          <HStack
            borderBottom={"1px solid var(--divider3)"}
            position={"sticky"}
            top={0}
            bg={lightDarkColor}
            zIndex={3}
            gap={0}
          >
            <HStack
              w={"100%"}
              maxW={"240px"}
              borderRight={"1px solid var(--divider3)"}
              px={4}
              h={"48px"}
              py={2}
            >
              <Text
                fontWeight={500}
                opacity={0.4}
                // border={"1px solid red"}
              >
                Nama Modul
              </Text>
            </HStack>
            <HStack px={6} h={"48px"}>
              <Text fontWeight={500} opacity={0.4}>
                Permissions
              </Text>
            </HStack>
          </HStack>

          {fd.map((item: any, i: number) => {
            const excludes = ["Verifikasi Data"];

            return (
              !excludes?.includes(item?.name) && (
                <HStack
                  key={i}
                  w={"100%"}
                  borderBottom={
                    i !== fd.length - 1 ? "1px solid var(--divider3)" : ""
                  }
                  align={"stretch"}
                  gap={0}
                >
                  <HStack
                    w={"100%"}
                    maxW={"240px"}
                    borderRight={"1px solid var(--divider3)"}
                    // h={"48px"}
                    px={4}
                    py={2}
                  >
                    <Text
                      lineHeight={1.2}
                      // border={"1px solid red"}
                    >
                      {item.name}
                    </Text>
                  </HStack>

                  <HStack
                    // border={"1px solid red"}
                    flex={1}
                    overflowX={"auto"}
                    className="scrollX"
                    gap={12}
                    minH={"48px"}
                    h={"100%"}
                    my={"auto"}
                    px={6}
                    py={2}
                  >
                    {Object.keys(item.permissions).map(
                      (key: any, ii: number) => {
                        return (
                          item.permissions[key].id !== null && (
                            <Checkbox
                              key={ii}
                              size={"lg"}
                              colorScheme="ap"
                              onChange={() => {
                                handleCheckboxChange(i, key);
                              }}
                              isDisabled={role_id === 1}
                              isChecked={item.permissions[key]?.has_permission}
                            >
                              <Text
                                mt={"-1px"}
                                opacity={0.6}
                                whiteSpace={"nowrap"}
                              >
                                {permissionsLabel[key]}
                              </Text>
                            </Checkbox>
                          )
                        );
                      }
                    )}
                  </HStack>
                </HStack>
              )
            );
          })}
        </CContainer>

        // <CustomTableContainer>
        //   <CustomTable
        //     formattedHeader={formattedHeader}
        //     formattedData={formattedData}
        //     // rowOptions={rowOptions}
        //   />
        // </CustomTableContainer>
      )}
    </>
  );
}

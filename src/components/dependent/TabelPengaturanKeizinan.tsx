import { Checkbox, HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { Dispatch, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { responsiveSpacing } from "../../constant/sizes";
import CustomTableContainer from "../wrapper/CustomTableContainer";
import CustomTable from "./CustomTable";
import SearchComponent from "./input/SearchComponent";
import NotFound from "../independent/NotFound";

interface Props {
  data: any;
  simpanTrigger: boolean | null;
  toggleSemuaIzin: boolean;
  semuaIzin: boolean | null;
  setSemuaIzin: Dispatch<boolean>;
  setSimpanLoading: React.Dispatch<boolean>;
  checkAllPermissionsTrue: (permissionsArray: any) => boolean;
}

export default function TabelPengaturanKeizinan({
  data,
  simpanTrigger,
  toggleSemuaIzin,
  semuaIzin,
  setSemuaIzin,
  setSimpanLoading,
  checkAllPermissionsTrue,
}: Props) {
  // Filter Config
  const [filterConfig, setFilterConfig] = useState({
    search: "",
  });

  const fd = data.filter((item: any) => {
    const searchTerm = filterConfig.search.toLowerCase();

    const matchesSearchTerm = item.group.toLowerCase().includes(searchTerm);

    return matchesSearchTerm;
  });

  const [prevToggleSemuaIzin, setPrevToggleSemuaIzin] =
    useState<boolean>(false);

  useEffect(() => {
    setPrevToggleSemuaIzin(toggleSemuaIzin);
  }, [toggleSemuaIzin]);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: { permissions: data },
    validationSchema: yup
      .object()
      .shape({ permissions: yup.array().required("Harus diisi") }),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      setSimpanLoading(true);
    },
  });
  const formikRef = useRef(formik);

  useEffect(() => {
    formikRef.current = formik;
  }, [formik]);

  useEffect(() => {
    if (simpanTrigger !== null) {
      formikRef.current.handleSubmit();
    }
  }, [simpanTrigger]);

  const handleCheckboxChange = (index: number, key: string) => {
    const updatedPermissions = [...formik.values.permissions];
    updatedPermissions[index].permissions[key] =
      !updatedPermissions[index].permissions[key];
    formik.setFieldValue("permissions", updatedPermissions);

    // Check if all permissions are true after the update
    const allPermissionsTrue = checkAllPermissionsTrue(updatedPermissions);
    setSemuaIzin(allPermissionsTrue);
  };

  useEffect(() => {
    if (prevToggleSemuaIzin !== toggleSemuaIzin) {
      if (semuaIzin !== null) {
        const updatedPermissions = formikRef.current.values.permissions.map(
          (item: any) => {
            const updatedItem = { ...item };
            Object.keys(updatedItem.permissions).forEach((key) => {
              if (updatedItem.permissions[key] !== null) {
                updatedItem.permissions[key] = !semuaIzin;
              }
            });
            return updatedItem;
          }
        );

        formikRef.current.setFieldValue("permissions", updatedPermissions);
      }
    }
  }, [semuaIzin, toggleSemuaIzin, prevToggleSemuaIzin]);

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
    {
      th: "Reset",
      cProps: {
        justify: "center",
      },
    },
  ];
  const formattedData = fd.map((item: any, i: number) => ({
    id: item.id,
    columnsFormat: [
      {
        value: item.group,
        td: item.group,
      },
      {
        value: formik.values.permissions[i].permissions.view,
        td: (
          <Checkbox
            colorScheme="ap"
            size={"lg"}
            display={
              formik.values.permissions[i].permissions.view === null
                ? "none"
                : "block"
            }
            opacity={
              formik.values.permissions[i].permissions.view === null ? 0 : 1
            }
            isDisabled={formik.values.permissions[i].permissions.view === null}
            isChecked={formik.values.permissions[i].permissions.view}
            onChange={() => handleCheckboxChange(i, "view")}
          ></Checkbox>
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: formik.values.permissions[i].permissions.create,
        td: (
          <Checkbox
            colorScheme="ap"
            size={"lg"}
            display={
              formik.values.permissions[i].permissions.create === null
                ? "none"
                : "block"
            }
            opacity={
              formik.values.permissions[i].permissions.create === null ? 0 : 1
            }
            isDisabled={
              formik.values.permissions[i].permissions.create === null
            }
            isChecked={formik.values.permissions[i].permissions.create}
            onChange={() => handleCheckboxChange(i, "create")}
          ></Checkbox>
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: formik.values.permissions[i].permissions.edit,
        td: (
          <Checkbox
            colorScheme="ap"
            size={"lg"}
            display={
              formik.values.permissions[i].permissions.edit === null
                ? "none"
                : "block"
            }
            opacity={
              formik.values.permissions[i].permissions.edit === null ? 0 : 1
            }
            isDisabled={formik.values.permissions[i].permissions.edit === null}
            isChecked={formik.values.permissions[i].permissions.edit}
            onChange={() => handleCheckboxChange(i, "edit")}
          ></Checkbox>
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: formik.values.permissions[i].permissions.delete,
        td: (
          <Checkbox
            colorScheme="ap"
            size={"lg"}
            display={
              formik.values.permissions[i].permissions.delete === null
                ? "none"
                : "block"
            }
            opacity={
              formik.values.permissions[i].permissions.delete === null ? 0 : 1
            }
            isDisabled={
              formik.values.permissions[i].permissions.delete === null
            }
            isChecked={formik.values.permissions[i].permissions.delete}
            onChange={() => handleCheckboxChange(i, "delete")}
          ></Checkbox>
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: formik.values.permissions[i].permissions.export,
        td: (
          <Checkbox
            colorScheme="ap"
            size={"lg"}
            display={
              formik.values.permissions[i].permissions.export === null
                ? "none"
                : "block"
            }
            opacity={
              formik.values.permissions[i].permissions.export === null ? 0 : 1
            }
            isDisabled={
              formik.values.permissions[i].permissions.export === null
            }
            isChecked={formik.values.permissions[i].permissions.export}
            onChange={() => handleCheckboxChange(i, "export")}
          ></Checkbox>
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: formik.values.permissions[i].permissions.import,
        td: (
          <Checkbox
            colorScheme="ap"
            size={"lg"}
            display={
              formik.values.permissions[i].permissions.import === null
                ? "none"
                : "block"
            }
            opacity={
              formik.values.permissions[i].permissions.import === null ? 0 : 1
            }
            isDisabled={
              formik.values.permissions[i].permissions.import === null
            }
            isChecked={formik.values.permissions[i].permissions.import}
            onChange={() => handleCheckboxChange(i, "import")}
          ></Checkbox>
        ),
        cProps: {
          justify: "center",
        },
      },
      {
        value: formik.values.permissions[i].permissions.reset,
        td: (
          <Checkbox
            colorScheme="ap"
            size={"lg"}
            display={
              formik.values.permissions[i].permissions.reset === null
                ? "none"
                : "block"
            }
            opacity={
              formik.values.permissions[i].permissions.reset === null ? 0 : 1
            }
            isDisabled={formik.values.permissions[i].permissions.reset === null}
            isChecked={formik.values.permissions[i].permissions.reset}
            onChange={() => handleCheckboxChange(i, "reset")}
          ></Checkbox>
        ),
        cProps: {
          justify: "center",
        },
      },
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

      {fd.length === 0 && <NotFound />}

      {fd.length > 0 && (
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

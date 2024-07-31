import { Box, Button, Checkbox, HStack, Text, Wrap } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Retry from "../../components/dependent/Retry";
import TabelKeizinan from "../../components/dependent/TabelPengaturanKeizinan";
import NoData from "../../components/independent/NoData";
import Skeleton from "../../components/independent/Skeleton";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";

interface Props {
  role_id: number;
  role_name: string;
}

export default function PengaturanKeizinan({ role_id, role_name }: Props) {
  //! DEBUG
  const dummy = {
    User: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    "Data Karyawan": {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    Role: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    Permission: {
      view: null,
      create: true,
      edit: true,
      delete: true,
      import: null,
      export: null,
      reset: null,
    },
    "Unit Kerja": {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    Jabatan: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    Kompetensi: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    "Kelompok Gaji": {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    Premi: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    TER21: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    "Jadwal Penggajian": {
      view: null,
      create: true,
      edit: null,
      delete: null,
      import: null,
      export: null,
      reset: true,
    },
    THR: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: null,
      export: null,
      reset: null,
    },
    Shift: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    "Hari Libur": {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
    Cuti: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      import: true,
      export: true,
      reset: null,
    },
  };
  //! DEBUG

  const { error, loading, data, retry } = useDataState<any>({
    initialData: dummy,
    url: "",
    dependencies: [],
  });
  const [semuaIzin, setSemuaIzin] = useState<boolean>(false);
  const [toggleSemuaIzin, setToggleSemuaIzin] = useState<boolean>(false);
  const [simpanLoading, setSimpanLoading] = useState<boolean>(false);
  const [simpanTrigger, setSimpanTrigger] = useState<boolean | null>(null);

  const dataToArray = Object.keys(data).map((key) => ({
    group: key,
    permissions: data[key],
  }));
  const dataToArrayRef = useRef(dataToArray);

  const checkAllPermissionsTrue = (permissionsArray: any): boolean => {
    return permissionsArray.every((item: any) => {
      return Object.values(item.permissions).every(
        (permission) => permission === null || permission === true
      );
    });
  };

  useEffect(() => {
    //TODO get permission by rolew id

    if (checkAllPermissionsTrue(dataToArrayRef.current)) {
      setSemuaIzin(true);
    }
  }, [role_id]);

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <CContainer
      flex={1}
      pt={0}
      px={responsiveSpacing}
      bg={lightDarkColor}
      borderRadius={12}
      overflowY={"auto"}
      className="scrollY"
    >
      <Wrap justify={"space-between"} mb={responsiveSpacing}>
        <HStack gap={8}>
          <HStack>
            <Text>Role :</Text>
            <Text fontWeight={600}>{role_name}</Text>
          </HStack>

          <HStack
            onClick={() => {
              setToggleSemuaIzin(!toggleSemuaIzin);
            }}
          >
            <Checkbox
              colorScheme="ap"
              onChange={() => {
                setSemuaIzin(!semuaIzin);
              }} // Mengubah nilai toggleSemuaIzin
              onClick={(e) => e.stopPropagation()} // Menghentikan propagasi event agar tidak memicu perubahan checkbox
              isChecked={semuaIzin} // Menggunakan toggleSemuaIzin sebagai nilai isChecked
            >
              <Text fontWeight={500} mt={"-3px"}>
                Semua izin
              </Text>
            </Checkbox>
          </HStack>
        </HStack>

        <Button
          colorScheme="ap"
          className="btn-ap clicky"
          minW={"120px"}
          isLoading={simpanLoading}
          onClick={() => {
            setSimpanTrigger(!simpanTrigger);
          }}
        >
          Simpan
        </Button>
      </Wrap>

      {error && (
        <Box my={"auto"}>
          <Retry loading={loading} retry={retry} />
        </Box>
      )}
      {!error && (
        <>
          {loading && (
            <>
              <HStack mb={responsiveSpacing}>
                <Skeleton h={"40px"} mx={"auto"} />
                <Skeleton h={"40px"} mx={"auto"} />
                <Skeleton h={"40px"} mx={"auto"} ml={"auto"} />
              </HStack>
              <Skeleton h={"40px"} mx={"auto"} mb={responsiveSpacing} />
              <Skeleton minH={"300px"} flex={1} mx={"auto"} />
            </>
          )}
          {!loading && (
            <>
              {(!data || (data && data.length === 0)) && <NoData />}
              {(data || (data && data.length > 0)) && (
                <>
                  <TabelKeizinan
                    data={dataToArray}
                    toggleSemuaIzin={toggleSemuaIzin}
                    semuaIzin={semuaIzin}
                    setSemuaIzin={setSemuaIzin}
                    simpanTrigger={simpanTrigger}
                    setSimpanLoading={setSimpanLoading}
                    checkAllPermissionsTrue={checkAllPermissionsTrue}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </CContainer>
  );
}

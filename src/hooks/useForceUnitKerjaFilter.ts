import { useEffect } from "react";

interface UseForceUnitKerjaFilterParams {
  userRef: React.RefObject<{ data_karyawan?: any }>;
  filterKaryawan: any;
  setFilterKaryawan: (value: any) => void;
  formattedFilterKaryawanRef: React.MutableRefObject<any>;
  setFormattedFilterKaryawan: (value: any) => void;
}

export function useForceUnitKerjaFilter({
  userRef,
  filterKaryawan,
  setFilterKaryawan,
  formattedFilterKaryawanRef,
  setFormattedFilterKaryawan,
}: UseForceUnitKerjaFilterParams) {
  useEffect(() => {
    if (userRef.current) {
      const unitKerjaUser = userRef.current?.data_karyawan?.unit_kerja;

      if (unitKerjaUser) {
        const unitKerjaExists = filterKaryawan.unit_kerja.some(
          (uk: any) => uk.id === unitKerjaUser.id
        );

        if (!unitKerjaExists) {
          setFilterKaryawan({
            ...filterKaryawan,
            unit_kerja: [
              ...filterKaryawan.unit_kerja,
              {
                id: unitKerjaUser.id,
                label: unitKerjaUser.nama_unit,
              },
            ],
          });
        }

        const formattedUnitKerjaExists =
          formattedFilterKaryawanRef.current?.unit_kerja?.includes(
            unitKerjaUser.id
          );

        if (!formattedUnitKerjaExists) {
          setFormattedFilterKaryawan({
            ...formattedFilterKaryawanRef.current,
            unit_kerja: [
              ...(formattedFilterKaryawanRef.current?.unit_kerja || []),
              unitKerjaUser.id,
            ],
          });
        }
      }
    }
  }, [
    userRef,
    filterKaryawan,
    setFilterKaryawan,
    formattedFilterKaryawanRef,
    setFormattedFilterKaryawan,
  ]);
}

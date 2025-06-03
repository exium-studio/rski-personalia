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
      const pjUnitKerja = userRef.current?.data_karyawan?.pj_unit_kerja; // array

      // console.log(
      //   "pjUnitKerja",
      //   pjUnitKerja?.map((item: any) => ({
      //     id: item.id,
      //     label: item.nama_unit,
      //   }))
      // );

      if (pjUnitKerja && pjUnitKerja.length > 0) {
        // const filterUnitKerjaExist = pjUnitKerja.every((item: any) =>
        //   filterKaryawan.unit_kerja.some((data: any) => data.id === item.id)
        // );
        // if (!filterUnitKerjaExist) {
        //   setFilterKaryawan({
        //     ...filterKaryawan,
        //     unit_kerja: [
        //       ...filterKaryawan.unit_kerja,
        //       ...pjUnitKerja?.map((item: any) => ({
        //         id: item.id,
        //         label: item.nama_unit,
        //       })),
        //     ],
        //   });
        // }

        // setFilterKaryawan({
        //   ...filterKaryawanRef.current,
        //   unit_kerja: [
        //     ...filterKaryawan.unit_kerja,
        //     ...pjUnitKerja?.map((item: any) => ({
        //       id: item.id,
        //       label: item.nama_unit,
        //     })),
        //   ],
        // });

        setFormattedFilterKaryawan({
          ...formattedFilterKaryawanRef.current,
          unit_kerja: [
            ...(formattedFilterKaryawanRef.current?.unit_kerja || []),
            ...pjUnitKerja?.map((item: any) => item.id),
          ],
        });

        // const formattedUnitKerjaExists =
        //   formattedFilterKaryawanRef.current?.unit_kerja?.includes(
        //     pjUnitKerja.id
        //   );

        // if (!formattedUnitKerjaExists) {
        //   setFormattedFilterKaryawan({
        //     ...formattedFilterKaryawanRef.current,
        //     unit_kerja: [
        //       ...(formattedFilterKaryawanRef.current?.unit_kerja || []),
        //       pjUnitKerja.id,
        //     ],
        //   });
        // }
      }
    }
  }, [
    userRef,
    // filterKaryawan,
    setFilterKaryawan,
    formattedFilterKaryawanRef,
    setFormattedFilterKaryawan,
  ]);
}

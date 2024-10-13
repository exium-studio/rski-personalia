import { create } from "zustand";

const defaultFilterConfig = {
  search: "",
  unit_kerja: [],
  jenis_karyawan: [],
  jenis_kompetensi: [],
  jabatan: [],
  status_karyawan: [],
  masa_kerja: [],
  status_aktif: [],
  tgl_masuk: [],
  agama: [],
  jenis_kelamin: [],
  pendidikan_terakhir: [],
};

type State = {
  defaultFilterKaryawan: any;
  filterKaryawan: any;
  formattedFilterKaryawan: any;
};

type Actions = {
  setFilterKaryawan: (filterKaryawan: Partial<State["filterKaryawan"]>) => void;
  setFormattedFilterKaryawan: (
    filterKaryawan: Partial<State["formattedFilterKaryawan"]>
  ) => void;
  clearFormattedFilterKaryawan: () => void;
};

const useFilterKaryawan = create<State & Actions>((set) => ({
  defaultFilterKaryawan: defaultFilterConfig,
  filterKaryawan: defaultFilterConfig,
  formattedFilterKaryawan: undefined,
  setFilterKaryawan: (newFilter) =>
    set((state) => ({
      filterKaryawan: {
        ...state.filterKaryawan,
        ...newFilter,
      },
    })),
  setFormattedFilterKaryawan: (newFilter) =>
    set((state) => ({
      formattedFilterKaryawan: {
        ...state.formattedFilterKaryawan,
        ...newFilter,
      },
    })),
  clearFormattedFilterKaryawan: () =>
    set(() => ({
      formattedFilterKaryawan: undefined,
    })),
}));

export default useFilterKaryawan;

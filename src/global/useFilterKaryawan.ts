import { create } from "zustand";

const defaultFilterConfig = {
  search: "",
  unit_kerja: [],
  status_karyawan: [],
  masa_kerja: [],
  status_aktif: [],
  tgl_masuk: [],
  agama: [],
};

type State = {
  defaultFilterKaryawan: typeof defaultFilterConfig;
  filterKaryawan: typeof defaultFilterConfig;
  formattedFilterKaryawan: any;
};

type Actions = {
  setFilterKaryawan: (filterKaryawan: Partial<State["filterKaryawan"]>) => void;
  setFormattedFilterKaryawan: (
    filterKaryawan: Partial<State["filterKaryawan"]>
  ) => void;
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
}));

export default useFilterKaryawan;

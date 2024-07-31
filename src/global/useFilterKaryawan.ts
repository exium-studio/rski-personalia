import { create } from "zustand";

const defaultFilterConfig = {
  search: "",
  unit_kerja: [],
  status_karyawan: [],
  masa_kerja: [],
  status_aktif: [],
  tgl_masuk: [],
};

type State = {
  defaultFilterKaryawan: typeof defaultFilterConfig;
  filterKaryawan: typeof defaultFilterConfig;
};

type Actions = {
  setFilterKaryawan: (filterKaryawan: Partial<State["filterKaryawan"]>) => void;
};

const useFilterKaryawan = create<State & Actions>((set) => ({
  defaultFilterKaryawan: defaultFilterConfig,
  filterKaryawan: defaultFilterConfig,
  setFilterKaryawan: (newFilter) =>
    set((state) => ({
      filterKaryawan: {
        ...state.filterKaryawan,
        ...newFilter,
      },
    })),
}));

export default useFilterKaryawan;

import { create } from "zustand";

interface State {
  clearedTableColumns: number[];
  columnsConfigAllColumns: number[];
  columnsConfig: number[];
}

interface Actions {
  setColumnsConfig: (newState: number[]) => void;
}

const columnsConfigAllColumns = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
];

const useKaryawanTableColumnsConfig = create<State & Actions>((set) => ({
  clearedTableColumns: [0],
  columnsConfigAllColumns: columnsConfigAllColumns,
  columnsConfig: columnsConfigAllColumns,
  setColumnsConfig: (newState: number[]) => set({ columnsConfig: newState }),
}));

export default useKaryawanTableColumnsConfig;

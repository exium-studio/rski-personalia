import { create } from "zustand";

interface State {
  debugNoDataState: boolean;
}

interface Actions {
  setDebugNoDataState: (newState: boolean) => void;
}

const useDebugNoDataState = create<State & Actions>((set) => ({
  debugNoDataState: false,
  setDebugNoDataState: (newState: boolean) =>
    set({ debugNoDataState: newState }),
}));

export default useDebugNoDataState;

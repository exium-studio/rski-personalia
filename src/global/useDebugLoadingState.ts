import { create } from "zustand";

interface State {
  debugLoadingState: boolean;
}

interface Actions {
  setDebugLoadingState: (newState: boolean) => void;
}

const useDebugLoadingState = create<State & Actions>((set) => ({
  debugLoadingState: false,
  setDebugLoadingState: (newState: boolean) =>
    set({ debugLoadingState: newState }),
}));

export default useDebugLoadingState;

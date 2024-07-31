import { create } from "zustand";

interface State {
  debugErrorState: boolean;
}

interface Actions {
  setDebugErrorState: (newState: boolean) => void;
}

const useDebugErrorState = create<State & Actions>((set) => ({
  debugErrorState: false,
  setDebugErrorState: (newState: boolean) => set({ debugErrorState: newState }),
}));

export default useDebugErrorState;

import { create } from "zustand";

interface State {
  locationPermission: boolean | null;
}

interface Actions {
  setLocationPermission: (newState: State["locationPermission"]) => void;
}

const useLocationPermission = create<State & Actions>((set) => ({
  locationPermission: null,
  setLocationPermission: (newState) => set({ locationPermission: newState }),
}));

export default useLocationPermission;

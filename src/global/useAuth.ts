import { create } from "zustand";

interface State {
  statusAktif: number | undefined;
  userPermissions: number[] | undefined;
}

interface Actions {
  setStatusAktif: (newState: State["statusAktif"]) => void;
  setUserPermissions: (newState: State["userPermissions"]) => void;
}

const useAuth = create<State & Actions>((set) => ({
  statusAktif: 0,
  setStatusAktif: (newState) => set({ statusAktif: newState }),

  userPermissions: undefined,
  setUserPermissions: (newState) => set({ userPermissions: newState }),
}));

export default useAuth;

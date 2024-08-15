import { create } from "zustand";

type State = {
  bodyRef: any;
};

type Actions = {
  setBodyRef: (bodyRef: any) => void;
};

const useBodyRef = create<State & Actions>((set) => ({
  bodyRef: null,
  setBodyRef: (newBodyRef) => set(() => ({ bodyRef: newBodyRef })),
}));

export default useBodyRef;

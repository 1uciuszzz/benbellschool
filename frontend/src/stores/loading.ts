import { create } from "zustand";

interface LoadingState {
  active: boolean;
  activate: (status: boolean) => void;
}

export const useLoading = create<LoadingState>()((set) => {
  return {
    active: false,
    activate: (status: boolean) => set({ active: status }),
  };
});

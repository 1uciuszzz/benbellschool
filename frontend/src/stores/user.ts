import { create } from "zustand";

interface UserState {
  id: string;
  name: string;

  setId: (id: string) => void;
  setName: (username: string) => void;
}

export const useUser = create<UserState>()((set) => {
  return {
    id: "",
    name: "",
    permissions: [],
    setId: (id: string) => set((state) => ({ ...state, id })),
    setName: (username: string) =>
      set((state) => ({ ...state, name: username })),
  };
});

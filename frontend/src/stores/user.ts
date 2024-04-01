import { create } from "zustand";
import { Permission } from "../types/permission.enum";

interface UserState {
  id: string;
  username: string;
  permissions: Permission[];

  setId: (id: string) => void;
  setUsername: (username: string) => void;
  setPermissions: (permissions: Permission[]) => void;
}

export const useUser = create<UserState>()((set) => {
  return {
    id: "",
    username: "",
    permissions: [],
    setId: (id: string) => set((state) => ({ ...state, id })),
    setUsername: (username: string) => set((state) => ({ ...state, username })),
    setPermissions: (permissions: Permission[]) =>
      set((state) => ({ ...state, permissions })),
  };
});

import { create } from 'zustand';

interface VersionStore {
  frontend_version: string;
  set_frontend_version: (version: string) => void;
}

export const useVersionStore = create<VersionStore>()((set) => ({
  frontend_version: '',
  set_frontend_version: (version) => set({ frontend_version: version }),
}));

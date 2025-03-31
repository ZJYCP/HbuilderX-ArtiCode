import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SystemInfo {
  // 主题
  theme: 'light' | 'dark' | 'monokai';
}
interface ISystemStore {
  systemInfo: SystemInfo;
  updateSystemInfo: (systemInfo: Partial<SystemInfo>) => void;
  setSystemInfo: (systemInfo: SystemInfo) => void;
  // 模型ID
  providerId: string;
  setProviderId: (providerId: string) => void;
}

const useSystemStore = create<ISystemStore>()(
  persist(
    (set) => ({
      systemInfo: {
        theme: 'light',
      },
      updateSystemInfo: (systemInfo) =>
        set((state) => ({
          systemInfo: { ...state.systemInfo, ...systemInfo },
        })),
      setSystemInfo: (systemInfo) => set(() => ({ systemInfo })),
      // 默认模型ID
      providerId: '3408b128-d64d-4725-93f7-27a21a69eb00',
      setProviderId: (providerId) => set(() => ({ providerId })),
    }),
    {
      name: 'system-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useSystemStore;

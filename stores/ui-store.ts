import { create } from "zustand";

type BottomPanelTab = "timeline" | "logs" | "events";

interface UiStore {
  bottomPanelTab: BottomPanelTab;
  sidebarCollapsed: boolean;
  inspectorOpen: boolean;
  setBottomPanelTab: (tab: BottomPanelTab) => void;
  toggleSidebar: () => void;
  setInspectorOpen: (open: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  bottomPanelTab: "timeline",
  sidebarCollapsed: false,
  inspectorOpen: true,
  setBottomPanelTab: (bottomPanelTab) => set({ bottomPanelTab }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }),
}));

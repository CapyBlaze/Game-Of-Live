import { create } from "zustand";

interface DashboardState {
    playing: boolean;
    reset: number;
    random: number;
    zoom: number;

    targetFps: number;
    fadeLevels: number;
    currentGeneration: number;
    numberOfLivingCells: number;

    showGrid: boolean;
    mode: "Moore" | "Neumann";

    actions: {
        setPlaying: (enabled: boolean) => void;
        setReset: () => void;
        setRandom: () => void;
        setZoom: (zoom: number) => void;

        setTargetFps: (fps: number) => void;
        setFadeLevels: (levels: number) => void;
        setCurrentGeneration: (generation: number) => void;
        setNumberOfLivingCells: (count: number) => void;

        setShowGrid: (enabled: boolean) => void;
        setMode: (mode: "Moore" | "Neumann") => void;
    };
}

export const useDashboardStore = create<DashboardState>()((set) => ({
    playing: true,
    reset: 0,
    random: 0,
    zoom: 1,

    targetFps: 15,
    fadeLevels: 16,
    currentGeneration: 0,
    numberOfLivingCells: 0,

    showGrid: false,
    mode: "Moore",

    actions: {
        setPlaying: (enabled: boolean) => set({ playing: enabled }),
        setReset: () => set({ reset: 0 }),
        setRandom: () => set({ random: 0 }),
        setZoom: (zoom: number) => set({ zoom: zoom }),

        setTargetFps: (fps: number) => set({ targetFps: fps }),
        setFadeLevels: (levels: number) => set({ fadeLevels: levels }),
        setCurrentGeneration: (generation: number) =>
            set({ currentGeneration: generation }),
        setNumberOfLivingCells: (count: number) =>
            set({ numberOfLivingCells: count }),

        setShowGrid: (enabled: boolean) => set({ showGrid: enabled }),
        setMode: (mode: "Moore" | "Neumann") => set({ mode: mode }),
    },
}));

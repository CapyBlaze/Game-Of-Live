import { create } from "zustand";

interface DashboardState {
    playing: boolean;
    cellSize: number;

    targetFps: number;
    fadeLevels: number;
    currentGeneration: number;
    numberOfLivingCells: number;

    showGrid: boolean;
    mode: "Moore" | "Neumann";
    background: string;
    gridColor: string;

    actions: {
        setPlaying: (enabled: boolean) => void;
        setCellSize: (cellSize: number) => void;
        incrementCellSize: () => void;
        decrementCellSize: () => void;

        setTargetFps: (fps: number) => void;
        setFadeLevels: (levels: number) => void;
        setCurrentGeneration: (generation: number) => void;
        setNumberOfLivingCells: (count: number) => void;

        setShowGrid: (enabled: boolean) => void;
        setMode: (mode: "Moore" | "Neumann") => void;
        setBackground: (background: string) => void;
        setGridColor: (color: string) => void;
    };

    resetGameInstance: () => void;
    setResetGameInstance: (fn: () => void) => void;

    randomizeGameInstance: () => void;
    setRandomizeGameInstance: (fn: () => void) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
    playing: true,
    cellSize: 5,

    targetFps: 15,
    fadeLevels: 16,
    currentGeneration: 0,
    numberOfLivingCells: 0,

    showGrid: false,
    mode: "Moore",
    background: "linear-gradient(135deg, #ff0099, #493240)",
    gridColor: "28, 27, 26",

    actions: {
        setPlaying: (enabled: boolean) => set({ playing: enabled }),
        setCellSize: (cellSize: number) => set({ cellSize: cellSize }),
        incrementCellSize: () => set((state) => ({ cellSize: Math.min(10, state.cellSize + 1) })),
        decrementCellSize: () => set((state) => ({ cellSize: Math.max(3, state.cellSize - 1) })),

        setTargetFps: (fps: number) => set({ targetFps: fps }),
        setFadeLevels: (levels: number) => set({ fadeLevels: levels }),
        setCurrentGeneration: (generation: number) => set({ currentGeneration: generation }),
        setNumberOfLivingCells: (count: number) => set({ numberOfLivingCells: count }),

        setShowGrid: (enabled: boolean) => set({ showGrid: enabled }),
        setMode: (mode: "Moore" | "Neumann") => set({ mode: mode }),
        setBackground: (background: string) => set({ background: background }),
        setGridColor: (color: string) => set({ gridColor: color }),
    },

    resetGameInstance: () => {},
    setResetGameInstance: (fn: () => void) => set({ resetGameInstance: fn }),

    randomizeGameInstance: () => {},
    setRandomizeGameInstance: (fn: () => void) => set({ randomizeGameInstance: fn }),
}));

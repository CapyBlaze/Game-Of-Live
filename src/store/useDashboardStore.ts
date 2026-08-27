import { create } from "zustand";
import CONFIG from "../config/defaultConfig";

export type GameMode = "Moore" | "Neumann" | "Toric World";

interface DashboardState {
    playing: boolean;
    cellSize: number;

    targetFps: number;
    fadeLevels: number;
    currentGeneration: number;
    numberOfLivingCells: number;

    showGrid: boolean;
    mode: GameMode;
    background: string;
    gridColor: string;

    actions: {
        setPlaying: (enabled: boolean) => void;
        setCellSize: (cellSize: number) => void;
        incrementCellSize: () => void;
        decrementCellSize: () => void;
        resetCellSize: () => void;

        setTargetFps: (fps: number) => void;
        setFadeLevels: (levels: number) => void;
        setCurrentGeneration: (generation: number) => void;
        setNumberOfLivingCells: (count: number) => void;

        setShowGrid: (enabled: boolean) => void;
        setMode: (mode: GameMode) => void;
        setBackground: (background: string) => void;
        setGridColor: (color: string) => void;
    };

    resetGameInstance: () => void;
    setResetGameInstance: (fn: () => void) => void;

    randomizeGameInstance: () => void;
    setRandomizeGameInstance: (fn: () => void) => void;

    exportImage: () => void | Promise<void>;
    setExportImage: (fn: () => void | Promise<void>) => void;

    exportGif: () => void | Promise<void>;
    setExportGif: (fn: () => void | Promise<void>) => void;

    resetData: () => void;
    setResetData: (fn: () => void) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
    playing: CONFIG.defaultPlaying,
    cellSize: CONFIG.defaultCellSize,

    targetFps: CONFIG.defaultTargetFps,
    fadeLevels: CONFIG.defaultFadeLevels,
    currentGeneration: CONFIG.defaultCurrentGeneration,
    numberOfLivingCells: CONFIG.defaultNumberOfLivingCells,

    showGrid: CONFIG.defaultShowGrid,
    mode: CONFIG.defaultMode as GameMode,
    background: CONFIG.defaultCellGradient,
    gridColor: CONFIG.defaultGridColor,

    actions: {
        setPlaying: (enabled: boolean) => set({ playing: enabled }),
        setCellSize: (cellSize: number) => set({ cellSize: cellSize }),
        incrementCellSize: () =>
            set((state) => ({ cellSize: Math.min(CONFIG.zoomMax, state.cellSize + 1) })),
        decrementCellSize: () =>
            set((state) => ({ cellSize: Math.max(CONFIG.zoomMin, state.cellSize - 1) })),
        resetCellSize: () => set({ cellSize: CONFIG.defaultCellSize }),

        setTargetFps: (fps: number) => set({ targetFps: fps }),
        setFadeLevels: (levels: number) => set({ fadeLevels: levels }),
        setCurrentGeneration: (generation: number) => set({ currentGeneration: generation }),
        setNumberOfLivingCells: (count: number) => set({ numberOfLivingCells: count }),

        setShowGrid: (enabled: boolean) => set({ showGrid: enabled }),
        setMode: (mode: GameMode) => set({ mode: mode }),
        setBackground: (background: string) => set({ background: background }),
        setGridColor: (color: string) => set({ gridColor: color }),
    },

    resetGameInstance: () => {},
    setResetGameInstance: (fn: () => void) => set({ resetGameInstance: fn }),

    randomizeGameInstance: () => {},
    setRandomizeGameInstance: (fn: () => void) => set({ randomizeGameInstance: fn }),

    exportImage: () => {},
    setExportImage: (fn: () => void | Promise<void>) => set({ exportImage: fn }),

    exportGif: () => {},
    setExportGif: (fn: () => void | Promise<void>) => set({ exportGif: fn }),

    resetData: () => {},
    setResetData: (fn: () => void) => set({ resetData: fn }),
}));

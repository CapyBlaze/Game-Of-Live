import { useEffect, useRef } from "react";
import { GameOfLife } from "../Core/gameOfLife";
import { useDashboardStore } from "../store/useDashboardStore";
import { exportCanvasGif, exportCanvasImage } from "../utils/exportCanvas";
import { drawEngineFrame } from "../utils/drawEngine";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GameOfLife | null>(null);

    const targetFps = useDashboardStore((state) => state.targetFps);
    const fadeLevels = useDashboardStore((state) => state.fadeLevels);
    const playing = useDashboardStore((state) => state.playing);
    const background = useDashboardStore((state) => state.background);
    const gridColor = useDashboardStore((state) => state.gridColor);
    const cellSize = useDashboardStore((state) => state.cellSize);
    const showGrid = useDashboardStore((state) => state.showGrid);

    const fpsRef = useRef<number>(targetFps);
    const fadeLevelsRef = useRef<number>(fadeLevels);
    const playingRef = useRef<boolean>(playing);
    const backgroundRef = useRef<string>(background);
    const gridColorRef = useRef<string>(gridColor);
    const cellSizeRef = useRef<number>(cellSize);
    const showGridRef = useRef<boolean>(showGrid);

    useEffect(() => {
        fpsRef.current = targetFps;
    }, [targetFps]);

    useEffect(() => {
        playingRef.current = playing;
    }, [playing]);

    useEffect(() => {
        fadeLevelsRef.current = fadeLevels;
    }, [fadeLevels]);

    useEffect(() => {
        backgroundRef.current = background;
    }, [background]);

    useEffect(() => {
        gridColorRef.current = gridColor;
    }, [gridColor]);

    useEffect(() => {
        cellSizeRef.current = cellSize;
    }, [cellSize]);

    useEffect(() => {
        showGridRef.current = showGrid;
    }, [showGrid]);

    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.updateCellSize(cellSize);
        }
    }, [cellSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const engine = new GameOfLife(width, height, cellSizeRef.current);
        engineRef.current = engine;

        useDashboardStore.getState().setResetGameInstance(() => {
            engineRef.current?.clear();

            const ctx = canvas.getContext("2d");
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        });

        useDashboardStore.getState().setRandomizeGameInstance(() => {
            engineRef.current?.randomize();

            const ctx = canvas.getContext("2d");
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        });

        useDashboardStore.getState().setExportImage(async () => {
            if (!canvasRef.current) return;
            await exportCanvasImage(canvasRef.current, backgroundRef.current);
        });

        useDashboardStore.getState().setExportGif(async () => {
            if (!engineRef.current) return;

            await exportCanvasGif(
                engineRef.current,
                backgroundRef.current,
                gridColorRef.current,
                fadeLevelsRef.current,
                showGridRef.current,
                40, // 40 images
                80, // 80ms par frame (environ 12 FPS)
            );
        });

        useDashboardStore.getState().setResetData(() => {
            engineRef.current?.clear();
            engineRef.current = new GameOfLife(width, height, cellSizeRef.current);
            const ctx = canvas.getContext("2d");
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        });
    }, []);

    useEffect(() => {
        const handleAction = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && target.closest(".dashboard-container")) {
                return;
            }

            if (e.buttons === 1) {
                engineRef.current?.click(e.clientX, e.clientY);
            }
        };

        window.addEventListener("mousedown", handleAction);
        window.addEventListener("mousemove", handleAction);

        return () => {
            window.removeEventListener("mousedown", handleAction);
            window.removeEventListener("mousemove", handleAction);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let lastLogicTime = performance.now();

        const render = (currentTime: number) => {
            const engine = engineRef.current;
            if (!engine) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            const deltaLogic = currentTime - lastLogicTime;
            const intervalLogic = 1000 / fpsRef.current;

            if (deltaLogic >= intervalLogic) {
                if (playingRef.current) {
                    engine.computeNextGeneration();
                }
                lastLogicTime = currentTime - (deltaLogic % intervalLogic);
            }

            const currentFadeLevels = fadeLevelsRef.current;
            const currentGridColor = gridColorRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawEngineFrame(ctx, engine, currentGridColor, currentFadeLevels, showGridRef.current);

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <>
            <div
                id="canvas-container"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: !background.includes("raimbow-animation") ? background : "#5461c8",
                    animation: background.includes("raimbow-animation")
                        ? "raimbow-animation 10s linear infinite"
                        : "none",
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>
        </>
    );
}

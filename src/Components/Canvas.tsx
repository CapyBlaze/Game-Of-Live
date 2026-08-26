import { useEffect, useRef } from "react";
import { GameOfLife } from "../Core/gameOfLife";
import { useDashboardStore } from "../store/useDashboardStore";
import CONFIG from "../config/defaultConfig";

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
            engine.clear();

            const ctx = canvas.getContext("2d");
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        });

        useDashboardStore.getState().setRandomizeGameInstance(() => {
            engine.randomize();

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
            const currentCellSize = engine.cellSize;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const buckets: number[][] = Array.from({ length: currentFadeLevels + 1 }, () => []);

            for (let x = 0; x < engine.cols; x++) {
                for (let y = 0; y < engine.rows; y++) {
                    const idx = x * engine.rows + y;
                    const overlayAlpha = 1 - engine.energy[idx];
                    if (overlayAlpha <= 0) continue;

                    const level = Math.round(overlayAlpha * currentFadeLevels);
                    buckets[level].push(x, y);
                }
            }

            for (let level = 1; level <= currentFadeLevels; level++) {
                const coords = buckets[level];
                if (coords.length === 0) continue;

                const alpha = level / currentFadeLevels;
                ctx.fillStyle = `rgba(${currentGridColor}, ${alpha})`;
                ctx.beginPath();

                for (let i = 0; i < coords.length; i += 2) {
                    const x = coords[i] * currentCellSize;
                    const y = coords[i + 1] * currentCellSize;

                    ctx.rect(x, y, currentCellSize, currentCellSize);
                }
                ctx.fill();
            }

            if (showGridRef.current) {
                ctx.strokeStyle = CONFIG.gridLineColor;
                ctx.lineWidth = CONFIG.gridLineWidth * 2;
                ctx.beginPath();

                for (let x = 0; x <= canvas.width; x += currentCellSize) {
                    ctx.moveTo(x + CONFIG.gridLineWidth, 0);
                    ctx.lineTo(x + CONFIG.gridLineWidth, canvas.height);
                }
                for (let y = 0; y <= canvas.height; y += currentCellSize) {
                    ctx.moveTo(0, y + CONFIG.gridLineWidth);
                    ctx.lineTo(canvas.width, y + CONFIG.gridLineWidth);
                }

                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: background,
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

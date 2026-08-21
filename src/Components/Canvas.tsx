import { useEffect, useRef } from "react";
import { GameOfLife } from "../Core/gameOfLife";
import { useDashboardStore } from "../store/useDashboardStore";

const CELL_SIZE = 5;

const GRID_RGB = "236, 225, 248";
// const BACKGROUND = "linear-gradient(135deg, #4159d0, #c84fc0, #ffcd70)";
// const BACKGROUND = "linear-gradient(135deg, #ff0099, #493240)";
// const BACKGROUND = "linear-gradient(135deg, #ec2f4b, #009fff)";
// const BACKGROUND = "linear-gradient(135deg, #654ea3, #eaafc8)";
const BACKGROUND = "linear-gradient(40deg, #8a2387, #e94057, #f27121)";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GameOfLife | null>(null);

    const targetFps = useDashboardStore((state) => state.targetFps);
    const fadeLevels = useDashboardStore((state) => state.fadeLevels);
    const playing = useDashboardStore((state) => state.playing);

    const fpsRef = useRef<number>(targetFps);
    const fadeLevelsRef = useRef<number>(fadeLevels);
    const playingRef = useRef<boolean>(playing);

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
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        engineRef.current = new GameOfLife(width, height, CELL_SIZE);
    }, []);

    useEffect(() => {
        const handleAction = (e: MouseEvent) => {
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
        let lastTime = performance.now();

        const render = (currentTime: number) => {
            const engine = engineRef.current;
            if (!engine) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            const delta = currentTime - lastTime;
            const interval = 1000 / fpsRef.current;
            const currentFadeLevels = fadeLevelsRef.current;

            if (playingRef.current && delta >= interval) {
                engine.computeNextGeneration();
                lastTime = currentTime - (delta % interval);

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
                    ctx.fillStyle = `rgba(${GRID_RGB}, ${alpha})`;
                    ctx.beginPath();
                    for (let i = 0; i < coords.length; i += 2) {
                        ctx.rect(
                            coords[i] * CELL_SIZE,
                            coords[i + 1] * CELL_SIZE,
                            CELL_SIZE,
                            CELL_SIZE,
                        );
                    }
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: BACKGROUND,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                }}
            />
        </>
    );
}

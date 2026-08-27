import type { GameOfLife } from "../Core/gameOfLife";
import CONFIG from "../config/defaultConfig";

export function drawEngineFrame(
    ctx: CanvasRenderingContext2D,
    engine: GameOfLife,
    gridColor: string,
    fadeLevels: number,
    showGrid: boolean,
) {
    const width = engine.cols * engine.cellSize;
    const height = engine.rows * engine.cellSize;

    const buckets: number[][] = Array.from({ length: fadeLevels + 1 }, () => []);

    for (let x = 0; x < engine.cols; x++) {
        for (let y = 0; y < engine.rows; y++) {
            const idx = x * engine.rows + y;
            const overlayAlpha = 1 - engine.energy[idx];
            if (overlayAlpha <= 0) continue;

            const level = Math.round(overlayAlpha * fadeLevels);
            buckets[level].push(x, y);
        }
    }

    for (let level = 1; level <= fadeLevels; level++) {
        const coords = buckets[level];
        if (coords.length === 0) continue;

        const alpha = level / fadeLevels;
        ctx.fillStyle = `rgba(${gridColor}, ${alpha})`;
        ctx.beginPath();

        for (let i = 0; i < coords.length; i += 2) {
            const x = coords[i] * engine.cellSize;
            const y = coords[i + 1] * engine.cellSize;
            ctx.rect(x, y, engine.cellSize, engine.cellSize);
        }
        ctx.fill();
    }

    if (showGrid) {
        ctx.strokeStyle = CONFIG.gridLineColor;
        ctx.lineWidth = CONFIG.gridLineWidth * 2;
        ctx.beginPath();

        for (let x = 0; x <= width; x += engine.cellSize) {
            ctx.moveTo(x + CONFIG.gridLineWidth, 0);
            ctx.lineTo(x + CONFIG.gridLineWidth, height);
        }
        for (let y = 0; y <= height; y += engine.cellSize) {
            ctx.moveTo(0, y + CONFIG.gridLineWidth);
            ctx.lineTo(width, y + CONFIG.gridLineWidth);
        }
        ctx.stroke();
    }
}

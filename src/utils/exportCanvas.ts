import GIF from "gif.js";
import { drawEngineFrame } from "./drawEngine";
import type { GameOfLife } from "../Core/gameOfLife";

function applyBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bgValue: string,
) {
    if (bgValue === "raimbow-animation") {
        const sourceElement = document.getElementById("canvas-container") || ctx.canvas;
        ctx.fillStyle = window.getComputedStyle(sourceElement).backgroundColor;
        ctx.fillRect(0, 0, width, height);
        return;
    }

    if (bgValue.includes("linear-gradient")) {
        const match = bgValue.match(/linear-gradient\((.*?)\)/);
        if (match) {
            const parts = match[1].split(/,\s*(?![^(]*\))/);

            let angleDeg = 180;
            let stops = parts;

            if (parts[0].includes("deg")) {
                angleDeg = parseFloat(parts[0]);
                stops = parts.slice(1);
            }

            const angleRad = (angleDeg - 90) * (Math.PI / 180);
            const x0 = width / 2 - (Math.cos(angleRad) * width) / 2;
            const y0 = height / 2 - (Math.sin(angleRad) * height) / 2;
            const x1 = width / 2 + (Math.cos(angleRad) * width) / 2;
            const y1 = height / 2 + (Math.sin(angleRad) * height) / 2;

            const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

            stops.forEach((stop, index) => {
                const [color, offsetStr] = stop.trim().split(/\s+/);
                let offset = index / (stops.length - 1);

                if (offsetStr && offsetStr.includes("%")) {
                    offset = parseFloat(offsetStr) / 100;
                }
                gradient.addColorStop(offset, color);
            });

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            return;
        }
    }

    ctx.fillStyle = bgValue;
    ctx.fillRect(0, 0, width, height);
}

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => resolve(img);

        img.src = url;
    });
}

function drawWatermark(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    logoImg: HTMLImageElement | null,
) {
    const text = "Game of Life | CapyBlaze";
    const logoSize = 20;
    const paddingRight = 15;
    const paddingBottom = 15;
    const gap = 8;

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textBaseline = "middle";

    const textWidth = ctx.measureText(text).width;
    const totalWidth = logoImg ? logoSize + gap + textWidth : textWidth;

    const startX = width - paddingRight - totalWidth;
    const centerY = height - paddingBottom - logoSize / 2;

    if (logoImg) {
        ctx.drawImage(logoImg, startX, centerY - logoSize / 2, logoSize, logoSize);
        ctx.textAlign = "left";
        ctx.fillText(text, startX + logoSize + gap, centerY);
    } else {
        ctx.textAlign = "left";
        ctx.fillText(text, startX, centerY);
    }
}

export async function exportCanvasImage(sourceCanvas: HTMLCanvasElement, bgValue: string) {
    const width = sourceCanvas.width || sourceCanvas.getBoundingClientRect().width;
    const height = sourceCanvas.height || sourceCanvas.getBoundingClientRect().height;

    if (width === 0 || height === 0) {
        console.error("Invalid canvas: dimensions are zero");
        return;
    }

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;

    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    applyBackground(ctx, width, height, bgValue);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(sourceCanvas, 0, 0, width, height);

    try {
        const logoImg = await loadImageFromUrl("./favicon.svg");
        drawWatermark(ctx, width, height, logoImg);
    } catch (err) {
        console.error("Error whilst loading the SVG:", err);
    }

    const image = tempCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `GameOfLive-${Date.now()}.png`;
    link.click();
}

function nextFrameTick(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export async function exportCanvasGif(
    engine: GameOfLife,
    bgValue: string,
    gridColor: string,
    fadeLevels: number,
    showGrid: boolean,
    frameCount: number = 30,
    delay: number = 100,
) {
    const width = engine.width;
    const height = engine.height;

    if (width === 0 || height === 0) {
        console.error("Invalid canvas: dimensions are zero");
        return;
    }

    let logoImg: HTMLImageElement | null = null;
    try {
        logoImg = await loadImageFromUrl("./favicon.svg");
    } catch (err) {
        console.warn("Logo not loaded for the GIF:", err);
    }

    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: width,
        height: height,
        workerScript: "./gif.worker.js",
    });

    const simEngine = engine.clone();

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    for (let i = 0; i < frameCount; i++) {
        ctx.clearRect(0, 0, width, height);
        applyBackground(ctx, width, height, bgValue);

        ctx.globalCompositeOperation = "source-over";
        drawEngineFrame(ctx, simEngine, gridColor, fadeLevels, showGrid);

        drawWatermark(ctx, width, height, logoImg);
        gif.addFrame(ctx, { copy: true, delay: delay });

        if (i < frameCount - 1) {
            simEngine.step();
        }

        await nextFrameTick();
    }

    return new Promise<void>((resolve) => {
        gif.on("finished", (blob: Blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `GameOfLife-${Date.now()}.gif`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            resolve();
        });

        gif.render();
    });
}

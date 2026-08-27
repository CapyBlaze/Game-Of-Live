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

export function exportCanvasImage(sourceCanvas: HTMLCanvasElement, bgValue: string) {
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

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "right";
    ctx.fillText("CapyBlaze | Game of Life", width - 10, height - 10);

    const image = tempCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `GameOfLive-${Date.now()}.png`;
    link.click();
}

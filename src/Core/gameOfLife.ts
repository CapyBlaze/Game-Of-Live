import { useDashboardStore } from "../store/useDashboardStore";

const FILL_GRID = 0.7;

export class GameOfLife {
    width: number;
    height: number;
    cols: number;
    rows: number;
    cellSize: number;

    grid: Uint8Array;
    nextGrid: Uint8Array;
    energy: Float32Array;

    decay: number;
    generationCount: number;
    numberOfLivingCells: number;

    constructor(width: number, height: number, cellSize: number, decay = 0.92) {
        this.width = width;
        this.height = height;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.cellSize = cellSize;

        const total = this.cols * this.rows;
        this.grid = new Uint8Array(total);
        this.nextGrid = new Uint8Array(total);
        this.energy = new Float32Array(total);
        this.decay = decay;

        this.generationCount = 0;
        this.numberOfLivingCells = 0;

        this.randomize();
    }

    randomize() {
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = Math.random() > FILL_GRID ? 1 : 0;
            this.energy[i] = this.grid[i];
        }
    }

    computeNextGeneration() {
        const { cols, rows, grid, nextGrid, energy, decay } = this;
        const mode = useDashboardStore.getState().mode;

        this.numberOfLivingCells = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const idx = x * rows + y;

                let neighbors = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (dx === 0 && dy === 0) continue;

                        if (mode === "Neumann" && Math.abs(dx) + Math.abs(dy) === 2) continue;

                        const nx = (x + dx + cols) % cols;
                        const ny = (y + dy + rows) % rows;
                        neighbors += grid[nx * rows + ny];
                    }
                }

                const isAlive = grid[idx] === 1;
                const willLive =
                    (isAlive && (neighbors === 2 || neighbors === 3)) ||
                    (!isAlive && neighbors === 3);

                if (willLive) {
                    nextGrid[idx] = 1;
                    energy[idx] = 1;
                    this.numberOfLivingCells++;
                } else {
                    nextGrid[idx] = 0;
                    energy[idx] *= decay;
                    if (energy[idx] < 0.02) energy[idx] = 0;
                }
            }
        }

        this.grid.set(nextGrid);

        this.generationCount++;
        useDashboardStore.getState().actions.setCurrentGeneration(this.generationCount);
        useDashboardStore.getState().actions.setNumberOfLivingCells(this.numberOfLivingCells);
    }

    click(x: number, y: number) {
        const shape = [
            [0, 0, 0, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0],
            [1, 0, 0, 1, 1, 1, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 1],
            [1, 0, 0, 1, 1, 1, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 0],
        ];

        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                const cellX = Math.floor(x / this.cellSize) + j - 4;
                const cellY = Math.floor(y / this.cellSize) + i - 4;

                if (
                    cellX >= 0 &&
                    cellX < this.cols &&
                    cellY >= 0 &&
                    cellY < this.rows &&
                    shape[i][j] === 1
                ) {
                    const idx = cellX * this.rows + cellY;
                    this.grid[idx] = shape[i][j];
                    this.energy[idx] = shape[i][j];
                }
            }
        }
    }

    clear() {
        this.grid.fill(0);
        this.energy.fill(0);
        this.generationCount = 0;
        this.numberOfLivingCells = 0;

        useDashboardStore.getState().actions.setCurrentGeneration(this.generationCount);
        useDashboardStore.getState().actions.setNumberOfLivingCells(this.numberOfLivingCells);
    }
}

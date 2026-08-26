import CONFIG from "../config/defaultConfig";
import { useDashboardStore } from "../store/useDashboardStore";

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
            this.grid[i] = Math.random() > CONFIG.fillGrid ? 1 : 0;
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

                        let nx, ny;
                        if (mode === "Toric World") {
                            nx = (x + dx + cols) % cols;
                            ny = (y + dy + rows) % rows;
                        } else {
                            nx = x + dx;
                            ny = y + dy;

                            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
                        }
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
        // const shape = [
        //     [0, 0, 0, 1, 1, 1, 0, 0, 0],
        //     [0, 0, 1, 0, 0, 0, 1, 0, 0],
        //     [0, 1, 0, 0, 0, 0, 0, 1, 0],
        //     [1, 0, 0, 1, 1, 1, 0, 0, 1],
        //     [1, 0, 0, 1, 0, 1, 0, 0, 1],
        //     [1, 0, 0, 1, 1, 1, 0, 0, 1],
        //     [0, 1, 0, 0, 0, 0, 0, 1, 0],
        //     [0, 0, 1, 0, 0, 0, 1, 0, 0],
        //     [0, 0, 0, 1, 1, 1, 0, 0, 0],
        // ];

        const shape = [
            [0, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 1, 0, 1, 0, 0, 1],
            [1, 1, 0, 0, 1, 0, 0, 1, 1],
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

    updateCellSize(newCellSize: number) {
        if (newCellSize === this.cellSize) return;

        const newCols = Math.ceil(this.width / newCellSize);
        const newRows = Math.ceil(this.height / newCellSize);
        const total = newCols * newRows;

        const newGrid = new Uint8Array(total);
        const newEnergy = new Float32Array(total);

        const offsetX = Math.floor((newCols - this.cols) / 2);
        const offsetY = Math.floor((newRows - this.rows) / 2);

        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                const oldIdx = x * this.rows + y;

                if (this.grid[oldIdx] === 0 && this.energy[oldIdx] === 0) continue;

                const newX = x + offsetX;
                const newY = y + offsetY;

                if (newX >= 0 && newX < newCols && newY >= 0 && newY < newRows) {
                    const newIdx = newX * newRows + newY;
                    newGrid[newIdx] = this.grid[oldIdx];
                    newEnergy[newIdx] = this.energy[oldIdx];
                }
            }
        }

        this.cols = newCols;
        this.rows = newRows;
        this.cellSize = newCellSize;
        this.grid = newGrid;
        this.nextGrid = new Uint8Array(total);
        this.energy = newEnergy;
    }
}

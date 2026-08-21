import { useDashboardStore } from "../store/useDashboardStore";

export default function Dashboard() {
    const playing = useDashboardStore((state) => state.playing);
    // const reset = useDashboardStore((state) => state.reset);
    // const random = useDashboardStore((state) => state.random);
    // const zoom = useDashboardStore((state) => state.zoom);

    const targetFps = useDashboardStore((state) => state.targetFps);
    const fadeLevels = useDashboardStore((state) => state.fadeLevels);
    const currentGeneration = useDashboardStore((state) => state.currentGeneration);
    const numberOfLivingCells = useDashboardStore((state) => state.numberOfLivingCells);

    // const showGrid = useDashboardStore((state) => state.showGrid);
    // const mode = useDashboardStore((state) => state.mode);

    const actions = useDashboardStore((state) => state.actions);

    return (
        <div
            style={{
                position: "fixed",
                top: 20,
                left: 20,
                zIndex: 10,
                background: "rgba(255, 255, 255, 0.8)",
                padding: "10px 15px",
                borderRadius: "8px",
                fontFamily: "sans-serif",
            }}
        >
            <h1>Dashboard</h1>

            <button onClick={() => actions.setPlaying(!playing)}>P</button>
            <button>R</button>
            <button>A</button>

            <div>
                <button>+</button>
                <button>-</button>
            </div>

            <label htmlFor="speed">Speed : {targetFps} gen/s</label>
            <input
                id="speed"
                type="range"
                min="1"
                max="60"
                value={targetFps}
                onChange={(e) => actions.setTargetFps(Number(e.target.value))}
                style={{ display: "block", marginTop: "5px" }}
            />

            <label htmlFor="fade-levels">Fade levels : {fadeLevels}</label>
            <input
                id="fade-levels"
                type="range"
                min="1"
                max="30"
                value={fadeLevels}
                onChange={(e) => actions.setFadeLevels(Number(e.target.value))}
                style={{ display: "block", marginTop: "5px" }}
            />

            <input type="checkbox" onChange={(e) => actions.setShowGrid(e.currentTarget.checked)} />

            <select
                value={useDashboardStore.getState().mode}
                onChange={(e) => actions.setMode(e.target.value as "Moore" | "Neumann")}
            >
                <option value="Moore">Moore</option>
                <option value="Neumann">Neumann</option>
            </select>

            <span>Current generation: {currentGeneration}</span>
            <span>Number of living cells: {numberOfLivingCells}</span>
        </div>
    );
}

import { useState } from "react";
import { useDashboardStore, type GameMode } from "../store/useDashboardStore";
import BackgroundSelector from "./BackgroundSelector";
import CONFIG from "../config/defaultConfig";

function ButtonCheck({
    icon,
    alt,
    onClick,
}: {
    icon: string;
    alt: string;
    onClick: () => void | Promise<void>;
}) {
    const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

    const handleClick = async () => {
        if (status === "loading") return;

        setStatus("loading");
        try {
            await onClick();
        } finally {
            setStatus("done");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        <button onClick={handleClick} className="button-check" disabled={status === "loading"}>
            <img src={icon} alt={alt} className={`icon-gif ${status === "idle" ? "active" : ""}`} />
            <div className={`icon-spinner ${status === "loading" ? "active" : ""}`} />
            <img
                src="./checkmark.svg"
                alt="checkmark"
                className={`icon-check ${status === "done" ? "active" : ""}`}
            />
        </button>
    );
}

export default function Dashboard() {
    const playing = useDashboardStore((state) => state.playing);

    const resetGameInstance = useDashboardStore((state) => state.resetGameInstance);
    const randomizeGameInstance = useDashboardStore((state) => state.randomizeGameInstance);
    const exportImage = useDashboardStore((state) => state.exportImage);
    const exportGif = useDashboardStore((state) => state.exportGif);
    const resetData = useDashboardStore((state) => state.resetData);

    const targetFps = useDashboardStore((state) => state.targetFps);
    const fadeLevels = useDashboardStore((state) => state.fadeLevels);
    const currentGeneration = useDashboardStore((state) => state.currentGeneration);
    const numberOfLivingCells = useDashboardStore((state) => state.numberOfLivingCells);
    const cellSize = useDashboardStore((state) => state.cellSize);

    const mode = useDashboardStore((state) => state.mode);
    const actions = useDashboardStore((state) => state.actions);

    const [isDashboardVisible, setIsDashboardVisible] = useState(true);

    const speedPercentage =
        ((targetFps - CONFIG.speedMin) / (CONFIG.speedMax - CONFIG.speedMin)) * 100;
    const fadePercentage =
        ((fadeLevels - CONFIG.fadeLevelsMin) / (CONFIG.fadeLevelsMax - CONFIG.fadeLevelsMin)) * 100;

    return (
        <div className={`dashboard-container ${isDashboardVisible ? "isopen" : "isclosed"}`}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "5px",
                }}
            >
                <h2>Dashboard</h2>
                <button
                    style={{
                        background: "none",
                        border: "none",
                        padding: "0",
                        margin: "0",
                        boxShadow: "none",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                    }}
                    onClick={() => setIsDashboardVisible(!isDashboardVisible)}
                >
                    <img
                        src="./chevron-forward.svg"
                        alt="Close"
                        style={{
                            width: "20px",
                            height: "20px",
                            transform: `rotate(${isDashboardVisible ? -90 : 90}deg)`,
                            transition: "transform 0.3s ease-in-out",
                        }}
                    />
                </button>
            </div>

            <div
                style={{
                    display: "grid",
                    gap: "15px",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <button onClick={() => actions.setPlaying(!playing)}>
                        <img
                            src={playing ? "./pause.svg" : "./play.svg"}
                            alt={playing ? "Pause" : "Play"}
                        />
                    </button>
                    <button onClick={resetGameInstance}>
                        <img src="./trash.svg" alt="Reset" />
                    </button>
                    <button onClick={randomizeGameInstance}>
                        <img src="./dice.svg" alt="Randomize" />
                    </button>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
                            borderRadius: "5px",
                            overflow: "hidden",
                        }}
                    >
                        <button
                            onClick={actions.incrementCellSize}
                            style={{
                                borderRadius: "0",
                                boxShadow: "none",
                                borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <img src="./add-circle.svg" alt="Zoom In" />
                        </button>
                        <button
                            onClick={actions.resetCellSize}
                            style={{
                                borderRadius: "0",
                                boxShadow: "none",
                                background:
                                    cellSize == CONFIG.defaultCellSize ? "#dddddd" : "#ffffff",
                            }}
                        >
                            <img src="./1-1-circle.svg" alt="Original Size" />
                        </button>
                        <button
                            onClick={actions.decrementCellSize}
                            style={{
                                borderRadius: "0",
                                boxShadow: "none",
                                borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <img src="./remove-circle.svg" alt="Zoom Out" />
                        </button>
                    </div>
                </div>

                <hr />

                <div
                    style={{ width: "100%", display: "flex", gap: "3px", flexDirection: "column" }}
                >
                    <label htmlFor="speed">
                        <span style={{ fontWeight: "bold" }}>Speed</span> : {targetFps} gen/s
                    </label>
                    <input
                        id="speed"
                        type="range"
                        min={CONFIG.speedMin}
                        max={CONFIG.speedMax}
                        value={targetFps}
                        onChange={(e) => actions.setTargetFps(Number(e.target.value))}
                        style={
                            {
                                display: "block",
                                marginTop: "5px",
                                width: "100%",
                                "--progress": `${speedPercentage}%`,
                            } as React.CSSProperties
                        }
                    />
                </div>

                <div
                    style={{ width: "100%", display: "flex", gap: "3px", flexDirection: "column" }}
                >
                    <label htmlFor="fade-levels">
                        <span style={{ fontWeight: "bold" }}>Fade levels</span> : {fadeLevels}
                    </label>
                    <input
                        id="fade-levels"
                        type="range"
                        min={CONFIG.fadeLevelsMin}
                        max={CONFIG.fadeLevelsMax}
                        value={fadeLevels}
                        onChange={(e) => actions.setFadeLevels(Number(e.target.value))}
                        style={
                            {
                                display: "block",
                                marginTop: "5px",
                                width: "100%",
                                "--progress": `${fadePercentage}%`,
                            } as React.CSSProperties
                        }
                    />
                </div>

                <label
                    htmlFor="mode"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <span>
                        <span style={{ fontWeight: "bold" }}>Mode</span> :
                    </span>
                    <select
                        name="mode"
                        id="mode"
                        value={mode}
                        onChange={(e) => actions.setMode(e.target.value as GameMode)}
                    >
                        <option value="Moore">Moore</option>
                        <option value="Neumann">Neumann</option>
                        <option value="Toric World">Toric World</option>
                    </select>
                </label>

                <hr />

                <BackgroundSelector />

                <hr />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "nowrap",
                            justifyContent: "flex-start",
                            gap: "10px",
                        }}
                    >
                        <ButtonCheck
                            icon="./link.svg"
                            alt="Copy Link"
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                        />
                        <ButtonCheck
                            icon="./image.svg"
                            alt="Export Image"
                            onClick={() => exportImage()}
                        />
                        <ButtonCheck
                            icon="./images.svg"
                            alt="Export Gif"
                            onClick={() => exportGif()}
                        />
                        <ButtonCheck
                            icon="./logo-github.svg"
                            alt="Github"
                            onClick={() => {
                                window.open("https://github.com/CapyBlaze/Game-Of-Live", "_blank");
                            }}
                        />
                    </div>

                    <button onClick={resetData}>
                        <img src="./reload.svg" alt="Reset Data" />
                    </button>
                </div>

                <hr />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                >
                    <span>Current generation: {currentGeneration.toLocaleString("fr-FR")}</span>
                    <span>
                        Number of living cells: {numberOfLivingCells.toLocaleString("fr-FR")}
                    </span>
                </div>
            </div>
        </div>
    );
}

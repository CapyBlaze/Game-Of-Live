import CONFIG from "../config/defaultConfig";
import { useDashboardStore } from "../store/useDashboardStore";

function InputRadio({
    gradient,
    currentBg,
    setBackgroundType,
}: {
    gradient: string;
    currentBg: string;
    setBackgroundType: (gradient: string) => void;
}) {
    return (
        <label
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
            }}
        >
            <input
                type="radio"
                name="background"
                value={gradient}
                checked={currentBg === gradient}
                onChange={() => setBackgroundType(gradient)}
                style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                }}
            />

            <span
                style={{
                    width: "30px",
                    height: "30px",
                    background: !gradient.includes("raimbow-animation") ? gradient : "#5461c8",
                    animation: gradient.includes("raimbow-animation")
                        ? "raimbow-animation 10s linear infinite"
                        : "none",
                    borderRadius: "50%",
                    display: "inline-block",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
            />

            <img
                src="./checkmark-circle.svg"
                alt="Checkmark"
                style={{
                    width: "25px",
                    height: "25px",
                    position: "absolute",
                    display: currentBg === gradient ? "block" : "none",
                }}
            />
        </label>
    );
}

export default function BackgroundSelector() {
    const currentBg = useDashboardStore((state) => state.background);
    const showGrid = useDashboardStore((state) => state.showGrid);

    const actions = useDashboardStore((state) => state.actions);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                }}
            >
                <span style={{ fontWeight: "bold" }}>Cell color</span>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "30px",
                    }}
                >
                    {CONFIG.backgrounds.map((bg) => (
                        <InputRadio
                            key={bg}
                            gradient={bg}
                            currentBg={currentBg}
                            setBackgroundType={actions.setBackground}
                        />
                    ))}

                    <label
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <input
                            type="color"
                            name="custom-cell"
                            defaultValue={CONFIG.defaultCellSingleColor}
                            onChange={(e) => actions.setBackground(e.target.value)}
                        />

                        <img
                            src="./brush-circle.svg"
                            alt="Brush"
                            style={{
                                width: "25px",
                                height: "25px",
                                position: "absolute",
                                display: "block",
                            }}
                        />
                    </label>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "30px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                >
                    <span style={{ fontWeight: "bold" }}>Grid color</span>
                    <div>
                        <label
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <input
                                type="color"
                                name="custom-grid"
                                defaultValue={`rgb(${CONFIG.defaultGridColor})`}
                                onChange={(e) => {
                                    const hex = e.target.value;

                                    const r = parseInt(hex.substring(1, 3), 16);
                                    const g = parseInt(hex.substring(3, 5), 16);
                                    const b = parseInt(hex.substring(5, 7), 16);

                                    actions.setGridColor(`${r}, ${g}, ${b}`);
                                }}
                            />

                            <img
                                src="./brush-circle.svg"
                                alt="Brush"
                                style={{
                                    width: "25px",
                                    height: "25px",
                                    position: "absolute",
                                    display: "block",
                                }}
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <label className="switch">
                        <span className="switch-label" style={{ fontWeight: "bold" }}>
                            Show grid
                        </span>
                        <div>
                            <input
                                type="checkbox"
                                checked={showGrid}
                                onChange={(e) => actions.setShowGrid(e.currentTarget.checked)}
                            />
                            <span className="slider"></span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}

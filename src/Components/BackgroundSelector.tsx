import { useDashboardStore } from "../store/useDashboardStore";

function InputRadio({ gradient }: { gradient: string }) {
    const currentBg = useDashboardStore((state) => state.background);
    const setBackgroundType = useDashboardStore((state) => state.actions.setBackground);

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
                    background: gradient,
                    borderRadius: "50%",
                    display: "inline-block",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
            />

            <img
                src="/checkmark-circle.svg"
                alt="Checkmark"
                style={{
                    width: "20px",
                    height: "20px",
                    position: "absolute",
                    display: currentBg === gradient ? "block" : "none",
                }}
            />
        </label>
    );
}

export default function BackgroundSelector() {
    return (
        <div
            style={{
                gap: "6px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
            }}
        >
            <InputRadio gradient={"linear-gradient(40deg, #8a2387, #e94057, #f27121)"} />
            <InputRadio gradient={"linear-gradient(135deg, #ff0099, #493240)"} />
            <InputRadio gradient={"linear-gradient(135deg, #ec2f4b, #009fff)"} />
            <InputRadio gradient={"linear-gradient(135deg, #654ea3, #eaafc8)"} />
            <InputRadio gradient={"linear-gradient(135deg, #4159d0, #c84fc0, #ffcd70)"} />
        </div>
    );
}

import { useState } from "react";

export default function ButtonCheck({
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

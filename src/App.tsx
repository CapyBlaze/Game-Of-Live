import { useEffect, useRef } from "react";

function App() {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        console.log(
            "Canvas ref:",
            canvas.current?.height,
            canvas.current?.width,
        );
    });

    return (
        <canvas
            ref={canvas}
            width={window.innerWidth}
            height={window.innerHeight}
        />
    );
}

export default App;

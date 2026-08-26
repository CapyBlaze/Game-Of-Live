const CONFIG = {
    speedMin: 1,
    speedMax: 60,
    fadeLevelsMin: 1,
    fadeLevelsMax: 30,
    zoomMin: 3,
    zoomMax: 10,

    fillGrid: 0.7,
    gridLineWidth: 0.5,
    gridLineColor: "rgba(255, 255, 255, 0.15)",

    backgrounds: [
        "linear-gradient(135deg, #ff0099, #493240)",
        "linear-gradient(40deg, #8a2387, #e94057, #f27121)",
        "linear-gradient(135deg, #ec2f4b, #009fff)",
        "linear-gradient(135deg, #654ea3, #eaafc8)",
        "linear-gradient(135deg, #4159d0, #c84fc0, #ffcd70)",
    ],

    defaultCellSingleColor: "#0db7d9",
    defaultCellGradient: "linear-gradient(135deg, #ff0099, #493240)",
    defaultGridColor: "28, 27, 26",

    defaultMode: "Moore",
    defaultShowGrid: false,
    defaultPlaying: true,
    defaultCellSize: 5,
    defaultTargetFps: 15,
    defaultFadeLevels: 15,
    defaultCurrentGeneration: 0,
    defaultNumberOfLivingCells: 0,
};

export default CONFIG;

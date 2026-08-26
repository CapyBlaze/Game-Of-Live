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
        "linear-gradient(135deg, #ff0099, #261520)",
        "linear-gradient(40deg, #8a2387, #e94057, #f27121)",
        "linear-gradient(135deg, #ff0026, #009dff)",
        "linear-gradient(45deg, #5461c8 12.5%, #c724b1 25%, #e4002b 37.5%, #ff6900 50%, #f6be00 62.5%, #97d700 75%, #00ab84 87.5%, #00a3e0 100%)",
        "raimbow-animation",
    ],

    defaultCellSingleColor: "#0db7d9",
    defaultCellGradient: "linear-gradient(135deg, #ff0099, #493240)",
    defaultGridColor: "18, 17, 16",

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

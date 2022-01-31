import constants from "./constants";
const { gridX, gridY, gridZ } = constants;

const stages = [
    {
        asteroidsPerSecond: 0,
        enemies: [
            {
                type: "shooter",
                path: [
                    { x: 0, y: gridY - 1, z: 0 },
                    { x: gridX - 1, y: gridY - 1, z: 0 },
                ],
            },
            {
                type: "shooter",
                path: [
                    { x: gridX - 1, y: gridY - 1, z: 1 },
                    { x: 0, y: gridY - 1, z: 1 },
                ],
            },
            {
                type: "shooter",
                path: [
                    { x: 0, y: gridY - 1, z: 2 },
                    { x: gridX - 1, y: gridY - 1, z: 2 },
                ],
            },
            {
                type: "shooter",
                path: [
                    { x: gridX - 1, y: gridY - 1, z: 3 },
                    { x: 0, y: gridY - 1, z: 3 },
                ],
            },
            {
                type: "shooter",
                path: [
                    { x: 0, y: gridY - 1, z: 4 },
                    { x: gridX - 1, y: gridY - 1, z: 4 },
                ],
            },
        ],
    },
];

export default stages;

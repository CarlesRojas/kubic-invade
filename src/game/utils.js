import constants from "../constants";

export const gridPosToWorldPos = ({ x, y, z }) => {
    const { cellSize, gridX, gridZ } = constants;

    const worldX = x * cellSize - Math.floor(gridX / 2) * cellSize;
    const worldY = y * cellSize + cellSize / 2;
    const worldZ = z * cellSize - Math.floor(gridZ / 2) * cellSize;

    return { worldX, worldY, worldZ };
};

export const isPosInsideGrid = ({ x, y, z }) => {
    const { gridX, gridY, gridZ } = constants;

    if (x < 0 || x >= gridX) return false;
    if (y < 0 || y >= gridY) return false;
    if (z < 0 || z >= gridZ) return false;

    return true;
};

export const isPosOutsideViewport = ({ x, y, z }) => {
    const { cellSize, gridX, gridY, gridZ } = constants;

    if (x < -cellSize * 3 || x > cellSize * (gridX + 3)) return true;
    if (y < -cellSize * 3 || y > cellSize * (gridY + 3)) return true;
    if (z < -cellSize * 3 || z > cellSize * (gridZ + 3)) return true;

    return false;
};

function multiplyMatrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

export const xyToIso = ({ x, y }) => {
    var transformMatrix = [
        [-(1 / Math.sqrt(3)), 1 / Math.sqrt(3)],
        [-1, -1],
    ];

    const result = multiplyMatrices([[x, y]], transformMatrix);
    return { x: -result[0][0], z: -result[0][1] };
};

export const isoToXy = ({ x, z }) => {
    var transformMatrix = [
        [-Math.sqrt(3) / 2, -1 / 2],
        [Math.sqrt(3) / 2, -1 / 2],
    ];

    const result = multiplyMatrices([[-x, -z]], transformMatrix);
    return { x: result[0][0], y: result[0][1] };
};

// min and max included
export const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

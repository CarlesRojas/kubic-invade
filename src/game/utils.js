import constants from "../constants";

export const gridPosToWorldPos = ({ x, y, z }) => {
    const { cellSize, gridX, gridZ } = constants;

    const worldX = x * cellSize - Math.floor(gridZ / 2) * cellSize;
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

import * as THREE from "three";
import constants from "../constants";

export const Floor = () => {
    const { gridX, gridZ, cellSize } = constants;

    const height = cellSize * 0.1;

    var floor = new THREE.Mesh(
        new THREE.BoxBufferGeometry(cellSize * gridX, height, cellSize * gridZ),
        new THREE.MeshLambertMaterial({ color: "#0b4263" })
    );

    floor.position.y = -height * 0.5;

    return floor;
};

export const Grid = () => {
    const { gridY, gridX, cellSize } = constants;

    const grid = new THREE.Group();

    for (let i = 0; i < gridY; i++) {
        const layer = new THREE.GridHelper(gridX * cellSize, gridX, "#ffd500", "#ffd500");
        layer.position.y = cellSize * i;
        grid.add(layer);
    }

    return grid;
};

export const Cube = (color) => {
    const { cellSize } = constants;

    var cube = new THREE.Mesh(
        new THREE.BoxBufferGeometry(cellSize * 0.95, cellSize * 0.95, cellSize * 0.95),
        new THREE.MeshLambertMaterial({ color })
    );

    return cube;
};

import * as THREE from "three";
import constants from "../constants";
import chroma from "chroma-js";

export const Floor = () => {
    const { gridX, gridZ, cellSize } = constants;

    const chromaScale = chroma.scale(["#000000", "#529aff"]);

    var floor = new THREE.Mesh(
        new THREE.PlaneGeometry(cellSize * gridX, cellSize * gridZ),
        new THREE.MeshLambertMaterial({ color: chromaScale(0.3).hex(), transparent: true, opacity: 0.6 })
    );

    floor.rotation.x = THREE.Math.degToRad(-90);

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

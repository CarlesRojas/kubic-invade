import * as THREE from "three";
import constants from "../constants";
import { gridPosToWorldPos, isPosInsideGrid } from "./utils";

export default class Player {
    constructor(level, initialPos = { x: 0, y: 0, z: 0 }) {
        const { cellSize } = constants;
        this.targetPos = initialPos;

        this.player = new THREE.Mesh(
            new THREE.BoxBufferGeometry(cellSize * 0.5, cellSize * 0.5, cellSize * 0.5),
            new THREE.MeshLambertMaterial({ color: "white" })
        );

        const { worldX, worldY, worldZ } = gridPosToWorldPos(initialPos);

        this.player.position.x = worldX;
        this.player.position.y = worldY;
        this.player.position.z = worldZ;

        level.current.add(this.player);
    }

    update(deltaTime, timestamp) {
        this.#animate(deltaTime);
    }

    move({ xDisp, zDisp }) {
        if (!this.player) return;

        const newPos = { x: this.targetPos.x + xDisp, y: this.targetPos.y, z: this.targetPos.z + zDisp };

        if (isPosInsideGrid(newPos)) this.targetPos = newPos;
    }

    #animate(deltaTime) {
        if (!this.player) return;

        const { cellSize } = constants;

        const step = (cellSize / 50) * deltaTime;

        const { worldX, worldY, worldZ } = gridPosToWorldPos(this.targetPos);

        if (this.player.position.x > worldX) this.player.position.x = Math.max(worldX, this.player.position.x - step);
        else if (this.player.position.x < worldX)
            this.player.position.x = Math.min(worldX, this.player.position.x + step);

        if (this.player.position.y > worldY) this.player.position.y = Math.max(worldY, this.player.position.y - step);
        else if (this.player.position.y < worldY)
            this.player.position.y = Math.min(worldY, this.player.position.y + step);

        if (this.player.position.z > worldZ) this.player.position.z = Math.max(worldZ, this.player.position.z - step);
        else if (this.player.position.z < worldZ)
            this.player.position.z = Math.min(worldZ, this.player.position.z + step);
    }
}

import * as THREE from "three";
import constants from "../constants";
import { gridPosToWorldPos } from "./utils";

export default class Bullet {
    // Speed is the milliseconds the bullet will take to advance one grid cell
    constructor(level, player, initialPos = { x: 0, y: 0, z: 0 }, config = {}) {
        const { cellSize } = constants;

        this.level = level;
        this.player = player;
        this.position = initialPos;

        this.config = config;
        if (!("friendly" in this.config)) this.config.friendly = false;
        if (!("speed" in this.config)) this.config.speed = 150;

        this.bullet = new THREE.Mesh(
            new THREE.BoxBufferGeometry(cellSize * 0.15, cellSize * 0.3, cellSize * 0.15),
            new THREE.MeshLambertMaterial({ color: config.friendly ? "#e6e6e6" : "#c70000" })
        );

        this.shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(cellSize * 0.1, cellSize * 0.1),
            new THREE.MeshLambertMaterial({ color: "#c70000" })
        );

        const { worldX, worldY, worldZ } = gridPosToWorldPos(initialPos);

        this.bullet.position.x = worldX;
        this.bullet.position.y = worldY;
        this.bullet.position.z = worldZ;

        this.shadow.position.x = worldX;
        this.shadow.position.y = 0.21;
        this.shadow.position.z = worldZ;
        this.shadow.rotation.x = THREE.Math.degToRad(-90);

        level.current.add(this.bullet);
        if (!this.config.friendly) level.current.add(this.shadow);
    }

    update(deltaTime, timestamp) {
        this.#animate(deltaTime);
    }

    #animate(deltaTime) {
        if (!this.bullet) return;
        const { cellSize } = constants;

        const step = (cellSize / this.config.speed) * deltaTime;
        this.bullet.position.y = this.bullet.position.y + (this.config.friendly ? step : -step);

        // Move shadow
        if (!this.config.friendly) {
            this.shadow.position.y =
                this.position.x === this.player.targetPos.x && this.position.z === this.player.targetPos.z
                    ? 0.76 * cellSize
                    : 0.21;
        }
    }
}

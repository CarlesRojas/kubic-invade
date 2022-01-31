import * as THREE from "three";
import constants from "../constants";

export default class Bullet {
    constructor(level, initialWorldPos = { x: 0, y: 0, z: 0 }, config = {}) {
        const { cellSize } = constants;

        this.level = level;
        this.player = level.current.getObjectByName("player");
        this.position = initialWorldPos;

        this.config = config;
        if (!("friendly" in this.config)) this.config.friendly = false;
        if (!("speed" in this.config)) this.config.speed = 150;

        this.object = new THREE.Mesh(
            new THREE.BoxBufferGeometry(cellSize * 0.15, cellSize * 0.3, cellSize * 0.15),
            new THREE.MeshLambertMaterial({ color: this.config.friendly ? "#e6e6e6" : "#c95328" })
        );

        this.shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(cellSize * 0.1, cellSize * 0.1),
            new THREE.MeshLambertMaterial({ color: "#c95328" })
        );

        this.object.position.x = initialWorldPos.x;
        this.object.position.y = initialWorldPos.y;
        this.object.position.z = initialWorldPos.z;

        this.shadow.position.x = initialWorldPos.x;
        this.shadow.position.y = 0.21;
        this.shadow.position.z = initialWorldPos.z;
        this.shadow.rotation.x = THREE.Math.degToRad(-90);

        level.current.add(this.object);
        if (!this.config.friendly) level.current.add(this.shadow);
    }

    update(deltaTime, timestamp) {
        this.#animate(deltaTime);
    }

    #animate(deltaTime) {
        if (!this.object) return;
        const { cellSize } = constants;

        const step = (cellSize / this.config.speed) * deltaTime;
        this.object.position.y = this.object.position.y + (this.config.friendly ? step : -step);

        // Move shadow
        if (!this.config.friendly) {
            const playerY = this.player.position.y + cellSize * 0.26;
            this.shadow.position.y = this.#isShadowOverPlayer() ? playerY : 0.21;
        }
    }

    #isShadowOverPlayer() {
        const { cellSize } = constants;

        const minX = this.player.position.x - cellSize * 0.25;
        const maxX = this.player.position.x + cellSize * 0.25;

        const minZ = this.player.position.z - cellSize * 0.25;
        const maxZ = this.player.position.z + cellSize * 0.25;

        return this.position.x > minX && this.position.x < maxX && this.position.z > minZ && this.position.z < maxZ;
    }
}

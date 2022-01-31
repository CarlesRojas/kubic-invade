import * as THREE from "three";
import constants from "../constants";
import chroma from "chroma-js";
import { gridPosToWorldPos, isPosInsideGrid, isPosOutsideViewport } from "./utils";
import Bullet from "./bullet";

export default class Player {
    constructor(level, initialPos = { x: 0, y: 0, z: 0 }) {
        const { cellSize } = constants;
        this.targetPos = initialPos;
        this.level = level;

        const chromaScale = chroma.scale(["#000000", "#529aff"]);
        const { worldX, worldY, worldZ } = gridPosToWorldPos(initialPos);

        // PLAYER
        this.player = new THREE.Mesh(
            new THREE.BoxBufferGeometry(cellSize * 0.5, cellSize * 0.5, cellSize * 0.5),
            new THREE.MeshLambertMaterial({ color: "#e6e6e6" })
        );
        this.player.position.x = worldX;
        this.player.position.y = worldY;
        this.player.position.z = worldZ;
        level.current.add(this.player);

        // SHADOW
        this.shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(cellSize * 0.5, cellSize * 0.5),
            new THREE.MeshLambertMaterial({ color: chromaScale(0.2).hex() })
        );
        this.shadow.position.x = worldX;
        this.shadow.position.y = 0.2;
        this.shadow.position.z = worldZ;
        this.shadow.rotation.x = THREE.Math.degToRad(-90);
        level.current.add(this.shadow);

        // BULLETS
        this.bullets = [];
        this.timeBetweenBullets = 500;
        this.interval = setInterval(() => {
            this.bullets.push(new Bullet(level, this, this.targetPos, { friendly: true }));
        }, this.timeBetweenBullets);
    }

    destructor() {
        clearInterval(this.interval);
    }

    update(deltaTime, timestamp) {
        this.#animate(deltaTime);
        this.#animateBullets(deltaTime, timestamp);
    }

    move({ xDisp, zDisp }) {
        if (!this.player) return;

        const newPos = { x: this.targetPos.x + xDisp, y: this.targetPos.y, z: this.targetPos.z + zDisp };

        if (isPosInsideGrid(newPos)) this.targetPos = newPos;
    }

    #animate(deltaTime) {
        if (!this.player) return;

        const { cellSize } = constants;

        const animationDurationMs = 50;
        const step = (cellSize / animationDurationMs) * deltaTime;

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

        this.shadow.position.x = this.player.position.x;
        this.shadow.position.y = 0.2;
        this.shadow.position.z = this.player.position.z;
    }

    #animateBullets(deltaTime, timestamp) {
        if (!this.bullets) return;

        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.update(deltaTime, timestamp);

            // Destoy bullet when out of viewport
            if (isPosOutsideViewport(bullet.bullet.position)) {
                this.level.current.remove(bullet.bullet);
                this.bullets.shift();
                --i;
            }
        }
    }
}

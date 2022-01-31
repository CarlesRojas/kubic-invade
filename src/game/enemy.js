import * as THREE from "three";
import constants from "../constants";
import chroma from "chroma-js";
import { gridPosToWorldPos, isPosOutsideViewport, randomIntFromInterval } from "./utils";
import Bullet from "./bullet";

export default class Enemy {
    constructor(level, path) {
        const { cellSize } = constants;

        this.path = path;
        this.targetPos = this.path[0];
        this.pathState = 0;
        this.level = level;
        this.player = level.current.getObjectByName("player");

        this.chromaScale = chroma.scale(["#000000", "#529aff"]);
        const { worldX, worldY, worldZ } = gridPosToWorldPos(this.targetPos);

        // ENEMY
        this.object = new THREE.Mesh(
            new THREE.BoxBufferGeometry(cellSize * 0.4, cellSize * 0.4, cellSize * 0.4),
            new THREE.MeshLambertMaterial({ color: "#c95328" })
        );
        this.object.name = "enemy";
        this.object.position.x = worldX;
        this.object.position.y = worldY;
        this.object.position.z = worldZ;
        level.current.add(this.object);

        // SHADOW
        this.shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(cellSize * 0.4, cellSize * 0.4),
            new THREE.MeshLambertMaterial({ color: this.chromaScale(0.2).hex() })
        );
        this.shadow.position.x = worldX;
        this.shadow.position.y = 0.2;
        this.shadow.position.z = worldZ;
        this.shadow.rotation.x = THREE.Math.degToRad(-90);
        level.current.add(this.shadow);

        // BULLETS
        this.bullets = [];
        this.timeBetweenBulletsRange = { min: 2000, max: 10000 };
        this.#shoot();
    }

    destructor() {
        clearTimeout(this.timeout);
    }

    update(deltaTime, timestamp) {
        this.#animate(deltaTime);
        this.#animateBullets(deltaTime, timestamp);
    }

    #shoot() {
        this.timeout = setTimeout(() => {
            this.bullets.push(new Bullet(this.level, this.object.position, { friendly: false }));
            this.#shoot();
        }, randomIntFromInterval(this.timeBetweenBulletsRange.min, this.timeBetweenBulletsRange.max));
    }

    #animate(deltaTime) {
        if (!this.object) return;

        const { cellSize } = constants;

        const worldTargetPos = gridPosToWorldPos(this.targetPos);

        if (
            worldTargetPos.worldX === this.object.position.x &&
            worldTargetPos.worldY === this.object.position.y &&
            worldTargetPos.worldZ === this.object.position.z
        ) {
            this.pathState = this.pathState < this.path.length - 1 ? this.pathState + 1 : 0;
            this.targetPos = this.path[this.pathState];
        }

        const animationDurationMs = 1000;
        const step = (cellSize / animationDurationMs) * deltaTime;

        const { worldX, worldY, worldZ } = gridPosToWorldPos(this.targetPos);

        if (this.object.position.x > worldX) this.object.position.x = Math.max(worldX, this.object.position.x - step);
        else if (this.object.position.x < worldX)
            this.object.position.x = Math.min(worldX, this.object.position.x + step);

        if (this.object.position.y > worldY) this.object.position.y = Math.max(worldY, this.object.position.y - step);
        else if (this.object.position.y < worldY)
            this.object.position.y = Math.min(worldY, this.object.position.y + step);

        if (this.object.position.z > worldZ) this.object.position.z = Math.max(worldZ, this.object.position.z - step);
        else if (this.object.position.z < worldZ)
            this.object.position.z = Math.min(worldZ, this.object.position.z + step);

        // Move shadow
        const playerY = this.player.position.y + cellSize * 0.26;
        const isOverPlayer = this.#isShadowOverPlayer();
        this.shadow.position.x = this.object.position.x;
        this.shadow.position.y = isOverPlayer ? playerY : 0.205;
        this.shadow.position.z = this.object.position.z;
        this.shadow.material.color.set(isOverPlayer ? "#a3a3a3" : this.chromaScale(0.2).hex());
    }

    #animateBullets(deltaTime, timestamp) {
        if (!this.bullets) return;

        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.update(deltaTime, timestamp);

            // Destroy shadow if below y 0
            if (bullet.object.position.y < 0) this.level.current.remove(bullet.shadow);

            // Destroy bullet when out of viewport
            if (isPosOutsideViewport(bullet.object.position)) {
                this.level.current.remove(bullet.object);
                this.bullets.splice(i, 1);
                --i;
            }
        }
    }

    #isShadowOverPlayer() {
        const { cellSize } = constants;

        const minX = this.player.position.x - cellSize * 0.25;
        const maxX = this.player.position.x + cellSize * 0.25;

        const minZ = this.player.position.z - cellSize * 0.25;
        const maxZ = this.player.position.z + cellSize * 0.25;

        return (
            this.object.position.x > minX &&
            this.object.position.x < maxX &&
            this.object.position.z > minZ &&
            this.object.position.z < maxZ
        );
    }
}

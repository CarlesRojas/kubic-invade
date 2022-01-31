// import * as THREE from "three";
// import constants from "../constants";
// import chroma from "chroma-js";
// import { gridPosToWorldPos, isPosInsideGrid, isPosOutsideViewport } from "./utils";
// import Bullet from "./bullet";
import stages from "../stages";
import Enemy from "./enemy";

export default class Stage {
    constructor(level) {
        this.level = level;
        this.enemies = [];
        this.asteroidsPerSecond = 0;
    }

    update(deltaTime, timestamp) {
        if (!this.enemies.length) this.#instantiateState();

        for (let i = 0; i < this.enemies.length; i++) {
            const elem = this.enemies[i];
            elem.update(deltaTime, timestamp);
        }
    }

    #instantiateState() {
        const newStage = stages[Math.floor(Math.random() * stages.length)];
        this.asteroidsPerSecond = newStage.asteroidsPerSecond;

        for (const { path } of newStage.enemies) this.enemies.push(new Enemy(this.level, path));
    }
}

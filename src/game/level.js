import * as THREE from "three";
import { Floor, Grid } from "./models";

export default class Level {
    constructor(scene, showAxis = false, showGrid = false) {
        this.level = new THREE.Group();
        this.targetAngle = 0;

        const floor = Floor();
        this.level.add(floor);

        if (showGrid) {
            const gridHelper = Grid();
            this.level.add(gridHelper);
        }

        if (showAxis) {
            var axesHelper = new THREE.AxesHelper(5);
            this.level.add(axesHelper);
        }

        scene.current.add(this.level);
    }

    update(deltaTime, timestamp) {
        this.#animate(deltaTime);
    }

    add(mesh) {
        this.level.add(mesh);
    }

    getObjectByName(name) {
        return this.level.getObjectByName(name);
    }

    remove(mesh) {
        this.level.remove(mesh);
    }

    rotate(rotateRight) {
        if (!this.level) return;

        if (rotateRight) this.targetAngle = this.targetAngle + 90;
        else this.targetAngle = this.targetAngle - 90;
    }

    #animate(deltaTime) {
        if (!this.level) return;

        const animationDurationMs = 250;
        const levelTargetAngleRad = THREE.Math.degToRad(this.targetAngle);
        const step = (THREE.Math.degToRad(90) / animationDurationMs) * deltaTime;

        if (this.level.rotation.y > levelTargetAngleRad)
            this.level.rotation.y = Math.max(levelTargetAngleRad, this.level.rotation.y - step);
        else if (this.level.rotation.y < levelTargetAngleRad)
            this.level.rotation.y = Math.min(levelTargetAngleRad, this.level.rotation.y + step);
    }
}

import { useRef, useEffect, useCallback, useState } from "react";
import chroma from "chroma-js";
import constants from "../constants";
import * as THREE from "three";
import useResize from "../hooks/useResize";
import useThrottle from "../hooks/useThrottle";
import Gestures from "./Gestures";
import UI from "./UI";
import Player from "../game/player";
import Level from "../game/level";

export default function Game() {
    const gameRef = useRef();

    // #################################################
    //   SCENE
    // #################################################

    const scene = useRef();
    const camera = useRef();
    const renderer = useRef();

    // #################################################
    //   OBJECTS
    // #################################################

    const level = useRef();
    const player = useRef();
    const grid = useRef([[[]]]);

    // #################################################
    //   GAME LOOP
    // #################################################

    const lastTimestamp = useRef(0);

    const getDeltaTime = (timestamp) => {
        const deltaTime = timestamp - lastTimestamp.current;
        lastTimestamp.current = timestamp;

        return deltaTime;
    };

    const gameLoop = useCallback((timestamp) => {
        const deltaTime = getDeltaTime(timestamp);

        if (level.current) level.current.update(deltaTime);
        if (player.current) player.current.update(deltaTime);

        renderer.current.render(scene.current, camera.current);
    }, []);

    const start = useCallback(() => {
        const { gridX, gridZ } = constants;

        level.current = new Level(scene, false, false);
        player.current = new Player(level, { x: Math.floor(gridX / 2), y: 0, z: Math.floor(gridZ / 2) });

        renderer.current.setAnimationLoop(gameLoop);
    }, [gameLoop]);

    const stop = () => {
        renderer.setAnimationLoop(null);
    };

    // #################################################
    //   RESIZE
    // #################################################

    const [gameDimensions, setGameDimensions] = useState({ width: 0, height: 0 });

    const handleResize = () => {
        // Update renderer size
        const width = gameRef.current.clientWidth;
        const height = gameRef.current.clientHeight;
        var finalWidth = width;
        var finalHeight = (width / 9) * 19;
        if (finalHeight > height) {
            finalHeight = height;
            finalWidth = (height / 19) * 9;
        }

        setGameDimensions({ width: finalWidth, height: finalHeight });
        renderer.current.setSize(finalWidth, finalHeight);
    };

    useResize(handleResize, false);

    // #################################################
    //   INIT
    // #################################################

    useEffect(() => {
        const { gridX, gridY, gridZ } = constants;

        // Init grid
        const xArray = [];
        for (let i = 0; i < gridX; i++) {
            const yArray = [];
            for (let j = 0; j < gridY; j++) {
                const zArray = [];
                for (let k = 0; k < gridZ; k++) zArray.push(null);
                yArray.push(zArray);
            }
            xArray.push(yArray);
        }
        grid.current = xArray;

        // Create Scene
        scene.current = new THREE.Scene();

        // Create lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.current.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(200, 300, 100);
        scene.current.add(dirLight);

        // Create camera
        const aspectRatio = 9 / 19;
        const cameraWidth = 80;
        const cameraHeight = cameraWidth / aspectRatio;

        camera.current = new THREE.OrthographicCamera(
            cameraWidth / -2,
            cameraWidth / 2,
            cameraHeight / 2,
            cameraHeight / -2,
            10,
            1000
        );

        const verticalDisplacement = 50;
        camera.current.position.set(100, 75 + verticalDisplacement, 100);
        camera.current.lookAt(0, verticalDisplacement, 0);

        // Create renderer
        const width = gameRef.current.clientWidth;
        const height = gameRef.current.clientHeight;
        var finalWidth = width;
        var finalHeight = (width / 9) * 19;
        if (finalHeight > height) {
            finalHeight = height;
            finalWidth = (height / 19) * 9;
        }

        renderer.current = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
        });

        setGameDimensions({ width: finalWidth, height: finalHeight });
        renderer.current.setSize(finalWidth, finalHeight);

        gameRef.current.appendChild(renderer.current.domElement);

        start();

        return () => {
            stop();
        };
    }, [start]);

    // #################################################
    //   USER ACTIONS
    // #################################################

    const handleRotateBase = useThrottle((rotateRight) => {
        if (level.current) level.current.rotate(rotateRight);
    }, 250);

    const handleMove = (direction) => {
        if (!player.current || !level.current) return;

        var currAngle = level.current.targetAngle % 360;
        currAngle = currAngle < 0 ? 360 + currAngle : currAngle;
        currAngle = Math.round(currAngle);

        if (currAngle === 0) {
            player.current.move({
                xDisp: direction === "topLeft" ? -1 : direction === "bottomRight" ? 1 : 0,
                zDisp: direction === "topRight" ? -1 : direction === "bottomLeft" ? 1 : 0,
            });
        } else if (currAngle === 90) {
            player.current.move({
                xDisp: direction === "bottomLeft" ? -1 : direction === "topRight" ? 1 : 0,
                zDisp: direction === "topLeft" ? -1 : direction === "bottomRight" ? 1 : 0,
            });
        } else if (currAngle === 180) {
            player.current.move({
                xDisp: direction === "bottomRight" ? -1 : direction === "topLeft" ? 1 : 0,
                zDisp: direction === "bottomLeft" ? -1 : direction === "topRight" ? 1 : 0,
            });
        } else if (currAngle === 270) {
            player.current.move({
                xDisp: direction === "topRight" ? -1 : direction === "bottomLeft" ? 1 : 0,
                zDisp: direction === "bottomRight" ? -1 : direction === "topLeft" ? 1 : 0,
            });
        }
    };

    // #################################################
    //   RENDER
    // #################################################

    const chromaScale = chroma.scale(["#000000", "#529aff"]);

    return (
        <div
            className="Game"
            ref={gameRef}
            style={{
                background: `linear-gradient(0deg, ${chromaScale(0.1).hex()} 0%, ${chromaScale(0.2).hex()} 100%)`,
            }}
        >
            <Gestures gameDimensions={gameDimensions} handleMove={handleMove} handleRotateBase={handleRotateBase} />
            <UI gameDimensions={gameDimensions} />
        </div>
    );
}

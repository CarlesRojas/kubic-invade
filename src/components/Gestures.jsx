import { useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { xyToIso } from "../game/utils";
import useDoubleClick from "../hooks/useDoubleClick";

export default function Gestures({ gameDimensions, handleMove, handleDoubleClick, onRotateX, onRotateY, onRotateZk }) {
    // #################################################
    //   GESTURES
    // #################################################

    const moveInitial = useRef({ x: 0, z: 0 });
    const moveThreshold = gameDimensions.width * 0.08;

    const moveGestureBind = useDrag(
        ({ event, first, down, movement: [mx, my] }) => {
            event.stopPropagation();

            if (first) moveInitial.current = { x: 0, z: 0 };

            if (down) {
                const { x, z } = xyToIso({ x: mx, y: my });

                const movX = x - moveInitial.current.x;
                const movZ = z - moveInitial.current.z;

                if (Math.abs(movX) > moveThreshold) {
                    moveInitial.current = { ...moveInitial.current, x };
                    handleMove(movX > 0 ? "bottomRight" : "topLeft");
                }

                if (Math.abs(movZ) > moveThreshold) {
                    moveInitial.current = { ...moveInitial.current, z };
                    handleMove(movZ > 0 ? "bottomLeft" : "topRight");
                }
            }
        },
        { filterTaps: true }
    );

    // #################################################
    //   DOUBLE CLICK
    // #################################################

    const doubleClickRef = useRef();
    useDoubleClick({ onDoubleClick: handleDoubleClick, ref: doubleClickRef });

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="Gestures">
            <div className="moveTetro" {...moveGestureBind()} ref={doubleClickRef}></div>
        </div>
    );
}

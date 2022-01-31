import SVG from "react-inlinesvg";
import chroma from "chroma-js";

import LeftIcon from "../resources/icons/left.svg";
import RightIcon from "../resources/icons/right.svg";

export default function UI({ gameDimensions }) {
    const chromaScale = chroma.scale(["#000000", "#529aff"]);

    return (
        <div className="UI">
            <div
                className="gameContainer"
                style={{ height: `${gameDimensions.height}px`, width: `${gameDimensions.width}px` }}
            >
                <div className="rotateBaseIcons" style={{ height: `${gameDimensions.width * 0.15}px` }}>
                    <SVG className="icon" src={LeftIcon} style={{ color: chromaScale(0.25).hex() }}></SVG>
                    <SVG className="icon" src={RightIcon} style={{ color: chromaScale(0.25).hex() }}></SVG>
                </div>
            </div>
        </div>
    );
}

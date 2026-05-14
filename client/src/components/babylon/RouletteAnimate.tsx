import { useScene, useBeforeRender } from "react-babylonjs";
import "@babylonjs/loaders/glTF";
import "@babylonjs/inspector";
import { useState } from "react";
import { RouletteMesh } from "./RouletteMesh";
import { Barrier } from "./Barrier";

interface RouletteAnimateProps {
    rpm: number;
    acc: boolean;
    pos: [number, number, number];
    winSpin: number;
}

export const RouletteAnimate = (props: RouletteAnimateProps) => {
    const { rpm, acc, pos, winSpin } = props;
    const [Z, setZ] = useState(0);

    const scene = useScene();
    const deltaTime = scene!.getEngine().getDeltaTime();
    useBeforeRender(
        () => {
            setZ(
                (prevZ) =>
                    prevZ + (rpm / 60) * Math.PI * 2 * (deltaTime / 1000),
            );
        },
        undefined,
        undefined,
        undefined,
        [rpm],
    );
    return (
        <>
            <RouletteMesh spin={Z} />
            {!acc ? (
                <Barrier winSpin={winSpin}  spin={Z} pos={pos} />
            ) : (
                    <Barrier winSpin={winSpin} spin={-Z} pos={pos} />
            )}
        </>
    );
};

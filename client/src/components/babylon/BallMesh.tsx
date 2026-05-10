import { Vector3 } from "@babylonjs/core";
import "react-babylonjs";

export const BallMesh = (props: any) => {
    const { pos } = props;
    const [x, y, z] = [...pos];

    return (
        <sphere
            name="ball"
            diameter={1}
            segments={32}
            position={new Vector3(x, y, z)}
        />
    );
};
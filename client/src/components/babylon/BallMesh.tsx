import { Vector3, Color3 } from "@babylonjs/core";
import "react-babylonjs";

export const BallMesh = (props: any) => {
    const { pos } = props;
    const [x, y, z] = [...pos];

    return (
        <sphere
            name="ball"
            diameter={0.8} // Un poco más pequeña para mayor realismo de escala
            segments={64} // Más segmentos para una redondez perfecta
            position={new Vector3(x, y, z)}
        >
            <pbrMaterial
                name="ball-material"
                albedoColor={new Color3(0.98, 0.98, 0.95)} // Blanco marfil sutil
                roughness={0.05} // Muy pulida, brillo nítido
                metallic={0.0} // Es cerámica/plástico, no metal
                environmentIntensity={1.5} // Captura bien los reflejos del estudio
                microSurface={1.0} // Superficie perfectamente lisa
                usePhysicalLightFalloff={true}
            />
        </sphere>
    );
};
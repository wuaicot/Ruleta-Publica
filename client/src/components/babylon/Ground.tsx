import { Vector3, Color3 } from "@babylonjs/core";
import "react-babylonjs";

export const Ground = () => {
    return (
        <ground
            name="ground"
            width={500} // Aumentamos el tamaño para que el espacio parezca infinito
            height={500}
            position={new Vector3(0, -50, 0)} // Lo bajamos un poco más para dar sensación de flotar
            rotation={new Vector3(-19.5, 0, 0)}
            receiveShadows
        >
            <pbrMaterial 
                name="deep-space" 
                albedoColor={new Color3(0, 0, 0.02)} // Azul marino profundo, casi negro
                emissiveColor={new Color3(0.05, 0, 0.1)} // Brillo sutil de nebulosa púrpura
                roughness={0.1}
                metallic={0.0}
                environmentIntensity={0.5}
            >
                {/* Usamos la textura de oro con un tiling extremo para crear "estrellas" minúsculas */}
                <texture 
                    url="./assets/Roulette/OroForRoulette.jpg" 
                    assignTo="emissiveTexture"
                    uScale={500} 
                    vScale={500}
                    level={2.0} // Intensidad de las estrellas
                />
            </pbrMaterial>
        </ground>
    );
};

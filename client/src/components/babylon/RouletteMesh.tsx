import { Task, TaskType, useAssetManager } from 'react-babylonjs';
import { Vector3, MeshAssetTask, Color3, PBRMaterial, Texture } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/inspector';
import { useEffect } from 'react';
import { BabylonMeshProps } from '../../types';
import { assetsURL, ROULETTE_POSITION } from '../../utils/utils';

export const RouletteMesh = (props: BabylonMeshProps) => {
	const { spin } = props;
	const modelAssetTasks: Task[] = [
		{
			taskType: TaskType.Mesh,
			rootUrl: `${assetsURL.roulette_new}/`,
			sceneFilename: 'scene.gltf',
			name: 'roulette',
		},
	];

	const assetManagerResult = useAssetManager(modelAssetTasks, {
		useDefaultLoadingScreen: true,
	});

	useEffect(() => {
		const rouletteTask = assetManagerResult.taskNameMap[
			'roulette'
		] as MeshAssetTask;
		const scene = rouletteTask.loadedMeshes[0].getScene();

		// Refinamiento Estético: Revestimiento de Nogal Real (NogalForRoulette)
		const woodMat = scene.getMaterialByName('wood.001') as PBRMaterial;
		if (woodMat) {
			const walnutTexture = new Texture("./assets/Roulette/Caoba.jpg", scene);
			walnutTexture.uScale = 1; 
			walnutTexture.vScale = 1;
			woodMat.albedoTexture = walnutTexture;
			woodMat.albedoColor = new Color3(1, 1, 1); 
			woodMat.roughness = 0.4; // Menos brillante para evitar destellos agresivos
			woodMat.metallic = 0.0;
			woodMat.environmentIntensity = 0.5; // Reducido drásticamente para evitar distorsión
		}

		const fabricMat = scene.getMaterialByName('CC0TexturesFabric0332K-JPG') as PBRMaterial;
		if (fabricMat) {
			fabricMat.albedoColor = new Color3(0.2, 0.02, 0.02);
			fabricMat.roughness = 0.9;
		}

		// Gilding Number Borders & All Metals: Oro de 24 Quilates Consistente
		scene.materials.forEach((mat) => {
			if (mat instanceof PBRMaterial) {
				const name = mat.name.toLowerCase();
				// Evitamos dorar los colores de la ruleta (rojo, negro, verde), la bola y el material de los números
				const isExcluded = ['green', 'black', 'material', 'ball1'].includes(name);
				
				// AJUSTE DE COLORES BASE (FONDOS)
				if (mat.name === 'material') {
					mat.albedoColor = new Color3(1, 0.02, 0.02); // Rojo vibrante
					mat.emissiveColor = new Color3(0, 0, 0);
					mat.metallic = 0.0;
					mat.roughness = 0.8;
				}

				if (name === 'green' || name === 'black') {
					mat.metallic = 0.0;
					mat.roughness = 0.8;
				}

				// AJUSTE REALISTA: Números Blanco Pintura "Casino"
				// Solo aplicamos a los materiales que EMPIEZAN con 'Material' (con M mayúscula)
				if (mat.name.startsWith('Material')) {
					mat.albedoColor = new Color3(1, 1, 1);
					mat.emissiveColor = new Color3(0.1, 0.1, 0.1); // Mínima luz para claridad, sin brillar
					mat.metallic = 0.0;
					mat.roughness = 0.4; // Acabado satinado/pintura real
					
					// Reducimos el grosor (extrusión) de las mallas que usan este material
					scene.meshes.forEach(mesh => {
						if (mesh.material === mat) {
							mesh.scaling = new Vector3(1, 0.1, 1); // Mucho más finos (menos extruidos)
						}
					});
				}

				// APLICACIÓN DE ORO MAESTRO: Uso de textura OroForRoulette.jpg
				const isMetallic = (mat.metallic !== null && mat.metallic !== undefined && mat.metallic > 0.5);
				if ((name.includes('metal') || isMetallic) && !isExcluded && !mat.name.startsWith('Material')) {
					const goldTexture = new Texture("./assets/Roulette/OroForRoulette.jpg", scene);
					goldTexture.uScale = 2; // Ajuste de escala para detalle fino
					goldTexture.vScale = 2;
					
					mat.albedoTexture = goldTexture;
					mat.albedoColor = new Color3(1, 0.85, 0.4); 
					mat.metallic = 1.0;
					mat.roughness = 0.3; // Aumentado para dispersar reflejos
					mat.environmentIntensity = 0.6; // Reducido para evitar distorsión visual
					mat.useMicroSurfaceFromReflectivityMapAlpha = true;
					mat.reflectivityColor = new Color3(1, 0.9, 0.6); // Reflejos dorados profundos
				}
			}
		});

		rouletteTask.loadedMeshes[0].position = ROULETTE_POSITION;
		rouletteTask.loadedMeshes[0].rotation = new Vector3(5.5, 0, 0);
        rouletteTask.loadedMeshes[0].scaling = new Vector3(8, 8, 8);
        //build in ground moved
		rouletteTask.loadedMeshes[2].position = new Vector3(200, 200, 200);
		rouletteTask.loadedMeshes[3].position = new Vector3(400, 400, 400);
		//20, 21, 22, 24, 25, 29, 30 numbers, besels and colors- moving wheel
		// Agregamos malla 23 para incluir la base del eje central (corona).
		// Malla 19 eliminada definitivamente (es un deflector estático del aro exterior).
		rouletteTask.loadedMeshes[20].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[21].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[22].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[23].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[24].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[25].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[27].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[28].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[29].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[30].rotation = new Vector3(0, spin, 0);

		// 31, 32 ball
		rouletteTask.loadedMeshes[31].position = new Vector3(200, 200, 200);
		rouletteTask.loadedMeshes[32].position = new Vector3(200, 200, 200);

		// eslint-disable-next-line
	}, [spin]);
	return null;
};

import { Task, TaskType, useAssetManager } from 'react-babylonjs';
import { Vector3, MeshAssetTask, Color3, PBRMaterial, Texture } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/inspector';
import { useEffect } from 'react';
import { BabylonMeshProps } from '../../types';
import { assetsURL } from '../../utils/utils';

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
			const walnutTexture = new Texture("./assets/Roulette/NogalForRoulette.jpg", scene);
			walnutTexture.uScale = 1; 
			walnutTexture.vScale = 1;
			woodMat.albedoTexture = walnutTexture;
			woodMat.albedoColor = new Color3(1, 1, 1); 
			woodMat.roughness = 0.15;
			woodMat.metallic = 0.0;
			woodMat.environmentIntensity = 1.2;
		}

		const fabricMat = scene.getMaterialByName('CC0TexturesFabric0332K-JPG') as PBRMaterial;
		if (fabricMat) {
			fabricMat.albedoColor = new Color3(0.2, 0.02, 0.02);
			fabricMat.roughness = 0.9;
		}

		// Gilding Number Borders & All Metals: Oro de 24 Quilates Consistente
		scene.materials.forEach((mat) => {
			if (mat instanceof PBRMaterial) {
				// Aplicamos oro a todo lo que sea metálico o tenga 'Metal' en el nombre
				const isMetallic = (mat.metallic !== null && mat.metallic !== undefined && mat.metallic > 0.5);
				if (mat.name.toLowerCase().includes('metal') || isMetallic) {
					mat.albedoColor = new Color3(0.95, 0.75, 0.2); // Oro Puro 24k
					mat.metallic = 1.0;
					mat.roughness = 0.1;
					mat.useMicroSurfaceFromReflectivityMapAlpha = true;
				}
			}
		});

		rouletteTask.loadedMeshes[0].position = new Vector3(0, 0, -12);
		rouletteTask.loadedMeshes[0].rotation = new Vector3(5.5, 0, 0);
        rouletteTask.loadedMeshes[0].scaling = new Vector3(8, 8, 8);
        //build in ground moved
		rouletteTask.loadedMeshes[2].position = new Vector3(200, 200, 200);
		rouletteTask.loadedMeshes[3].position = new Vector3(400, 400, 400);
		//20, 21, 22, 24, 25, 29, 30 numbers, besels and colors- moving wheel
		rouletteTask.loadedMeshes[20].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[21].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[22].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[27].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[28].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[24].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[25].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[29].rotation = new Vector3(0, spin, 0);
		rouletteTask.loadedMeshes[30].rotation = new Vector3(0, spin, 0);

		//31, 32 ball
		rouletteTask.loadedMeshes[31].position = new Vector3(200, 200, 200);
		rouletteTask.loadedMeshes[32].position = new Vector3(200, 200, 200);

		// eslint-disable-next-line
	}, [spin]);
	return null;
};

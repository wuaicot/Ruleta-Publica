import { Task, TaskType, useAssetManager } from 'react-babylonjs';
import { Vector3, MeshAssetTask } from '@babylonjs/core';
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

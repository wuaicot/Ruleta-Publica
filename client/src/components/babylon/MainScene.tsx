import { Engine, Scene } from 'react-babylonjs';
import { Vector3, Color3 } from '@babylonjs/core';
import { Suspense, useState, useEffect, useCallback } from 'react';
import { RouletteAnimate } from './RouletteAnimate';
import { gameStore } from '../../store/gameStore';
import { GameLoop } from '../../types';

export const MainScene = () => {
	const message = gameStore.msg;
	const RADIUS = 7;
	const assetCorrection = 0;//0
	const initialBallPos: [number, number, number] = [
		RADIUS,
		assetCorrection,
		-2,//-2
	];
	const [rpm, setRpm] = useState(1);
	const [winSpin, setWinSpin] = useState(0);
	const [acc, setAcc] = useState(false);
	const [pos, setPos] = useState(initialBallPos);
	const [cameraY, setCameraY] = useState(15);

	const accelerate = useCallback(() => {
		setAcc(true);
		const rpmAccInterval = setInterval(() => {
            setRpm((prevValue) => (prevValue += 10));
            	setPos((prevValue) => [
					prevValue[0] + 0.40,
					prevValue[1],
					prevValue[2] - .16,
				]);
		}, 500);

		setTimeout(() => {
			clearInterval(rpmAccInterval);
		}, 3000);
	}, []);

	const deccelerate = useCallback(() => {
		const rpmDecInterval = setInterval(() => {
			setRpm((prevValue) => (prevValue -= 6.50));
			setPos((prevValue) => [
				prevValue[0] - 0.26,
				prevValue[1],
				prevValue[2] + .10,
				
				
			]);
		}, 550);

		setTimeout(() => {
			setWinSpin(-gameStore.winSpin.winSpin);
			setAcc(false);
			clearInterval(rpmDecInterval);
		}, 5000);
	}, []);

	useEffect(() => {
		const animateZoom = (targetY: number, duration: number) => {
			const startY = cameraY;
			const startTime = performance.now();

			const step = (currentTime: number) => {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1);
				
				// Cubic Out Easing: f(t) = 1 - (1-t)^3
				const easeOutCubic = 1 - Math.pow(1 - progress, 3);
				const currentY = startY + (targetY - startY) * easeOutCubic;
				
				setCameraY(currentY);

				if (progress < 1) {
					requestAnimationFrame(step);
				}
			};

			requestAnimationFrame(step);
		};

		if (message) {
			if (message.gameStage === GameLoop.WINNER) {
				animateZoom(10, 1200); // Zoom in más rápido (1.2s)
			}
			if (message.gameStage === GameLoop.EMPTY_BOARD) {
				setPos(initialBallPos);
				setRpm(1); 
				animateZoom(15, 1000); // Zoom out más rápido y "snappy"
			}
			if (message.gameStage === GameLoop.NO_MORE_BETS) {
				setTimeout(() => {
					accelerate();
				}, 3000);
				setTimeout(() => {
					deccelerate();
				}, 6000);
			}
		}
		// eslint-disable-next-line
	}, [message]);

	return (
		<Engine antialias adaptToDeviceRatio canvasId='babylon-canvas'>
			<Scene>
				{/* 1. Entorno Espacial: Skybox de Estrellas y Nebulosa sutil */}
				<environmentHelper 
					options={{
						createGround: false,
						skyboxSize: 1000,
						skyboxColor: new Color3(0, 0, 0.05),
						environmentTexture: 'https://assets.babylonjs.com/environments/studio.env'
					}} 
				/>

				{/* 2. Luz de Estrellas Lejanas (Luz de Ambiente Fría) */}
				<hemisphericLight
					name='star-light'
					intensity={1}
					groundColor={new Color3(0, 0, 0.1)} // Reflejo azul espacial
					direction={Vector3.Up()}
				/>

				{/* 3. Luz de "Joyería" (Destellos en Oro y Madera) */}
				<pointLight
					name='jewelry-light'
					position={new Vector3(0, 8, -12)}
					intensity={0.8}
					diffuse={new Color3(1, 0.9, 0.7)} // Tono oro cálido
				/>

				<freeCamera
					name='camera1'
					position={new Vector3(0, cameraY, 0)}
					setTarget={[Vector3.Zero()]}
				/>

				{/* 4. Luz de Sombra Refinada */}
				<directionalLight
					name='shadow-light'
					intensity={0.6}
					direction={new Vector3(-1, -2, -0.5)}
					position={new Vector3(5, 12, 10)}
				>
					<shadowGenerator
						mapSize={2048}
						usePercentageCloserFiltering
						shadowCastChildren
					>
						<Suspense fallback={null}>
							<RouletteAnimate
								rpm={rpm}
								acc={acc}
								pos={pos}
								winSpin={winSpin}
							/>
						</Suspense>
					</shadowGenerator>
				</directionalLight>

			</Scene>
		</Engine>
	);
};
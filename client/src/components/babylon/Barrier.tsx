import { Vector3 } from '@babylonjs/core';
import { BallMesh } from './BallMesh';
import 'react-babylonjs';
import { ROULETTE_POSITION } from '../../utils/utils';

interface BarrierProps {
	spin: number;
	winSpin: number;
	pos: [number, number, number];
}

export const Barrier = (props: BarrierProps) => {
	const { spin, pos, winSpin } = props;

	// Alineamos el centro de la barrera (órbita de la bola) con la posición de la ruleta
	// Ajustamos Y para que el centro de rotación sea el plato de la ruleta
	const barrierPos = new Vector3(
		ROULETTE_POSITION.x, 
		ROULETTE_POSITION.y - 11, // Mantenemos el offset relativo original para el centro de rotación inclinado
		ROULETTE_POSITION.z + 12  // Compensamos el desplazamiento en Z de la ruleta
	);

	return (
		<sphere
			name='ball-barrier'
			diameter={15}
			segments={8}
			position={barrierPos}
			rotation={new Vector3(-5.5, 0,  -spin - winSpin + 11)}
		>
			<BallMesh pos={pos} />
			<standardMaterial name='barrier' alpha={0} />
		</sphere>
	);
};

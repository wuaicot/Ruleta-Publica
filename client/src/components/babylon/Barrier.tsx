import { Vector3 } from '@babylonjs/core';
import { BallMesh } from './BallMesh';

interface BarrierProps {
	spin: number;
	winSpin: number;
	pos: [number, number, number];
}

export const Barrier = (props: BarrierProps) => {
	const { spin, pos, winSpin } = props;

	return (
		<sphere
			name='ball-barrier'
			diameter={15}
			segments={8}
			position={new Vector3(0, -11, 0)}
			rotation={new Vector3(-5.5, 0,  -spin - winSpin + 11)}
		>
			<BallMesh pos={pos} />
			<standardMaterial name='barrier' alpha={0} />
		</sphere>
	);
};
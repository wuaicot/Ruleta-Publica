import { useCallback } from 'react';
import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { gameStore } from '../../store/gameStore';
import { BoardItem } from './BoardItem';
import { Chip } from './Chip';
import { matrix } from '../../utils/utils';
import { Bet } from '../../../../common/types';
import './Board.css';

export const Board = observer(() => {
	// eslint-disable-next-line
	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'chips',
		drop: (item: string | number, monitor) => {
			const location = monitor.getClientOffset();
			if (location) {
				const elem = document.elementFromPoint(location.x, location.y)!;
				return {
					name: elem.id,
					location: location,
				};
			}
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver({ shallow: false }),
		}),
	}));

	const trimItem = useCallback((item: string | number) => {
		return typeof item === 'string'
			? item.includes('_')
				? item.split('_')[0]
				: item
			: item;
	}, []);

	return (
		<div ref={drop} className='board-grid'>
			{matrix.map((row) =>
				row.map((tableItem) => (
					<BoardItem
						tableItem={trimItem(tableItem)}
						key={tableItem}
						id={tableItem}
					></BoardItem>
				)),
			)}
			{gameStore.bets !== null &&
				gameStore.bets.map((bet: Bet) => (
					<Chip
						id={bet.betChips[0].id}
						alt={bet.betChips[0].alt}
						url={bet.betChips[0].url}
						key={Math.random()}
						style={{
							top: bet.betLocation.y,
							left: bet.betLocation.x,
						}}
					/>
				))}
		</div>
	);
});

import { observer } from 'mobx-react';
import { useDrop } from 'react-dnd';
import { REDS, BLACKS } from '../../utils/utils';
import './BoardItem.css';

interface BoardItemProps {
	children?: React.ReactNode;
	tableItem: number | string;
	id: number | string;
}

function boardItemColorClass(tableItem: number | string): string {
	if (typeof tableItem === 'number') {
		return REDS.includes(tableItem)
			? 'item red'
			: BLACKS.includes(tableItem)
				? 'item black'
				: 'item plain';
	}
	if (typeof tableItem === 'string') {
		return tableItem === 'RED'
			? 'item red'
			: tableItem === 'BLACK'
				? 'item black'
				: 'item plain';
	}
	return 'item plain';
}

export const BoardItem = observer((props: BoardItemProps) => {
	const { tableItem, id } = props;

	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'chips',
		drop: (item: string | number, monitor) => {
			     const location = monitor.getClientOffset();
					if (location) {
						const elem = document.elementFromPoint(
							location.x,
							location.y,
						)!;
						return {
							name: elem.id,
							location: location,
						};
					}
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver({ shallow: true }),
		}),
	}));

	const dropHighlight = isOver
		? 'board-item-drop-target board-item-drop-target--over'
		: 'board-item-drop-target';

	return (
		<div
			ref={drop}
			className={`${boardItemColorClass(tableItem)} ${dropHighlight}`}
			id={id.toString()}
		>
			{tableItem}
		</div>
	);
});

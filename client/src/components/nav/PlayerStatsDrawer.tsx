import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { gameStore } from '../../store/gameStore';
// @ts-ignore: import CSS side-effect without type declarations
import './PlayerStatsDrawer.css';

interface PlayerStatsDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('es-CL', {
		style: 'currency',
		currency: 'CLP',
		maximumFractionDigits: 0,
	}).format(value);
};

export const PlayerStatsDrawer = observer((props: PlayerStatsDrawerProps) => {
	const { isOpen, onClose } = props;
	const profitOrLoss = gameStore.totalProfitOrLoss;
	const profitLossLabel = profitOrLoss >= 0 ? 'Ganancia total' : 'Perdida total';

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				onClose();
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isOpen, onClose]);

	return (
		<aside className={isOpen ? 'player-stats open' : 'player-stats'}>
			<h3>Resumen del jugador</h3>
			<ul>
				<li>
					<span>Saldo</span>
					<strong>{formatCurrency(gameStore.balance)}</strong>
				</li>
				<li>
					<span>Total apostado</span>
					<strong>{formatCurrency(gameStore.totalBetAmount)}</strong>
				</li>
				<li>
					<span>{profitLossLabel}</span>
					<strong>{formatCurrency(Math.abs(profitOrLoss))}</strong>
				</li>
			</ul>
		</aside>
	);
});

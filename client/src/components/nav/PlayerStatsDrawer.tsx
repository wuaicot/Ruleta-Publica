import { observer } from 'mobx-react';
import { gameStore } from '../../store/gameStore';
import './PlayerStatsDrawer.css';

interface PlayerStatsDrawerProps {
	isOpen: boolean;
}

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('es-CL', {
		style: 'currency',
		currency: 'CLP',
		maximumFractionDigits: 0,
	}).format(value);
};

export const PlayerStatsDrawer = observer((props: PlayerStatsDrawerProps) => {
	const { isOpen } = props;
	const profitOrLoss = gameStore.totalProfitOrLoss;
	const profitLossLabel = profitOrLoss >= 0 ? 'Ganancia total' : 'Perdida total';

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

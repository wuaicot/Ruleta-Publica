import { createContext } from 'react';
import { observable, action, computed, makeObservable } from 'mobx';
import { chipsColors, rouletteNumbers } from '../utils/utils';
import { GameData, Bet } from '../../../common/types';

export function chipsToSpawn(betAmount: number) {
	return chipsColors.filter((chip) => chip.value === betAmount);
}

export const indexSpin = (2 * Math.PI) / rouletteNumbers.length;
export function calculateWinSpin(winningNumber: number) {
	const winningNumberIndex = rouletteNumbers.indexOf(winningNumber);
	return +(winningNumberIndex * indexSpin).toFixed(2);
}

class GameStore {
	//observables
	playerId = '';
	boardItemOccupied = '';
	chipsTaken = 0;
	betLocation = { x: 0, y: 0 };
	bets: Bet[] = [];
	msg: GameData | null;
	startingBalance = 1000;
	balance = 1000;

	//actions

	setPlayerId(id: string) {
		this.playerId = id;
	}
	setBoardItemOccupied(newBoardItem: string) {
		this.boardItemOccupied = newBoardItem;
	}

	setChipsTaken(newChips: number) {
		this.chipsTaken = newChips;
	}

	setBetLocation(location: { x: number; y: number }) {
		this.betLocation = location;
	}

	setAllBets(newBetItem: Bet) {
		this.bets.push(newBetItem);
	}

	setBoardClear() {
		this.bets.splice(0, this.bets.length);
	}

	setMsg(newMessage: GameData | null) {
		this.msg = newMessage;
	}

	applyRoundSettlement(winAmount: number) {
		const roundBet = this.totalBetAmount;
		this.balance = this.balance - roundBet + winAmount;
	}

	resetSessionBalance() {
		this.balance = this.startingBalance;
	}

	// computed and tracking function
	get newBet() {
		return {
			betAmount: this.chipsTaken,
			betSpot: this.boardItemOccupied,
			betChips: chipsToSpawn(this.chipsTaken),
			betLocation: this.betLocation,
		};
	}

	get gameData() {
		return {
			playerId: this.playerId,
			bets: this.bets,
		};
	}

	get winSpin() {
		return {
			winSpin: calculateWinSpin(this.msg!.winningNumber!),
		};
	}

	get totalBetAmount() {
		return this.bets.reduce((sum, bet) => sum + bet.betAmount, 0);
	}

	get totalProfitOrLoss() {
		return this.balance - this.startingBalance;
	}

	constructor(
		initialId: string,
		initialBoard: string,
		initialChips: number,
		initialLocation: { x: number; y: number },
		initialMessage: null,
	) {
		this.playerId = initialId;
		this.boardItemOccupied = initialBoard;
		this.chipsTaken = initialChips;
		this.betLocation = initialLocation;
		this.msg = initialMessage;
		makeObservable(this, {
			playerId: observable,
			boardItemOccupied: observable,
			chipsTaken: observable,
			betLocation: observable,
			bets: observable,
			msg: observable,
			balance: observable,
			setPlayerId: action.bound,
			setBoardItemOccupied: action.bound,
			setChipsTaken: action.bound,
			setBetLocation: action.bound,
			setAllBets: action.bound,
			setMsg: action.bound,
			setBoardClear: action.bound,
			applyRoundSettlement: action.bound,
			resetSessionBalance: action.bound,
			newBet: computed,
			gameData: computed,
			winSpin: computed,
			totalBetAmount: computed,
			totalProfitOrLoss: computed,
		});
	}
}
export const gameStore = new GameStore('', '', 0, { x: 0, y: 0 }, null);
export const GameContext = createContext<GameStore>(gameStore);

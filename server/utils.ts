import { BLACKS, REDS } from '../common/utils';
import { Winner, ClientData, Bet } from '../common/types';

export const isIdUnique = (array: Winner[] | ClientData[], id: string) => {
	return array.map(
		(item) => JSON.stringify(item.playerId) !== JSON.stringify(id),
	);
};

export const isUserDataUnique = (
	uniqueData: ClientData[],
	usersData: ClientData[],
) => {
	uniqueData.splice(0, uniqueData.length);
	const seen = new Set<string>();
	// Recorremos desde el final para obtener los datos más recientes, sin mutar usersData
	for (let i = usersData.length - 1; i >= 0; i--) {
		if (!seen.has(usersData[i].playerId)) {
			uniqueData.push(usersData[i]);
			seen.add(usersData[i].playerId);
		}
	}
};

export const resetBoard = (winners: Winner[], uniqueData: ClientData[]) => {
	winners.map((winner) => (winner.win = 0));
	uniqueData.splice(0, uniqueData.length);
};

export const getRandomNumber = (min: number, max: number) => {
	const minValue = Math.ceil(min);
	const maxValue = Math.floor(max);
	return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
};

export const calculateWinners = (
	winners: Winner[],
	uniqueData: ClientData[],
	winningNumber: number,
) => {
	for (let i = 0; i < uniqueData.length; i++) {
		for (let j = 0; j < winners.length; j++) {
			if (uniqueData[i].playerId === winners[j].playerId) {
				winners[j].win = calculateWin(
					winningNumber,
					uniqueData[i].bets,
				);
			}
		}
	}
};

enum BetTypes {
	NUMBER = 'number',
	ZERO = 'zero',
	BLACK = 'black',
	RED = 'red',
	EVEN = 'even',
	ODD = 'odd',
	FIRST_LINE = 'first_line',
	SECOND_LINE = 'second_line',
	THIRD_LINE = 'third_line',
	NUMBERS_1_18 = 'numbers_1_18',
	NUMBERS_19_36 = 'numbers_19_36',
	NUMBERS_1_12 = 'numbers_1_12',
	NUMBERS_2_12 = 'numbers_2_12',
	NUMBERS_3_12 = 'numbers_3_12',
}

const getBetType = (betSpot: number | string) => {
	switch (betSpot) {
		case '1ST12':
			return 'numbers_1_12';
			break;
		case '2ND12':
			return 'numbers_2_12';
			break;
		case '3RD12':
			return 'numbers_3_12';
			break;
		case '1TO18':
			return 'numbers_1_18';
			break;
		case '19TO36':
			return 'numbers_19_36';
			break;
		case '2TO1_1':
			return 'first_line';
			break;
		case '2TO1_2':
			return 'second_line';
			break;
		case '2TO1_3':
			return 'third_line';
			break;
		case 'RED':
			return 'red';
			break;
		case 'BLACK':
			return 'black';
			break;
		case 'EVEN':
			return 'even';
			break;
		case 'ODD':
			return 'odd';
			break;
		case '0':
			return 'zero';
			break;
		default:
			return 'number';
	}
};

export const calculateLineNumbers = (line: string) => {
	const lineNumbersArray = [];
	let currentNumber = line.includes('first')
		? 1
		: line.includes('second')
		? 2
		: 3;
	for (let i = currentNumber; i <= 36; i += 3) {
		lineNumbersArray.push(i);
	}
	return lineNumbersArray;
};

export const calculateWin = (winningNumber: number, bets: Bet[]) => {
	let win = 0;
	const userBets = bets;
	for (let i = 0; i < userBets.length; i++) {
		const betType = getBetType(userBets[i].betSpot);
		if (
			betType === BetTypes.NUMBER &&
			winningNumber.toString() === userBets[i].betSpot
		) {
			win += userBets[i].betAmount * 36;
		} else if (
			betType === BetTypes.NUMBERS_1_12 &&
			winningNumber > 0 &&
			winningNumber < 13
		) {
			win += userBets[i].betAmount * 3;
		} else if (
			betType === BetTypes.NUMBERS_2_12 &&
			winningNumber > 12 &&
			winningNumber < 25
		) {
			win += userBets[i].betAmount * 3;
		} else if (
			betType === BetTypes.NUMBERS_3_12 &&
			winningNumber > 24 &&
			winningNumber < 37
		) {
			win += userBets[i].betAmount * 3;
		} else if (
			betType === BetTypes.FIRST_LINE &&
			calculateLineNumbers(BetTypes.FIRST_LINE).includes(winningNumber)
		) {
			win += userBets[i].betAmount * 3;
		} else if (
			betType === BetTypes.SECOND_LINE &&
			calculateLineNumbers(BetTypes.SECOND_LINE).includes(winningNumber)
		) {
			win += userBets[i].betAmount * 3;
		} else if (
			betType === BetTypes.THIRD_LINE &&
			calculateLineNumbers(BetTypes.THIRD_LINE).includes(winningNumber)
		) {
			win += userBets[i].betAmount * 3;
		} else if (betType === BetTypes.ODD && winningNumber % 2 !== 0) {
			win += userBets[i].betAmount * 2;
		} else if (betType === BetTypes.EVEN && winningNumber % 2 === 0) {
			win += userBets[i].betAmount * 2;
		} else if (betType === BetTypes.RED && REDS.includes(winningNumber)) {
			win += userBets[i].betAmount * 2;
		} else if (
			betType === BetTypes.BLACK &&
			BLACKS.includes(winningNumber)
		) {
			win += userBets[i].betAmount * 2;
		} else if (
			betType === BetTypes.NUMBERS_1_18 &&
			winningNumber > 0 &&
			winningNumber < 19
		) {
			win += userBets[i].betAmount * 2;
		} else if (
			betType === BetTypes.NUMBERS_19_36 &&
			winningNumber > 18 &&
			winningNumber < 37
		) {
			win += userBets[i].betAmount * 2;
		} else if (betType === BetTypes.ZERO && winningNumber === 0) {
			win += userBets[i].betAmount * 36;
		}
	}
	return win;
};

export const EVENTS = {
	CONNECTION: 'connection',
	CLIENT: {
		JOIN_GAME: 'join_game',
		CLIENT_DATA: 'client_data',
		CLOSE: 'disconnect'
	},
	SERVER: {
		JOINED_GAME: 'joined_game',
		STAGE_CHANGE: 'stage_change'
	},
};

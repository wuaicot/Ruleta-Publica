import express, { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import config from 'config';
import { Timer } from 'easytimer.js';
import { GameLoop, GameData, Winner, ClientData } from '../common/types';
import {
	isUserDataUnique,
	getRandomNumber,
	resetBoard,
	calculateWinners,
	EVENTS,
} from './utils';

const port = config.get<number>('port');
const host = config.get<string>('host');
const corsOrigin = config.get<string | boolean>('corsOrigin');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: corsOrigin,
		credentials: true,
	},
});

app.get('/', (_: Request, res: Response) => {
	res.send('server is running on port 8888');
});

const timer = new Timer();

let gameStage: GameLoop = GameLoop.PLACE_BET;
let winningNumber: number;
const winners: Winner[] = [];
let win = 0;
let clientData: ClientData = { playerId: '', bets: [] };
const usersData: ClientData[] = [];
const uniqueData: ClientData[] = [];
/** Maps Socket.IO connection id → client playerId so disconnect removes the right winner row */
const socketPlayerIds = new Map<string, string>();
/** Maps playerId → current balance */
const userBalances = new Map<string, number>();

const INITIAL_BALANCE = 1000;

const sendGameData = (gameData: GameData & { userBalances?: Record<string, number> }) => {
	io.emit(EVENTS.SERVER.STAGE_CHANGE, JSON.stringify(gameData));
};

const saveClientsData = (socketId: string, data: string) => {
	const incomingData: ClientData = JSON.parse(data);
	const pid = incomingData.playerId;

	if (!pid) return;

	// Initialize balance if new user
	if (!userBalances.has(pid)) {
		userBalances.set(pid, INITIAL_BALANCE);
	}

	const currentBalance = userBalances.get(pid) || 0;
	const totalBet = incomingData.bets.reduce((sum, bet) => sum + bet.betAmount, 0);

	// Security Validation: Ensure user has enough balance
	if (totalBet > currentBalance) {
		console.log(`[SECURITY] Player ${pid} attempted to bet ${totalBet} with balance ${currentBalance}`);
		// In a real scenario, we might want to send an error event back to this specific socket
		return;
	}

	clientData = incomingData;
	usersData.push(clientData);
};

timer.addEventListener('secondsUpdated', function () {
	const currentTime = timer.getTimeValues().seconds;
	
	// Prepare balance record for the current connected users to sync UI
	const balancesRecord: Record<string, number> = {};
	userBalances.forEach((bal, id) => {
		balancesRecord[id] = bal;
	});

	const gameData: GameData & { balances?: Record<string, number> } = {
		gameStage: gameStage,
		gameTimer: currentTime,
		winningNumber: winningNumber,
		winners: winners,
		balances: balancesRecord,
	};
	sendGameData(gameData);
	switch (currentTime) {
		case 1:
			gameStage = GameLoop.PLACE_BET;
			break;
		case 25:
			gameStage = GameLoop.NO_MORE_BETS;
			break;
		case 28:
			winningNumber = getRandomNumber(0, 36);
			isUserDataUnique(uniqueData, usersData);
			gameStage = GameLoop.SPIN_WHEEL;
			break;
		case 40:
			calculateWinners(winners, uniqueData, winningNumber);
			// Update balances based on wins/losses
			uniqueData.forEach(client => {
				const pid = client.playerId;
				const currentBalance = userBalances.get(pid) || 0;
				const totalBet = client.bets.reduce((sum, bet) => sum + bet.betAmount, 0);
				const winAmount = winners.find(w => w.playerId === pid)?.win || 0;
				
				// New Balance = Old Balance - Total Bet + Win
				userBalances.set(pid, currentBalance - totalBet + winAmount);
			});
			gameStage = GameLoop.WINNER;
			break;
		case 50:
			resetBoard(winners, uniqueData);
			gameStage = GameLoop.EMPTY_BOARD;
			break;
		case 55:
			timer.reset();
			break;
	}
	return;
});

io.on(EVENTS.CONNECTION, (socket: Socket) => {
	socket.on(EVENTS.CLIENT.JOIN_GAME, (data: string) => {
		timer.start();
		saveClientsData(socket.id, data);
		if (clientData.playerId) {
			socketPlayerIds.set(socket.id, clientData.playerId);
		}
	});
	socket.on(EVENTS.CLIENT.CLIENT_DATA, (data: string) => {
		saveClientsData(socket.id, data);
		const pid = clientData.playerId;
		if (pid) {
			socketPlayerIds.set(socket.id, pid);
		}
		if (!pid) return;
		if (!winners.some((w) => w.playerId === pid)) {
			winners.push({ playerId: pid, win });
		}
	});
	socket.on('disconnect', () => {
		const pid = socketPlayerIds.get(socket.id);
		socketPlayerIds.delete(socket.id);
		if (!pid) return;
		const indexToRemove = winners.findIndex((w) => w.playerId === pid);
		if (indexToRemove !== -1) {
			winners.splice(indexToRemove, 1);
		}
	});
});

httpServer.listen(port, host, () => {
	console.log('server is running on port 8888');
});

import express from 'express';
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

app.get('/', (_, res) => {
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

const sendGameData = (gameData: GameData) => {
	io.emit(EVENTS.SERVER.STAGE_CHANGE, JSON.stringify(gameData));
};

const saveClientsData = (data: string) => {
	clientData = JSON.parse(data);
	usersData.push(clientData);
};

timer.addEventListener('secondsUpdated', function () {
	const currentTime = timer.getTimeValues().seconds;
	const gameData: GameData = {
		gameStage: gameStage,
		gameTimer: currentTime,
		winningNumber: winningNumber,
		winners: winners,
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
			gameStage = GameLoop.WINNER;
			break;
		case 50:
			resetBoard(winners, uniqueData);
			gameStage = GameLoop.EMPTY_BOARD;
	}
	return;
});

io.on(EVENTS.CONNECTION, (socket: Socket) => {
	socket.on(EVENTS.CLIENT.JOIN_GAME, (data: string) => {
		timer.start();
		saveClientsData(data);
		if (clientData.playerId) {
			socketPlayerIds.set(socket.id, clientData.playerId);
		}
	});
	socket.on(EVENTS.CLIENT.CLIENT_DATA, (data: string) => {
		saveClientsData(data);
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

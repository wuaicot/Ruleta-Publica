import { useState, useCallback, useContext, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { gameStore, GameContext } from '../store/gameStore';
import { SOCKET_URL } from '../config/default';
import { EVENTS } from '../utils/utils';
import { GameData, GameLoop } from '../types';

export const useServer = () => {
	const [error, setError] = useState('');
	const socketRef = useRef<Socket | null>(null);
	const { setMsg } = useContext(GameContext);
	const prevStageRef = useRef<GameLoop | undefined>(undefined);

	const connect = useCallback(() => {
		setError('');
		try {
			if (!socketRef.current) {
				const socket = io(SOCKET_URL, {
					transports: ['websocket', 'polling'],
				});
				socketRef.current = socket;

				socket.on('connect_error', () => {
					setError(
						`something went wrong with connection to ${SOCKET_URL}, try again`,
					);
				});

				socket.on(EVENTS.SERVER.STAGE_CHANGE, (value: string) => {
					console.log("Socket STAGE_CHANGE received:", value);
					const message: GameData = JSON.parse(value);
					setMsg(message);

					// Sync authoritative balance from server
					if (message.balances && gameStore.playerId && message.balances[gameStore.playerId] !== undefined) {
						gameStore.syncBalance(message.balances[gameStore.playerId]);
					}

					const currentStage = message.gameStage;
					const previousStage = prevStageRef.current;
					if (
						currentStage === GameLoop.WINNER &&
						previousStage !== GameLoop.WINNER &&
						gameStore.playerId
					) {
						const myWinner = message.winners.find(
							(winner) => winner.playerId === gameStore.playerId,
						);
						gameStore.applyRoundSettlement(myWinner?.win ?? 0);
					}
					prevStageRef.current = currentStage;
					
					// Solo enviar si el usuario tiene balance suficiente o no está apostando más de lo permitido
					if (gameStore.totalBetAmount <= gameStore.balance) {
						socket.emit(
							EVENTS.CLIENT.CLIENT_DATA,
							JSON.stringify(gameStore.gameData),
						);
					}
				});

				socket.on(EVENTS.SERVER.JOINED_GAME, (value: string) => {
					console.log(JSON.parse(value));
				});
			}

			socketRef.current.emit(
				EVENTS.CLIENT.JOIN_GAME,
				JSON.stringify(gameStore.gameData),
			);
		} catch (e) {
			setError((e as Error).message);
		}
	}, [setMsg]);

	const disconnect = useCallback(() => {
		socketRef.current?.disconnect();
		socketRef.current = null;
		prevStageRef.current = undefined;
	}, []);

	return { error, connect, disconnect };
};

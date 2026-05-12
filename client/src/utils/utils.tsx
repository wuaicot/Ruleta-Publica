import { Vector3 } from '@babylonjs/core';

export const assetsURL = {
	orange: './assets/chip-10.png',
	green: './assets/chip-25.png',
	blue: './assets/chip-50.png',
	yellow: './assets/chip-100.png',
	red: './assets/chip-500.png',
	grass: './assets/grass.png',
	roulette: './assets/Roulette',
	roulette_new: './assets/roulette_new',
	soundtrack: './assets/My-Dark-Passenger.mp3',
	soundIcon: './assets/icons8-audio-64.png',
};

export const chipsColors = [
	{
		url: assetsURL.orange,
		alt: 'chip orange value 10',
		value: 10,
		id: '10',
	},
	{
		url: assetsURL.green,
		alt: 'chip green value 25',
		value: 25,
		id: '25',
	},
	{
		url: assetsURL.blue,
		alt: 'chip blue value 50',
		value: 50,
		id: '50',
	},
	{
		url: assetsURL.yellow,
		value: 100,
		alt: 'chip yellow value 100',
		id: '100',
	},
	{
		url: assetsURL.red,
		value: 500,
		alt: 'chip red value 500',
		id: '500',
	},
];

export const matrix = [
	[0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, '2TO1_3'],
	[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, '2TO1_2'],
	[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, '2TO1_1'],
	['1ST12', '2ND12', '3RD12'],
	['1TO18', 'EVEN', 'RED', 'BLACK', 'ODD', '19TO36'],
];

export const REDS = [
	1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
export const BLACKS = [
	2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35,
];

export const rouletteNumbers = [
	0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
	24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

export const EVENTS = {
	CONNECTION: 'connection',
	CLIENT: {
		JOIN_GAME: 'join_game',
		CLIENT_DATA: 'client_data',
		CLOSE: 'disconnect',
	},
	SERVER: {
		JOINED_GAME: 'joined_game',
		STAGE_CHANGE: 'stage_change',
	},
};

export const ROULETTE_POSITION = new Vector3(0, 0, -10); // Posición centrada según preferencia del usuario

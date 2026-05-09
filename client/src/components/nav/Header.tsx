import { useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GameContext } from '../../store/gameStore';
import { Button } from '../../UI/Button';
import { Audio } from './Audio';
import { assetsURL } from '../../utils/utils';
import { PlayerStatsDrawer } from './PlayerStatsDrawer';
import './Header.css';

interface HeaderProps {
	connect: () => void;
	disconnect: () => void;
}

export const Header = (props: HeaderProps) => {
	const { connect, disconnect } = props;
	const [loggedIn, setLoggedIn] = useState(false);
	const [showStats, setShowStats] = useState(false);
	const { setPlayerId, resetSessionBalance, setBoardClear } =
		useContext(GameContext);

	const logInHandler = useCallback(() => {
		setLoggedIn(true);
		resetSessionBalance();
		setBoardClear();
		const id = uuidv4();
		setPlayerId(id);
		connect();
	}, [connect, resetSessionBalance, setBoardClear, setPlayerId]);

	const logOutHandler = useCallback(() => {
		setLoggedIn(false);
		setPlayerId('');
		setBoardClear();
		resetSessionBalance();
		disconnect();
	}, [disconnect, resetSessionBalance, setBoardClear, setPlayerId]);

	const toggleStats = useCallback(() => {
		setShowStats((prev) => !prev);
	}, []);

	return (
		<nav className='header'>
			<a
				href='https://www.roulettesites.org/rules/'
				rel='noreferrer'
				target='blank'
			>
				<Button className='logo'>Ruleta Pública</Button>
			</a>
			<Button className='stats-toggle-button' onClick={toggleStats}>
				Mi info.
			</Button>
			<div className='audio-login-container'>
				{!loggedIn && (
					<Button className='login-button' onClick={logInHandler}>
						Iniciar sesión
					</Button>
				)}
				{loggedIn && (
					<Button className='logout-button' onClick={logOutHandler}>
						Terminar Sesión
					</Button>
				)}
				<Audio url={assetsURL.soundtrack} loop={true} />
			</div>
			<PlayerStatsDrawer isOpen={showStats} />
		</nav>
	);
};

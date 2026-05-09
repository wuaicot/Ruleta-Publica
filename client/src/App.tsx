import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { gameStore, GameContext } from './store/gameStore';
import { Error } from './components/difStates/Error';
import { Header } from './components/nav/Header';
import { Dashboard } from './components/nav/Dashboard';
import { Board } from './components/board/Board';
import { Chips } from './components/board/Chips';
import { useServer } from './hooks/useServer';
import { GameLoop, GameData } from './types';
import './App.css';
import { useCallback } from 'react';
import { observer } from 'mobx-react';

function App() {
	const { error, connect, disconnect } = useServer();

	const setPointerEvents = useCallback((message: GameData | null) => {
		if (error) return 'App no-pointers';
		if (!message) return 'App';
		return message.gameStage === GameLoop.PLACE_BET
			? 'App'
			: 'App no-pointers';
	}, [error]);

	return (
		<DndProvider backend={HTML5Backend}>
			<div className={setPointerEvents(gameStore.msg)}>
				<GameContext.Provider value={gameStore}>
					{/* {loading && <Loader loading={loading} />} */}
					{error && <Error error={error} />}
					<Header connect={connect} disconnect={disconnect} />
					<Dashboard />
					<Board />
					<Chips />
				</GameContext.Provider>
			</div>
		</DndProvider>
	);
}

export default observer(App);

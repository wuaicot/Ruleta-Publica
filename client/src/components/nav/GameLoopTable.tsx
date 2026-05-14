import { useContext, useCallback } from "react";
import { observer } from "mobx-react";
import { GameContext, gameStore } from "../../store/gameStore";
import { GameLoop, GameData, Winner } from "../../types";
import "./GameLoopTable.css";

function winnerItemClassName(winnerId: string, playerId: string): string {
    return winnerId === playerId ? "winner-item-mine" : "winner-item";
}

export const GameLoopTable = observer(() => {
    const { setBoardClear } = useContext(GameContext);
    const message = gameStore.msg;
    console.log("GameLoopTable message:", message);

    const getContent = useCallback((message: GameData) => {
        let content;
        if (message) {
            if (
                message.gameStage === GameLoop.PLACE_BET ||
                message.gameStage === GameLoop.NO_MORE_BETS
            ) {
                content = message.gameStage;
            } else if (
                message.winningNumber &&
                message.gameStage === GameLoop.SPIN_WHEEL
            ) {
                content = `Atenciòn a la ruleta`;
            } else if (
                message.winningNumber &&
                message.gameStage === GameLoop.WINNER
            ) {
                content = `El numero ganador es ${message.winningNumber}`;
            } else if (
                message.winningNumber &&
                message.gameStage === GameLoop.EMPTY_BOARD
            ) {
                setBoardClear();
                content = "Prepàrece para la siguiente ronda";
            }
            return content;
        }
    }, [setBoardClear]);

    const getStageStart = (stage: string | undefined): number => {
        switch (stage) {
            case GameLoop.PLACE_BET: return 0;
            case GameLoop.NO_MORE_BETS: return 25;
            case GameLoop.SPIN_WHEEL: return 28;
            case GameLoop.WINNER: return 40;
            case GameLoop.EMPTY_BOARD: return 50;
            default: return 0;
        }
    };

    const getDurationForStage = (stage: string | undefined): number => {
        switch (stage) {
            case GameLoop.PLACE_BET: return 25;
            case GameLoop.NO_MORE_BETS: return 3;
            case GameLoop.SPIN_WHEEL: return 12;
            case GameLoop.WINNER: return 10;
            case GameLoop.EMPTY_BOARD: return 5;
            default: return 25;
        }
    };

    const calculateWidth = (message: GameData): number => {
        const stageStart = getStageStart(message.gameStage);
        const total = getDurationForStage(message.gameStage);
        const elapsedInStage = Math.max(0, message.gameTimer - stageStart);
        const percentage = Math.max(0, Math.min(100, ((total - elapsedInStage) / total) * 100));
        return percentage;
    };

    return (
        <div className="table-container">
            {message && (
                <>
                    <h2 className="game-stage">{getContent(message)}</h2>
                    <div className="progress-container">
                        <div 
                            className="progress-bar"
                            style={{ width: `${calculateWidth(message)}%` }}
                        />
                    </div>
                    <ul className="winners-list">
                        {message.winners.map((winner: Winner) => (
                            <li
                                className="winner-item-wrapper"
                                key={winner.playerId}
                            >
                                <div
                                    className={winnerItemClassName(
                                        winner.playerId,
                                        gameStore.playerId,
                                    )}
                                >
                                    <p className="user-id">
                                        User id: {winner.playerId}
                                    </p>
                                    <p className="win">Win: {winner.win}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
});

import { observer } from "mobx-react";
import { useContext, useEffect } from "react";
import { GameContext } from "../../store/gameStore";
import { REDS, BLACKS } from "../../utils/utils";
import { GameLoop } from "../../types";
import "./latest_results.css";

export const LatestResults = observer(() => {
    const { history, msg, addResult } = useContext(GameContext);

    useEffect(() => {
        if (msg && msg.gameStage === GameLoop.WINNER && msg.winningNumber !== undefined) {
            addResult(msg.winningNumber);
        }
    }, [msg, addResult]);

    const getNumberColor = (num: number) => {
        if (num === 0) return "result-green";
        if (REDS.includes(num)) return "result-red";
        if (BLACKS.includes(num)) return "result-black";
        return "";
    };

    return (
        <div className="latest-results-vertical">
            <div className="latest-results-title">←</div>
            <div className="results-vertical-list">
                {history.map((num, index) => (
                    <div key={index} className={`result-vertical-item ${getNumberColor(num)}`}>
                        {num}
                    </div>
                ))}
            </div>
            <div className="latest-results-title"> ←</div>
        </div>
    );
});

import React, { useEffect, useState } from 'react'
import styles from './Results.module.css'
import { useGame } from '@/context/GameContext';
import { Player, WSMessageType } from '../GameTableScreen/GameTableScreen';

enum RESULTS {
    Winner = "winner",
    Loser = "loser",
    Push = "push",
}

export default function Results() {
    const { gameState, playerId } = useGame();
    const [result, setResult] = useState<RESULTS>(RESULTS.Loser);  

    useEffect(() => {
        if (!gameState || gameState.state !== WSMessageType.END_GAME) {
            return;
        }

        console.log("Game state:", gameState);
        console.log("Player id:", playerId);
        console.log("Players:", gameState.winners.map((p: Player) => String(p.id)));

        if (gameState.winners.find((p: Player) => p.id === playerId)) {
            setResult(RESULTS.Winner);
        } else if (gameState.pushes.find((p: Player) => p.id === playerId)) {
            setResult(RESULTS.Push);
        } else {
            setResult(RESULTS.Loser);
        }
    }, [gameState, playerId]);

    if (!gameState || gameState.state !== WSMessageType.END_GAME) {
        return null;
    }

    return (
        <div className={styles.resultsContainer}>
            <span className={styles[result]}>
                {
                    result === RESULTS.Winner ? "WINNER" :
                    result === RESULTS.Loser ? "LOSER" :
                    result === RESULTS.Push ? "PUSH" :
                    "ERROR"
                }
            </span>
        </div>
    )
}

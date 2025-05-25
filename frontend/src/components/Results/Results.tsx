import React, { useEffect, useRef, useState } from 'react'
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
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!gameState || gameState.state !== WSMessageType.END_GAME) {
            return;
        }

        let audioSrc = '/assets/sounds/loser.mp3';
        setResult(RESULTS.Loser);

        if (gameState.winners.find((p: Player) => p.id === playerId)) {
            setResult(RESULTS.Winner);
            audioSrc = '/assets/sounds/winner.mp3';
        } else if (gameState.pushes.find((p: Player) => p.id === playerId)) {
            setResult(RESULTS.Push);
            audioSrc = '/assets/sounds/push.mp3';
        }

        audioRef.current = new Audio(audioSrc);
        audioRef.current.play().catch(console.error);

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

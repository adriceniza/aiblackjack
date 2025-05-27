import React, { useEffect, useRef, useState } from 'react'
import styles from './Results.module.css'
import { useGame } from '@/context/GameContext';
import { Player, WSMessageType } from '../GameTableScreen/GameTableScreen';
import useSound from "use-sound";

enum RESULTS {
  Winner = "winner",
  Loser = "loser",
  Push = "push",
}

export default function Results() {
  const { gameState, player } = useGame();
  const [result, setResult] = useState<RESULTS>(RESULTS.Loser);

  const [playWinnerSound] = useSound("/assets/sounds/winner.mp3");
  const [playLoserSound] = useSound("/assets/sounds/loser.mp3");
  const [playPushSound] = useSound("/assets/sounds/push.mp3");

  useEffect(() => {
    if (!gameState || gameState.state !== WSMessageType.END_GAME) {
      return;
    }

    setResult(RESULTS.Loser);

    if (gameState.winners.find((p: Player) => p.id === player.id)) {
      setResult(RESULTS.Winner);
      playWinnerSound();

      return;
    } else if (gameState.pushes.find((p: Player) => p.id === player.id)) {
      setResult(RESULTS.Push);
      playPushSound();

      return;
    }

    playLoserSound();
  }, [gameState, player]);

  if (!gameState || gameState.state !== WSMessageType.END_GAME) {
    return null;
  }
  return (
    <div className={styles.resultsContainer}>
      <span className={styles[result]}>
        {result === RESULTS.Winner
          ? "WINNER"
          : result === RESULTS.Loser
          ? "LOSER"
          : result === RESULTS.Push
          ? "PUSH"
          : "ERROR"}
      </span>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import styles from "./Results.module.css";
import { useGame } from "@/context/GameContext";
import useSound from "use-sound";
import { GameState } from "@/types/game";
import { PlayerDTO } from "@/types/player";

enum RESULTS {
  Winner = "winner",
  Loser = "loser",
  Push = "push",
}

export default function Results() {
  const { state, player, winners, pushes } = useGame();
  const [result, setResult] = useState<RESULTS>(RESULTS.Loser);

  const [playWinnerSound] = useSound("/assets/sounds/winner.mp3");
  const [playLoserSound] = useSound("/assets/sounds/loser.mp3");
  const [playPushSound] = useSound("/assets/sounds/push.mp3");

  useEffect(() => {
    if (!state || state !== GameState.ROUND_ENDED) {
      return;
    }

    setResult(RESULTS.Loser);

    if (winners?.find((p: PlayerDTO) => p.id === player?.id)) {
      setResult(RESULTS.Winner);
      playWinnerSound();

      return;
    } else if (pushes?.find((p: PlayerDTO) => p.id === player?.id)) {
      setResult(RESULTS.Push);
      playPushSound();

      return;
    }

    playLoserSound();
  }, [state, player, pushes, winners]);

  if (!state || state !== GameState.ROUND_ENDED) {
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

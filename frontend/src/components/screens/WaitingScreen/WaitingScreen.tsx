import { useGame } from "@/context/GameContext";
import React, { useEffect, useState } from "react";
import styles from "./WaitingScreen.module.css";

function WaitingScreen() {
  const { waitingCountdownEnd, players } = useGame();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    console.log({ waitingCountdownEnd });
    if (waitingCountdownEnd) {
      const calculateRemaining = () => {
        const now = Date.now();
        const remaining = Math.max(
          0,
          Math.floor((waitingCountdownEnd! - now) / 1000)
        );
        setCountdown(remaining);
        if (remaining === 0 && timer) clearInterval(timer);
      };
      calculateRemaining();
      timer = setInterval(calculateRemaining, 1000);
    } else {
      setCountdown(null);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [waitingCountdownEnd]);

  if (!countdown) {
    return <div className={styles.waitingScreen}></div>;
  }

  return (
    <div className={styles.waitingScreen}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>{countdown}</span>
        </div>
        <div className={styles.body}>
          <ul className={styles.players}>
            {players?.map((player) => (
              <li key={player.name}>{player.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WaitingScreen;

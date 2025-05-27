import React from "react";
import styles from "./QuickPlayButton.module.css";
import { useGame } from "@/context/GameContext";

export default function QuickPlayButton({
  playerName,
}: {
  playerName: string | undefined;
}) {
  const { quickJoin } = useGame();

  const handleClick = () => {
    if (playerName && playerName != "") {
      quickJoin(playerName);
    }
  };

  return (
    <div className={styles.quickPlayButton}>
      <button
        disabled={playerName === ""}
        onClick={handleClick}
        className={styles.button}
      >
        QUICK MATCH
      </button>
    </div>
  );
}

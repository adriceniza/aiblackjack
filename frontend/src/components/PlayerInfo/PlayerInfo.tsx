"use client";

import { useGame } from "@/context/GameContext";
import React from "react";
import styles from "./PlayerInfo.module.css";

function PlayerInfo({ children }: { children: React.ReactNode }) {
  const { player } = useGame();
  if (!player) {
    return children;
  }
  return (
    <div className={styles.playerInfoContainer}>
      <header className={styles.playerInfoHeader}>
        <p>{player.name}</p>
        <p>Balance: {player.balance}$</p>
      </header>
      {children}
    </div>
  );
}

export default PlayerInfo;

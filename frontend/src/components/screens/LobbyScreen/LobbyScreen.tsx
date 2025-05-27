"use client";

import styles from "./LobbyScreen.module.css";

import React, { useState } from "react";
import TextField from "@/components/ui/TextField/TextField";
import QuickPlayButton from "@/components/forms/QuickPlayButton/QuickPlayButton";

export default function Entry() {
  const [playerName, setPlayerName] = useState<string | undefined>(undefined);

  return (
    <div className={styles.lobbyContainer}>
      <div className={styles.profileContainer}>
        <TextField
          label="Enter a name"
          value={playerName?.trim() || ""}
          onChange={setPlayerName}
        />
      </div>
      <div className={styles.buttonsContainer}>
        {/* <JoinByCodeForm /> */}
        <QuickPlayButton playerName={playerName} />
      </div>
    </div>
  );
}

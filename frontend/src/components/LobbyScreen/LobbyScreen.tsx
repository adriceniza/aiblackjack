"use client";

import styles from "./LobbyScreen.module.css";

import React from "react";
import TextField from "../TextField/TextField";
import QuickPlayButton from "../QuickPlayButton/QuickPlayButton";
import { useGame } from "@/context/GameContext";

export default function Entry() {
    const { playerName, setPlayerName } = useGame();

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
                <QuickPlayButton />
            </div>
        </div>
    );
}

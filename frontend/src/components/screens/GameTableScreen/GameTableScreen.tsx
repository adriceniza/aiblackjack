"use client";

import React from "react";
import styles from "./GameTableScreen.module.css";
// import Deck from "../../game/Deck/Deck";
import DealerHand from "../../game/DealerHand/DealerHand";
import LocalHand from "../../game/LocalHand/LocalHand";
import { useGame } from "@/context/GameContext";
import Results from "@/components/game/Results/Results";
import { GameState } from "@/types/game";
import BettingScreen from "../BettingScreen/BettingScreen";
import WaitingScreen from "../WaitingScreen/WaitingScreen";

export default function GameTableScreen() {
  const { state } = useGame();

  if (state === GameState.BETTING) {
    return <BettingScreen />;
  }

  if (state === GameState.WAITING_FOR_PLAYERS) {
    return <WaitingScreen />;
  }

  return (
    <div className={styles.gameTable}>
      <Results />
      <div className={styles.topDeckContainer}>
        {/* <Deck /> */}
        <DealerHand />
      </div>
      <div className={styles.bottomDeckContainer}>
        <LocalHand />
      </div>
    </div>
  );
}

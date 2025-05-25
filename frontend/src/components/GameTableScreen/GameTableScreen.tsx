"use client";

import React from "react";
import styles from "./GameTableScreen.module.css";
import Deck from "../Deck/Deck";
import DealerHand from "../DelaerHand/DealerHand";
import LocalHand from "../LocalHand/LocalHand";
import Results from "../Results/Results";

export enum WSMessageType {
  NEW_GAME = "new_game",
  GAME_STATE = "game_state",
  PLAYER_ACTION = "player_action",
  END_GAME = "end_game",
  JOIN_BY_CODE = "join_by_code",
  QUICK_JOIN = "quick_join",
}

export interface Player {
  id: number;
  name: string;
  hand: string[];
  is_dealer: boolean;
  is_busted: boolean;
}

export interface GameState {
  players: Player[];
  current_player_index: number;
  dealer: Player;
  type: string;
  state: string;
  winners: Player[];
  pushes: Player[];
}

export default function GameTable() {
  return (
    <div className={styles.gameTable}>
      <Results />
      <div className={styles.topDeckContainer}>
        <Deck />
        <DealerHand />
      </div>
      <div className={styles.bottomDeckContainer}>
        <LocalHand />
      </div>
    </div>
  );
}

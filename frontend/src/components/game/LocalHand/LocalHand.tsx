import { useGame } from "@/context/GameContext";
import React from "react";
import styles from "./LocalHand.module.css";
import { WSOutcomingMessageType } from "@/types/game";
import HandCards from "../HandCards/HandCards";
import { Plaster } from "next/font/google";

enum WSActionType {
  HIT = "hit",
  STAND = "stand",
  DOUBLE_DOWN = "double_down",
  SPLIT = "split",
}

export default function LocalHand() {
  const { state, sendMessage, player } = useGame();

  if (!state) {
    return null;
  }
  if (!player) {
    return null;
  }

  function handleHit() {
    sendMessage({
      type: WSOutcomingMessageType.PLAYER_ACTION,
      action: WSActionType.HIT,
    });
  }

  function handleStand() {
    sendMessage({
      type: WSOutcomingMessageType.PLAYER_ACTION,
      action: WSActionType.STAND,
    });
  }

  return (
    <div className={styles.localPlayerContainer}>
      <HandCards player={player} />
      <div className={styles.actionsContainer}>
        {player.is_turn ? (
          <button
            data-isturn={player.is_turn}
            disabled={!player.is_turn}
            className={styles.button}
            onClick={handleHit}
          >
            HIT
          </button>
        ) : (
          <div></div>
        )}
        <div className={styles.betContainer}>
          <span>{player.current_bet}$</span>
        </div>
        {player.is_turn && (
          <button
            disabled={!player.is_turn}
            className={`${styles.button} ${styles.stand}`}
            onClick={handleStand}
          >
            STAND
          </button>
        )}
      </div>
    </div>
  );
}

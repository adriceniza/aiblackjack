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
        <button
          data-isturn={player.is_turn}
          disabled={!player.is_turn}
          className={styles.button}
          onClick={handleHit}
        >
          HIT
        </button>
        {player.has_blackjack && (
          <span className={styles.blackjack}>BLACKJACK</span>
        )}
        {player.is_busted && <span className={styles.busted}>BUSTED</span>}
        {player.hand_value === 21 && !player.has_blackjack && (
          <span className={styles.twentyone}>TWENTYONE</span>
        )}
        <div className={styles.betContainer}>
          <span>{player.current_bet}$</span>
        </div>
        <button
          disabled={!player.is_turn}
          className={styles.button}
          onClick={handleStand}
        >
          STAND
        </button>
      </div>
    </div>
  );
}

import { useGame } from '@/context/GameContext';
import React, { useEffect } from "react";
import styles from './LocalHand.module.css'
import HandCards from '../HandCards/HandCards';
import { Player, WSMessageType } from '../GameTableScreen/GameTableScreen';

enum WSActionType {
  HIT = "hit",
  STAND = "stand",
  DOUBLE_DOWN = "double_down",
  SPLIT = "split",
}

export default function LocalHand() {
    const { gameState, sendMessage, player } = useGame();

    if (!gameState) {
      return null;
    }
    if (!player) {
      return null;
    }

    function handleHit() {
      sendMessage({
        type: WSMessageType.PLAYER_ACTION,
        action: WSActionType.HIT,
      });
    }

    function handleStand() {
      sendMessage({
        type: WSMessageType.PLAYER_ACTION,
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

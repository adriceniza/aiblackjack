import { useGame } from '@/context/GameContext';
import React from 'react'
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
    const { gameState, playerName, sendMessage } = useGame();

    if (!gameState) {
        return null;
    }

    const localPlayer = gameState.players.find((p: Player) => p.name === playerName);

    if (!localPlayer) {
        return null;
    }

    function handleHit() {
        sendMessage({
            type: WSMessageType.PLAYER_ACTION,
            action: WSActionType.HIT,
        })
    }

    function handleStand() {

        sendMessage({
            type: WSMessageType.PLAYER_ACTION,
            action: WSActionType.STAND,
        });
    }

    return (
        <div className={styles.localPlayerContainer}>
            <HandCards player={localPlayer} />
            <div className={styles.actionsContainer}>
                <button disabled={!localPlayer.is_turn} className={styles.button} onClick={handleHit}>HIT</button>
                <div className={styles.betContainer}>
                    <span>1280$</span>
                </div>
                <button disabled={!localPlayer.is_turn} className={styles.button} onClick={handleStand}>STAND</button>
            </div>
        </div>
    )
}

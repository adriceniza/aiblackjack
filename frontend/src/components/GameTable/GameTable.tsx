"use client";

import { usePlayer } from "@/context/PlayerContext";
import React, { use, useEffect, useRef, useState } from "react";
import styles from "./GameTable.module.css";
import { useWebSocket } from "@/hooks/useWebSocket";

const WEBSOCKET_URL = 'ws://localhost:8080/ws';

enum WSMessageType {
  NEW_GAME = "new_game",
  GAME_STATE = "game_state",
  PLAYER_ACTION = "player_action",
  END_GAME = "end_game",
}

enum WSActionType {
  HIT = "hit",
  STAND = "stand",
  DOUBLE_DOWN = "double_down",
  SPLIT = "split",
}

interface Player {
  id: number;
  name: string;
  hand: string[];
  is_dealer: boolean;
  is_busted: boolean;
}

interface GameState {
  players: Player[];
  current_player_index: number;
  dealer: Player;
  type: string;
  state: string;
  winners: Player[];
  pushes: Player[];
}

export default function GameTable() {
  const [gameState, setGameState] = useState<GameState | undefined>();
  const { playerName } = usePlayer();
  const { messages, sendMessage, isConnected } = useWebSocket(WEBSOCKET_URL);

  useEffect(() => {
    console.log("Game state:", gameState);
  }, [gameState]);

  function renderCards(player: Player) {
    return player.hand.map((card, index) => {
      if (card === "??") {
        return <div key={index} className={styles.card}>
          <img src="/assets/cards/back.png" alt="Back" />
        </div>;
      }
      return <div key={index} className={styles.card}>
        <img src={`/assets/cards/${card}.png`} alt={card} />
      </div>;
    });
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

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === WSMessageType.GAME_STATE) {
        setTimeout(() => {
          setGameState(lastMessage);
        }, 100);
      }
    }
  }, [messages]);

  useEffect(() => {
    sendMessage({ type: WSMessageType.NEW_GAME, player: playerName })
  }, [isConnected])

  useEffect(() => {
    console.log("Game state updated:", gameState);
  }, [gameState]);

  return (
    <div className={styles.gameTable}>
      <span>{gameState?.state}</span>
      <span>WINNERS: {gameState?.winners?.[0]?.name}</span>
      <span>PUSHES: {gameState?.pushes?.[0]?.name}</span>
      <span className={styles.turn}>Turn: {gameState?.current_player_index}</span>
      <div className={styles.dealerContainer}>
        {gameState?.dealer && renderCards(gameState.dealer)}
      </div>
      <div className={styles.playerContainer}>
        {gameState?.players[0] && <span> {gameState?.players[0].name} </span>}
        {gameState?.players[0].is_busted && <span> BUSTED </span>}
        {gameState?.players[0] && renderCards(gameState.players[0])}
      </div>

      {
        gameState?.current_player_index === 0 && <div className={styles.actionsContainer}>
        <button className={styles.button} onClick={handleHit}>Hit</button>
        <button className={styles.button} onClick={handleStand}>Stand</button>
      </div>
      }
    </div>
  );
}

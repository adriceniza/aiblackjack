"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { WSIncomingMessageType } from "@/constants";
import App from "next/app";

const WS_URL = "ws://localhost:8080/ws";

export enum AppState {
  LOBBY = "LOBBY",
  WAITING = "WAITING",
  IN_GAME = "IN_GAME",
  BETTING = "BETTING",
}

interface GameContextType {
  appState: AppState;
  gameState: any | null;
  playerName: string;
  setPlayerName: (name: string) => void;
  joinSession: (code: string) => void;
  quickJoin: () => void;
  sendMessage: (msg: any) => void;
  isConnected: boolean;
  playerId: number | null;
  player: any | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [playerName, setPlayerName] = useState("");
  const [appState, setAppState] = useState<AppState>(AppState.LOBBY);
  const [gameState, setGameState] = useState<any | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [player, setPlayer] = useState<any | null>(null);

  const { messages, setMessages, sendMessage, isConnected } =
    useWebSocket(WS_URL);

  useEffect(() => {
    if (messages.length === 0) return;

    const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);

    sortedMessages.forEach((msg) => {
      switch (msg.type) {
        case WSIncomingMessageType.JOINED_SESSION:
          setPlayerId(msg.id);
          setAppState(AppState.WAITING);
          break;
        case WSIncomingMessageType.GAME_STATE:
          setPlayer(msg.players.find((p: any) => p.id === playerId));
          setGameState(msg);

          if (msg.state === "betting") {
            setAppState(AppState.BETTING);
          } else {
            setAppState(AppState.IN_GAME);
          }

          break;
        case WSIncomingMessageType.ERROR:
          setAppState(AppState.LOBBY);
          break;
      }
    });

    setMessages([]);
  }, [messages]);

  function joinSession(code: string) {
    if (!code) return alert("Set session code first");
    if (!playerName) return alert("Set player name first");
    sendMessage({ type: "join_by_code", code, player: playerName });
  }
  function quickJoin() {
    if (!playerName) return alert("Set player name first");
    sendMessage({ type: "quick_join", player_name: playerName });
  }

  useEffect(() => {
    console.log("Player id:", playerId);
  }, [playerId]);

  return (
    <GameContext.Provider
      value={{
        appState,
        gameState,
        playerName,
        setPlayerName,
        joinSession,
        quickJoin,
        sendMessage,
        isConnected,
        playerId,
        player,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { WSIncomingMessageType } from "@/constants";

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
  player: any | null;
  players?: any[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [playerName, setPlayerName] = useState("");
  const [appState, setAppState] = useState<AppState>(AppState.LOBBY);
  const [gameState, setGameState] = useState<any | null>(null);
  const [player, setPlayer] = useState<any | null>(null);
  const [players, setPlayers] = useState<any[]>([]);

  const { messages, setMessages, sendMessage, isConnected } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws"
  );

  useEffect(() => {
    if (messages.length === 0) return;

    const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);

    sortedMessages.forEach((msg) => {
      switch (msg.type) {
        case WSIncomingMessageType.JOINED_SESSION:
          setAppState(AppState.WAITING);
          setPlayers(msg.players);
          setPlayer(msg.player);
          break;
        case WSIncomingMessageType.GAME_STATE:
          setPlayer(msg.player);
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
        player,
        players,
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

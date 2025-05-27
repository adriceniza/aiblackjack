"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import {
  GameContextType,
  GameState,
  WSIncomingMessageType,
} from "@/types/game";
import { PlayerDTO } from "@/types/player";

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState | undefined>();
  const [dealer, setDealer] = useState<PlayerDTO | undefined>(undefined);
  const [player, setPlayer] = useState<PlayerDTO | undefined>(undefined);
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [waitingCountdownEnd, setWaitingCountdownEnd] = useState<
    number | undefined
  >(undefined);
  const [winners, setWinners] = useState<PlayerDTO[]>();
  const [pushes, setPushes] = useState<PlayerDTO[]>();

  const { messages, setMessages, sendMessage, isConnected } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws"
  );

  useEffect(() => {
    if (messages.length === 0) return;

    const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);

    sortedMessages.forEach((msg) => {
      switch (msg.type) {
        case WSIncomingMessageType.JOINED_SESSION:
          setPlayers(msg.players);
          setPlayer(msg.player);
          setDealer(msg.dealer);
          setState(msg.state);
          setWaitingCountdownEnd(msg?.waiting_countdown_end);
          break;
        case WSIncomingMessageType.GAME_STATE:
          setPlayer(msg.player);
          setDealer(msg.dealer);
          setState(msg.state);
          setWinners(msg.winners);
          setPushes(msg.pushes);
          setWaitingCountdownEnd(msg?.waiting_countdown_end);
          break;
        case WSIncomingMessageType.ERROR:
          console.log("Incoming error from WS");
          break;
      }
    });

    setMessages([]);
  }, [messages]);

  function joinSession(code: string, name: string) {
    if (!code) return alert("Set session code first");
    if (!name) return alert("Set player name first");
    sendMessage({ type: "join_by_code", code, player: name });
  }
  function quickJoin(name: string) {
    if (!name) return alert("Set player name first");
    sendMessage({ type: "quick_join", player_name: name });
  }

  return (
    <GameContext.Provider
      value={{
        state,
        isConnected,
        joinSession,
        quickJoin,
        sendMessage,
        dealer,
        player,
        players,
        waitingCountdownEnd,
        winners,
        pushes,
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

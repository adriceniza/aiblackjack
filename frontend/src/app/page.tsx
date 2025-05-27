"use client";

import BettingScreen from "@/components/BettingScreen/BettingScreen";
import GameTableScreen from "@/components/GameTableScreen/GameTableScreen";
import LobbyScreen from "@/components/LobbyScreen/LobbyScreen";
import { AppState, useGame } from "@/context/GameContext";

export default function Page() {
  const game = useGame();

  if (game.appState === AppState.LOBBY) {
    return <LobbyScreen />;
  }

  if (game.appState === AppState.BETTING) {
    return <BettingScreen />;
  }

  return <GameTableScreen />;
}

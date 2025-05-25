"use client";

import GameTableScreen from "@/components/GameTableScreen/GameTableScreen";
import LobbyScreen from "@/components/LobbyScreen/LobbyScreen";
import { useGame } from "@/context/GameContext";

export default function Page() {
  const game = useGame();

  if (game.appState === "LOBBY") {
    return <LobbyScreen />;
  }

  return <GameTableScreen />
  
}

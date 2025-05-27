"use client";

import GameTableScreen from "@/components/screens/GameTableScreen/GameTableScreen";
import LobbyScreen from "@/components/screens/LobbyScreen/LobbyScreen";
import WaitingScreen from "@/components/screens/WaitingScreen/WaitingScreen";
import { useGame } from "@/context/GameContext";
import { useEffect } from "react";

export default function Page() {
  const { isConnected, state } = useGame();

  useEffect(() => {
    console.log({ state, isConnected });
  }, [state, isConnected]);

  if (!isConnected) {
    return <div>Waiting for WS</div>;
  }

  if (!state) {
    return <LobbyScreen />;
  }

  return <GameTableScreen />;
}

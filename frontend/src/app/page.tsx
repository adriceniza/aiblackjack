"use client";

import { usePlayer } from "@/context/PlayerContext";
import GameTable from "@/components/GameTable/GameTable";
import GameEntry from "@/components/GameEntry/GameEntry";
import { useEffect } from "react";

export default function Page() {
  const { playerName } = usePlayer();


  useEffect(() => {
    console.log("Player name:", playerName);
  }, [playerName]);


  if (!playerName) {
    return <GameEntry />;
  }


  return (
    <GameTable />
  );
}

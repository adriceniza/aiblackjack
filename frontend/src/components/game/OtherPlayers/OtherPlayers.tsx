import { PlayerDTO } from "@/types/player";
import HandCards from "../HandCards/HandCards";
import { useGame } from "@/context/GameContext";
import styles from "./OtherPlayers.module.css";
import { useEffect, useState } from "react";

export default function OtherPlayers() {
  const { players, player: localPlayer } = useGame();
  const [leftPlayers, setLeftPlayers] = useState<PlayerDTO[]>([]);
  const [rightPlayers, setRightPlayers] = useState<PlayerDTO[]>([]);

  useEffect(() => {
    if (!players || !localPlayer) return;

    const otherPlayers = players.filter((p) => p.id !== localPlayer.id);

    setLeftPlayers(otherPlayers.slice(0, 3));
    setRightPlayers(otherPlayers.slice(3, 6));
  }, [players, localPlayer]);

  return (
    <div className={styles.otherPlayers}>
      <div className={styles.leftContainer}>
        <RenderPlayers players={leftPlayers} />
      </div>

      <div className={styles.rightContainer}>
        <RenderPlayers players={rightPlayers} />
      </div>
    </div>
  );
}

function RenderPlayers({ players }: { players: PlayerDTO[] }) {
  return players.map((player) => (
    <div className={styles.playerSlot} key={player.id}>
      <span>
        {player.name} - {player.current_bet}
      </span>
      <HandCards player={player} isMini />
    </div>
  ));
}

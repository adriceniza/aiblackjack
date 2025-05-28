import React from 'react'
import styles from "./HandCards.module.css";
import Card from '../Card/Card';
import { PlayerDTO } from "@/types/player";

export default function HandCards({ player }: { player: PlayerDTO }) {
  return (
    <div className={styles.handContainer}>
      {player.hand.map((card, index) => {
        if (card === "??") {
          return <Card key={index} card={"back"} />;
        }
        return <Card key={index} card={card} />;
      })}
    </div>
  );
}

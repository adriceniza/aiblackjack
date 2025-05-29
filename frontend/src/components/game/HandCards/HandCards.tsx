import React from 'react'
import styles from "./HandCards.module.css";
import Card from '../Card/Card';
import { PlayerDTO } from "@/types/player";

export default function HandCards({
  player: { hand, has_blackjack, is_busted, hand_value },
  isMini = false,
}: {
  player: PlayerDTO;
  isMini?: boolean;
}) {
  const labels = [
    { show: has_blackjack, text: "BLACKJACK", style: styles.blackjack },
    { show: is_busted, text: "BUSTED", style: styles.busted },
    {
      show: hand_value === 21 && !has_blackjack,
      text: "TWENTYONE",
      style: styles.twentyone,
    },
  ];

  return (
    <div className={`${styles.handContainer} ${isMini ? styles.isMini : ""}`}>
      {labels.map(
        ({ show, text, style }) =>
          show && (
            <span key={text} className={style}>
              {text}
            </span>
          )
      )}
      {hand.map((card, index) => {
        const offset = 0;

        return (
          <Card
            key={index}
            card={card == "??" ? "back" : card}
            isMini={isMini}
            offset={index * offset}
            zIndex={index}
          />
        );
      })}
    </div>
  );
}

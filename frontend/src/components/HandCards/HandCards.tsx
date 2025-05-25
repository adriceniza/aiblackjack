import React from 'react'
import styles from './HandCards.module.css'
import { Player } from '../GameTableScreen/GameTableScreen';

export default function HandCards({ player }: { player: Player }) {
  return <div className={styles.handContainer}>
    {player.hand.map((card, index) => {
        if (card === "??") {
            return <div key={index} className={styles.card}>
                <img src="/assets/cards/back.png" alt="Back" />
            </div>;
        }
        return <div key={index} className={styles.card}>
            <img src={`/assets/cards/${card}.png`} alt={card} />
        </div>;
    })}
  </div>
}

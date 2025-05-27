import React from 'react'
import styles from './HandCards.module.css'
import { Player } from '../GameTableScreen/GameTableScreen';
import Card from '../Card/Card';

export default function HandCards({ player }: { player: Player }) {

  return <div className={styles.handContainer}>
    {player.hand.map((card, index) => {
      if (card === "??") {
        return <Card key={index} card={'back'} />
      }
      return <Card key={index} card={card} />
    })}
  </div>
}

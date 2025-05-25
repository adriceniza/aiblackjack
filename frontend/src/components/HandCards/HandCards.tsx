import React, { use, useEffect, useRef, useState } from 'react'
import styles from './HandCards.module.css'
import { Player } from '../GameTableScreen/GameTableScreen';
import Card from '../Card/Card';

export default function HandCards({ player }: { player: Player }) {
  const dragSoundRef = useRef<HTMLAudioElement>(null);
  const [prevHand, setPrevHand] = useState<number>(player.hand.length);

  useEffect(() => {
    const newCards = player.hand.length - prevHand;
    if (newCards > 0 && dragSoundRef.current) {
      for (let i = 0; i < newCards; i++) {
        setTimeout(() => {
          dragSoundRef?.current?.play().catch(console.error);
        }, i * 100);
      }
    }
  }, [player.hand]);

  useEffect(() => {
    dragSoundRef.current = new Audio('/assets/sounds/drag.mp3');
  }, [])

  return <div className={styles.handContainer}>
    {player.hand.map((card, index) => {
      dragSoundRef.current?.play().catch(console.error);

      if (card === "??") {
        return <Card key={index} card={'back'} dragSoundRef={dragSoundRef} />
      }
      return <Card key={index} card={card} dragSoundRef={dragSoundRef} />
    })}
  </div>
}

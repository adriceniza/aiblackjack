import { useEffect, useState } from 'react';
import styles from './Deck.module.css';
import { useGame } from '@/context/GameContext';

export default function Deck() {
  const { gameState } = useGame();

  const [remaining, setRemaining] = useState(gameState?.remaining_cards);

  useEffect(() => {
    setRemaining(gameState?.remaining_cards);
  }, [gameState]);

  return (
    <div className={styles.deckContainer}>
      {Array.from({ length: gameState?.remaining_cards }).map((_, i) => (
        <div
          key={i}
          className={`${styles.cardBack} ${i === remaining - 1 }`}
          style={{ top: i * 0.5 }}
        >
          <img src="/assets/cards/back.png" alt="Back" />
        </div>
      ))}
    </div>
  );
}
